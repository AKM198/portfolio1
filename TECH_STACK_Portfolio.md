# tech_stack_portfolio.md — Portfolio Website: Tech Stack

> **Audience:** coding agent (Antigravity / Codex / Cursor). **Owner:** Akmal.
> **Companion of:** `design.md` (design system, architecture, API contract). On conflict, `design.md` wins.
> **Principle:** minimal dependencies. Every package below has a one-line reason. If it is not listed, **do not install it** — ask first.

---

## 1. Stack at a glance

| Layer | Choice |
|-------|--------|
| Language (frontend) | **TypeScript**, `strict` |
| UI library | **React** (current stable major) — a *library*, not a framework: no router, data layer, or SSR comes with it. This project needs none of them. |
| Build tool | **Vite** (`react-ts` template) |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite` |
| Backend | **Laravel 12**, PHP ≥ 8.2, API-only |
| Database | **MySQL** (one table: `contact_messages`) |
| Hosting | **cPanel** (FTP/File Manager), no CI |
| Node | Current **LTS**, pinned in `.nvmrc` |

Versions: install the latest stable at project creation, commit the lockfile (`package-lock.json`, `composer.lock`), do not use `^`-drifting installs on deploy.

---

## 2. Frontend dependencies

### 2.1 Runtime (`dependencies`) — 7 packages

| Package | Why (one line) |
|---------|----------------|
| `react`, `react-dom` | UI library. |
| `motion` | Scroll-linked MorphCard (`useScroll` + `useTransform`) and reduced-motion hook; import from `motion/react`. |
| `@radix-ui/react-accordion` | FAQ accordion with keyboard + ARIA done correctly; not worth hand-rolling. |
| `axios` | HTTP client + response interceptor (named in the PRD blurb). Costs ~13 KB gzip for one POST — swapping to a `fetch` wrapper is a ~20-line change in `src/lib/api.ts` if the bundle budget gets tight. |
| `@fontsource/barlow-condensed` | Display/label font, self-hosted (weights 200/400/500, latin only). |
| `@fontsource-variable/inter` | Body font, self-hosted. |
| `@fontsource/jetbrains-mono` | Meta font, self-hosted (400, latin only). |

### 2.2 Dev (`devDependencies`)

| Package | Why |
|---------|-----|
| `vite`, `@vitejs/plugin-react` | Build + dev server + React transform. |
| `typescript`, `@types/react`, `@types/react-dom` | Types. |
| `tailwindcss`, `@tailwindcss/vite` | Styling; v4 needs no PostCSS config and no `tailwind.config.js`. |
| `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks` | Catches real bugs (stale deps, hook rules) — you have never run a linter, start here. |
| `prettier` | Formatting; you care about consistent indentation, so make the tool enforce it. |

### 2.3 Explicitly NOT installed

| Not installed | Reason |
|---------------|--------|
| `react-router` | Single page; sections are anchors. `.htaccess` handles the fallback. |
| Redux / Zustand / Jotai | No global state. One small context (`ActiveProjectContext`). |
| TanStack Query | One POST, no caching/refetch needs. |
| `react-hook-form`, `zod`, `yup` | Three fields. Manual validation in ~20 lines; server is the authority. |
| shadcn/ui, MUI, Chakra | Design system is custom (`design.md` §4); a UI kit would fight it. |
| `react-helmet` / `react-helmet-async` | Meta tags are static in `index.html`. |
| `clsx` / `classnames` | Template strings are enough at this size. |
| `framer-motion` | Use `motion` only — never both. |
| GSAP | Decision D5: `motion`. |
| `three` / any WebGL | Film-grain canvas is skipped (`design.md` §4.6). |
| Icon packs (Font Awesome, Lucide…) | Inline the 3–5 SVGs needed (plus/minus, arrow, GitHub, LinkedIn). |
| `lodash`, `moment`, `dayjs` | Nothing here needs them. |

Adding any package requires: a stated reason, bundle impact checked, and an entry in this file.

---

## 3. TypeScript configuration

Scaffold: `npm create vite@latest frontend -- --template react-ts`, then tighten.

```jsonc
// tsconfig.app.json — compilerOptions (merge into the generated file)
{
  "strict": true,
  "noUncheckedIndexedAccess": true,   // array[i] is T | undefined — forces handling
  "noImplicitOverride": true,
  "noFallthroughCasesInSwitch": true,
  "verbatimModuleSyntax": true,       // use `import type` for types
  "baseUrl": ".",
  "paths": { "@/*": ["src/*"] }
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
```

```ts
// src/vite-env.d.ts — type the env so a typo is a compile error
interface ImportMetaEnv {
  readonly VITE_API_URL: string; // public value; never put secrets in VITE_*
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

Rules for the agent:
- No `any`. If a type is truly unknown, use `unknown` and narrow.
- No non-null assertions (`!`) except on `document.getElementById("root")` in `main.tsx`.
- Props typed with `type Props = {...}`; components are plain functions, no `React.FC`.
- Content files export typed `as const` data or explicit interfaces (`Project`, `FaqItem`, `Capability`).
- API errors are the discriminated union `ApiError` from `design.md` §7 — handle every `kind`.

---

## 4. React conventions (minimal)

- Function components + hooks only. No classes.
- State stays local; lift only when two siblings need it. The only context is `ActiveProjectContext`.
- No `useEffect` for derived data — compute during render. `useEffect` is for subscriptions only (IntersectionObserver, ResizeObserver, media queries) and always returns cleanup.
- Scroll-linked animation uses `motion` values (`useScroll`/`useTransform`) — never `setState` on scroll.
- Lists have stable `key`s (project `id`, never the array index).
- Forms are controlled; submit handler is `onSubmit` on a `<form>` wired to a real `<button type="submit">`.
- Every async call has `try/catch` mapped to UI state (idle / submitting / success / error).

---

## 5. Scripts

```jsonc
// frontend/package.json — scripts
{
  "dev": "vite",
  "lint": "eslint .",
  "format": "prettier --write .",
  "typecheck": "tsc -b --noEmit",
  "check:placeholders": "node scripts/check-placeholders.mjs",
  "build": "npm run check:placeholders && tsc -b && vite build",
  "preview": "vite preview"
}
```

`scripts/check-placeholders.mjs` fails the build if any file in `src/content/` contains `[ISI`, `[FULL NAME]`, or `[BIO]`.

Bundle check (no extra dependency): `npx vite-bundle-visualizer` before each deploy; initial JS must stay ≤ 150 KB gzip.

Files to commit: `.nvmrc`, `.prettierrc`, `eslint.config.js`, `package-lock.json`. Never commit `.env` files (commit `.env.example` only).

---

## 6. Backend stack (Laravel API-only)

| Item | Choice | Note |
|------|--------|------|
| Framework | Laravel 12, PHP ≥ 8.2 | Select the same PHP version in cPanel MultiPHP Manager. |
| API scaffolding | `php artisan install:api` | Creates `routes/api.php`. |
| Validation | Form Request (`StoreContactRequest`) | Per `design.md` §6. |
| Mail | Laravel Mailable over SMTP (domain mailbox) | `MAIL_MAILER=log` in dev. |
| Rate limiting | Named limiter `contact` (3/min, 20/day per IP) | Core feature, no package. |
| Database | MySQL, migration for `contact_messages` | Eloquent only, no raw queries. |
| Tests | PHPUnit (Laravel default), 5 feature tests | `design.md` §6.4. |
| Formatter | Laravel Pint | Dev only. |

**Do not install in this project:** Sanctum, Spatie Laravel-Permission, Passport, Telescope, Horizon, Livewire/Inertia. There is no authentication, no roles, and no queue worker on cPanel. (Those belong to Klinik Online, not here.)

**Queue:** none. Mail is sent synchronously inside `try/catch`; the message is already persisted (`design.md` D3). `QUEUE_CONNECTION=sync`.

**Cache/session drivers:** `CACHE_STORE=file` is enough for the throttler on shared hosting; `SESSION_DRIVER` is irrelevant (stateless API) but leave the default so the framework boots.

---

## 7. Repository layout

```
portfolio/
├─ frontend/        # Vite + React + TS (structure in design.md §7)
├─ api/             # Laravel 12
├─ docs/reference/  # portavia-about.png (About layout reference)
├─ design.md
└─ tech_stack_portfolio.md
```

Two separate deploy targets: `frontend/dist` → `public_html/`; `api/` → outside `public_html`, subdomain docroot = `api/public` (`design.md` §8).

---

## 8. Environments

| Variable | Where | Dev | Prod |
|----------|-------|-----|------|
| `VITE_API_URL` | frontend `.env` / `.env.production` | `http://localhost:8000/api` | `https://api.yourdomain.com/api` |
| `APP_ENV`, `APP_DEBUG` | api `.env` | `local`, `true` | `production`, **`false`** |
| `FRONTEND_URL` | api `.env` | `http://localhost:5173` | `https://yourdomain.com` |
| `CONTACT_TO` | api `.env` | own inbox | own inbox |
| `MAIL_*` | api `.env` | `log` | SMTP of a domain mailbox |

`env()` is read **only** inside `config/*.php`; application code uses `config()`. After the production `.env` is final: `php artisan config:cache && php artisan route:cache`.

---

## 9. Definition of done (stack level)

- [ ] `npm run build` passes: placeholder check, `tsc -b`, `vite build`.
- [ ] `npm run lint` and `npm run typecheck` clean; zero `any`.
- [ ] `package.json` dependencies match §2 exactly (7 runtime packages); anything extra has a documented reason.
- [ ] Initial JS ≤ 150 KB gzip (checked with the visualizer).
- [ ] Backend has no Sanctum/Spatie installed; 5 feature tests green.
- [ ] `APP_DEBUG=false` and `config:cache` verified on the server.