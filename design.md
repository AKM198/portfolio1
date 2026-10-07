# design.md — Portfolio Website: System & Design Spec

> **Audience:** coding agent (Antigravity / Codex / Cursor). **Owner:** Akmal.
> **Status:** replaces every previous design.md.
> **Removed:** the retro-editorial direction (paper `#EAE0C8`, maroon `#3D0808`, brass, stamp red; Fraunces / Source Serif 4 / IBM Plex Mono). Do not reintroduce any of it.
> **Kept:** the site *structure* (section order, scroll-morphing card, About layout, simple project list, no hamburger nav).
> **Visual system:** derived from the Hermes Agent Desktop page (`hermes-agent.nousresearch.com/desktop`). Tags: **(H)** = extracted from Hermes' CSS; **(P)** = from the owner-supplied blue scale `--primary-50…950` (blue + white dominant, see §4.2); **(ours)** = our own decision because no usable source value existed.
> **Conflict order:** this file → PRD → `tech_stack_portfolio.md`.

---

## 0. Assumptions & placeholders (confirm or correct before coding)

| ID | Assumption | If wrong |
|----|-----------|----------|
| A1 | Content language is English only for v1. Terminology rule still applies: "PKL" in Indonesian text, "Internship" in English text. | Add an i18n layer — out of scope for v1. |
| A2 | Tailwind CSS **v4** (CSS-first `@theme`). | On v3, map the tokens in §4.2 into `theme.extend` in `tailwind.config.js`. |
| A3 | React + Vite + **TypeScript**, no router (single page). | Rename `.tsx` → `.jsx`, drop the types. |
| A4 | SPA served from the root domain; Laravel API served from `api.` subdomain. | See §8 for the same-origin variant. |
| A5 | Laravel 12, PHP ≥ 8.2 (select the matching PHP version in cPanel MultiPHP Manager). | Adjust `bootstrap/app.php` bits in §6. |

Placeholders that must stay visible until Akmal fills them: `[FULL NAME]`, `[ISI DETAIL]` (Foody), `[ISI HASIL]` (result/impact per project), `[GITHUB_URL]`, `[LINKEDIN_URL]`, `[BIO]`. Never invent content for these.

---

## 1. Requirements

### 1.1 Functional

| ID | Requirement |
|----|-------------|
| FR-1 | One page, six sections in fixed order: **Home → Capabilities → About → Projects → FAQ → Contact**, then footer. |
| FR-2 | Persistent navigation with anchor links. **No hamburger at any breakpoint.** Active section is highlighted (scrollspy). |
| FR-3 | A pinned nav bar slides in once the header has scrolled out of view. |
| FR-4 | One persistent **MorphCard** that changes position/rotation per section (md and up; static below md). |
| FR-5 | Projects = simple list of three: Klinik Online, Foody, Portfolio Website. Each row: name, 1–2 sentence blurb that includes result/impact, stack tags, links. **No case-study pages.** Quality over quantity — do not add filler projects. |
| FR-6 | About contains: bio, PKL experience (PT Laskar Teknologi Mulia, Jan–Apr 2026), education (S1 Informatika, Itenas), TOEIC 830, "Download CV" (PDF). |
| FR-7 | FAQ accordion. |
| FR-8 | Contact form → `POST /api/contact`, with idle / submitting / success / error states. |
| FR-9 | All copy lives in `src/content/*.ts`. No CMS, no DB for content. |

### 1.2 Non-functional

| Area | Target |
|------|--------|
| Performance | Lighthouse mobile ≥ 90; LCP ≤ 2.5 s; CLS ≤ 0.1; initial JS ≤ 150 KB gzip. LCP element must be the hero **text**, not an image. |
| Accessibility | WCAG 2.2 AA contrast; fully keyboard-operable; visible focus; `prefers-reduced-motion` respected; semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`). |
| Security | Env separation (dev/prod), rate limiting, honeypot, CORS allowlist, `APP_DEBUG=false` in prod, security headers. See §6.5 for why CSRF is *not* the control here. |
| Deployment | cPanel + FTP/File Manager. No Node on the server. No CI (v1). |
| Share/SEO | SPA is not server-rendered → static `<title>`, meta description, OG/Twitter tags hard-coded in `index.html`. |

### 1.3 Constraints
Solo developer; manual deploy; React + Vite + Tailwind frontend; Laravel API-only backend; MySQL.

---

## 2. High-level design

```
Browser
  │  GET /                       ┌──────────────────────────────────────────────┐
  ├─────────────────────────────▶│ yourdomain.com  (public_html)                │
  │                              │  dist/ static files + .htaccess (SPA fallback)│
  │                              └──────────────────────────────────────────────┘
  │  POST /api/contact (JSON)    ┌──────────────────────────────────────────────┐
  └─────────────────────────────▶│ api.yourdomain.com  (Laravel, docroot=public)│
                                 │  CORS allowlist ─▶ throttle:contact          │
                                 │   ─▶ StoreContactRequest (validate)          │
                                 │   ─▶ ContactController@store                 │
                                 │        ├─ honeypot filled? → fake 201, stop  │
                                 │        ├─ ContactMessage::create → MySQL     │
                                 │        └─ Mail::send (try/catch, sync)       │
                                 │   ─▶ JSON 201 | 422 | 429                    │
                                 └──────────────────────────────────────────────┘
```

**Storage:** MySQL holds exactly one table (`contact_messages`). Portfolio content is static TypeScript. **API surface:** one endpoint (`POST /api/contact`) plus Laravel's built-in `GET /up` health route.

**State:** no global store. Local component state + one small context (`ActiveProjectContext`) so hovering a project row can swap the MorphCard image.

---

## 3. Information architecture

| # | `id` | Surface | Content | MorphCard state |
|---|------|---------|---------|-----------------|
| 1 | `home` | blue | Hero: centered card with full name; "FULLSTACK" aligned left, "DEVELOPER" aligned right | centered |
| 2 | `capabilities` | blue | Heading + 2×2 capability grid (left); right column is an empty slot for the card | moves right |
| 3 | `about` | blue | Layout follows the portavia reference (title / text / element positions), **excluding its numbered indicators** | rotates 360° horizontally |
| 4 | `projects` | paper | Simple project list | becomes a vertical card rotated 90° → rectangular image card |
| 5 | `faq` | paper | Accordion | released (hidden or docked, see §5.2) |
| 6 | `contact` | blue | Form + short copy | hidden |
| — | footer | blue | Ghost wordmark, links, copyright | hidden |

**Open item:** the About layout reference is not in this repo. Put a screenshot at `docs/reference/portavia-about.png` and implement against it; do not guess positions.

**Surface rule:** `blue` = hero-style surface, `paper` = light panel. Paper sections overlap the blue one above them as a panel (negative margin / sticky reveal is **P2**, not required for v1).

---

## 4. Design system

### 4.1 Principles
1. Flat, rectangular, no border-radius (Hermes uses `rounded-none` on buttons; (H)). Only exception: chip corner `2px` on the right edge (footer link chips).
2. Two surfaces only: blue and paper. Semantic variables swap per surface; components never hard-code colors.
3. Uppercase condensed labels, light oversized display type, small readable body.
4. Hover is **instant in, eased out**. Pressed state is physical (`scale(.98)`).
5. Decoration (noise, frame, arc border) never carries meaning and is disabled by reduced-motion where animated.

### 4.2 Tokens

```css
/* src/styles/tokens.css */
:root {
  /* Palette — owner-supplied blue scale (P). Blue + white dominant. */
  --primary-50:  #f1f5fd;
  --primary-100: #dee8fc;
  --primary-200: #bfd5ff;
  --primary-300: #93b7ff;
  --primary-400: #588cff;
  --primary-500: #205cff;
  --primary-600: #0034f2;
  --primary-700: #0028c3;
  --primary-800: #001c96;
  --primary-900: #01176c;
  --primary-950: #010e42;

  /* Semantic aliases — components use these, never raw hex */
  --c-blue:   var(--primary-600);   /* (P) brand surface; closest step to Hermes #0000f2 */
  --c-white:  #f2f2f2;              /* (H) --hermes-color-white; also "paper" */
  --c-yellow: #f2f200;              /* (H) accent — ::selection only */
  --c-ink:    var(--primary-800);   /* (P) body text on paper; Hermes ≈ #000091 */
  --c-muted:  color-mix(in srgb, var(--primary-900) 65%, var(--c-white)); /* (ours) secondary text on paper, ≈5.1:1 */
  --c-stage:  var(--primary-700);   /* (P) backdrop outside 1440px column; Hermes ≈ #0000c2 */
  --c-stroke: var(--primary-500);   /* (P) viewport frame + scrollbar track */

  /* Alpha helpers */
  --c-white-60: color-mix(in srgb, var(--c-white) 60%, transparent); /* (H) */
  --c-white-20: color-mix(in srgb, var(--c-white) 20%, transparent); /* (H) */

  /* Typography (families defined in §4.3) */
  --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
  --font-body:    "Inter Variable", "Inter", system-ui, sans-serif;
  --font-meta:    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Layout */
  --col:       1080px;                                   /* (H) --hw-teams-col */
  --pad-x:     max(24px, min(6vw, 80px));                /* (H) --hw-teams-pad-x */
  --page-max:  1440px;                                   /* (H) */
  --stage-min: 40px;                                     /* (H) */
  --frame:     5px;                                      /* (H) viewport frame width */
  --btn-h:     36px;                                     /* (H) --hw-teams-btn-h */
  --chip-h:    18px;                                     /* (H) --hpv2-chip-h */
  --icon:      16px;                                     /* (H) --hpv2-icon */
  --underline-offset: 5px;                               /* (H) */

  /* Shadows — (ours), tinted with --primary-950 instead of pure black. Hermes' --hpv2-shadow-* tokens were not in the extracted CSS. */
  --shadow-lift:        0 4px 14px rgb(1 14 66 / .25);
  --shadow-lift-strong: 0 6px 18px rgb(1 14 66 / .35);
  --shadow-press:       inset 0 2px 6px rgb(1 14 66 / .25);
  --shadow-press-strong:inset 0 3px 8px rgb(1 14 66 / .35);
  --shadow-hair:        0 0 0 1px currentColor;

  /* Motion */
  --ease-out: cubic-bezier(0, 0, .2, 1);                 /* (H) */
  --dur-fast: 150ms;                                     /* (H) */
}

/* Surface contracts. Components read ONLY these variables. */
[data-surface="blue"], :root {
  --bg: var(--c-blue);
  --fg: var(--c-white);
  --fg-2: var(--c-white-60);          /* ≥18px text only, see §4.9 */
  --line: var(--c-white);
  --line-divider: var(--c-white-20);
  --bg-2: var(--c-white-20);
  --bg-pressed: var(--c-white-20);
  --on-primary: var(--c-blue);
  --selection-bg: var(--c-yellow);
  --selection-fg: var(--c-blue);
}
[data-surface="paper"] {
  --bg: var(--c-white);
  --fg: var(--c-blue);
  --fg-text: var(--c-ink);            /* body copy on paper */
  --fg-2: var(--c-muted);
  --line: var(--c-blue);
  --line-divider: var(--primary-200);
  --bg-2: var(--primary-100);         /* hover (project row) */
  --bg-pressed: var(--primary-200);   /* pressed (accordion, project row) */
  --on-primary: var(--c-white);
  --selection-bg: var(--c-blue);
  --selection-fg: var(--c-white);
}
::selection { background: var(--selection-bg); color: var(--selection-fg); }
```

```css
/* src/styles/index.css (Tailwind v4) */
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  --color-primary-50: var(--primary-50);   --color-primary-100: var(--primary-100);
  --color-primary-200: var(--primary-200); --color-primary-300: var(--primary-300);
  --color-primary-400: var(--primary-400); --color-primary-500: var(--primary-500);
  --color-primary-600: var(--primary-600); --color-primary-700: var(--primary-700);
  --color-primary-800: var(--primary-800); --color-primary-900: var(--primary-900);
  --color-primary-950: var(--primary-950);
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-fg-2: var(--fg-2);
  --color-line: var(--line);
  --color-accent: var(--c-yellow);
  --font-display: var(--font-display);
  --font-sans: var(--font-body);
  --font-meta: var(--font-meta);
}
```

### 4.2.1 Palette roles (blue + white dominant)

Target proportion on screen: **~60% blue** (600 surfaces, 700 stage), **~35% white/paper**, **< 5% accents** (500 frame, yellow selection).

| Step | Hex | Role |
|------|-----|------|
| 50 | `#f1f5fd` | Reserved (tinted card background on paper, if needed) |
| 100 | `#dee8fc` | Hover background on paper (`--bg-2`) |
| 200 | `#bfd5ff` | Dividers on paper, pressed background |
| 300, 400 | `#93b7ff`, `#588cff` | Reserved in v1 (illustration / gradient use only) |
| 500 | `#205cff` | Viewport frame, scrollbar track |
| **600** | **`#0034f2`** | **Brand:** blue surface, primary button, headings/links on paper, `<meta name="theme-color">` |
| 700 | `#0028c3` | Stage backdrop outside the 1440px column |
| 800 | `#001c96` | Ink: body copy on paper |
| 900 | `#01176c` | Base for `--c-muted` (mixed with white) |
| 950 | `#010e42` | Shadow tint; reserved for dark overlays |

Rules:
- No raw hex outside `tokens.css`. Components use `--bg`, `--fg`, `--line`… or the `primary-*` utilities.
- Paper stays neutral `#f2f2f2` (Hermes value), not a tinted white, so blue remains the only chroma on the page.
- `index.html`: `<meta name="theme-color" content="#0034f2">`.
- **Known deviation from Hermes:** Hermes' blue is `#0000f2` (hue 240°, pure ultramarine). Step 600 is `#0034f2` (hue ≈ 227°) — slightly more azure, as is the whole scale. Stage (700) and ink (800) are approximations of Hermes' `#0000c2` and `#000091`. Judge by eye on a real screen.

### 4.3 Typography

**Hermes ships proprietary fonts** (Rules Gothic Condensed/Compressed, Rules Variable, Sigurd) and a font file literally named `AeonikFonoProTRIAL` (trial license). **Do not use or hot-link any of them.** Substitutes (all OFL, self-hosted via Fontsource):

| Hermes role | Hermes font | Ours |
|-------------|-------------|------|
| Display / labels / nav | Rules Gothic Condensed / Compressed, Rules Condensed | **Barlow Condensed** (200, 400, 500) |
| Body | Rules Variable | **Inter Variable** |
| Meta / terminal-ish | Aeonik Fono Pro TRIAL | **JetBrains Mono** (400, 500) |

```ts
// src/main.tsx — import only what is used, latin subset
import "@fontsource/barlow-condensed/latin-200.css";
import "@fontsource/barlow-condensed/latin-400.css";
import "@fontsource/barlow-condensed/latin-500.css";
import "@fontsource-variable/inter/index.css";
import "@fontsource/jetbrains-mono/latin-400.css";
```
Preload Barlow 200/400 and Inter in `index.html` (`<link rel="preload" as="font" type="font/woff2" crossorigin>`), `font-display: swap`. Check the resulting hashed filenames after `vite build`.

| Role | Family | Size | Weight | Tracking | Line-height | Case |
|------|--------|------|--------|----------|-------------|------|
| `hero` | display | `clamp(60px, 7vw, 80px)` (H) | 200 (H) | -0.02em (H) | 1 | upper |
| `heading` | display | `clamp(48px, 8vw, 80px)` (H max 80) | 400 | -0.02em | 1 | none |
| `subheading` | display | `clamp(32px, 3.6vw, 48px)` (H) | 500 | 0 | 1.1 | none |
| `title` | display | 36px (H) | 500 | 0 | 1 | upper |
| `subtitle` | display | 20px (H) | 500 | 0 | 1.4 | none |
| `body` | body | 16px (H) | 400 | 0 | 1.6 (H) | none |
| `small` | body | 13px (H) | 400 | 0 | 1.5 | none |
| `label` (nav, buttons) | display | 14px (H) | 500 | 0 | 1 | upper |
| `label-sm` | display | 12px (H) | 500 | 0 | 1 | upper |
| `meta` (tags, terminal) | meta | 12px (H) | 400 | 0 | 1.5 | upper |
| `faq-q` | display | 32px desktop (H), 20px < md | 400 | 0 | 1.4 | none |

**Floor:** Hermes uses 9–10px for `legend`/`info`. Our minimum is **12px**. Do not create a role below 12px.

**Cap-trim:** Hermes trims leading with `text-box: trim-both cap alphabetic`. Use it behind `@supports (text-box-trim: trim-both)`; no fallback hack needed — extra leading is harmless.

### 4.4 Layout, grid, spacing

- Page container: `max-width: calc(var(--col) + 2 * var(--pad-x))`, `margin-inline: auto`, `padding-inline: var(--pad-x)` (H).
- At ≥ 1601px the page is `min(1440px, 100% - 80px)` centered on `--c-stage` (H). Below that, full width.
- Viewport frame: fixed `inset: 0`, `border: var(--frame) solid var(--c-stroke)`, `pointer-events: none`, `z-index: 100`, **hidden below md** (H).
- Section vertical padding (H): hero compact `clamp(28px, 6vh, 60px)`; standard section `80px`; light panel (FAQ) `60px`; mobile `48px`.
- Gaps (H): grid gap `30px`; capability grid `80px 40px` (row/col).
- Spacing scale: Tailwind's default 4px scale. Do not add a custom scale.

### 4.5 Components — behavior matrix

**Buttons** (`<Button variant size>`). Common: `rounded-none`, `min-height: 36px`, `padding: 10px 12px`, `gap: 8px`, `label` type (14px/500/uppercase), `border: 0`, `transition: background-color, box-shadow, color, transform 150ms var(--ease-out)`; **on `:hover` and `:active` set `transition-duration: 0s`** (instant in, eased out) (H).

| Variant | Use on | Rest | Hover | Active | Focus-visible | Disabled |
|---------|--------|------|-------|--------|---------------|----------|
| `primary` | paper | bg `--c-blue`, text `--c-white` | `--shadow-lift-strong` + arc border | `scale(.98)` + `--shadow-press-strong` | arc border + `ring 1px` | bg `rgb(0 0 0/.02)`, text blue @ 40%, no shadow |
| `secondary` | blue | bg `--c-white` @ 90%, text `--c-blue` | bg `--c-white` 100% + `--shadow-lift` + arc border | bg `--c-white` + `--shadow-press`, `scale(.98)` | arc border | same as primary |
| `ghost` | any | transparent, text `--fg`, underlined | `--shadow-hair` | `--shadow-hair` + `--shadow-press`, `scale(.98)` | arc border | opacity .4, no shadow |
| `nav-chip` | header (blue) | bg `--c-white-20`, `label` 14px, underlined (offset 5px), `height 36px`, `padding-inline 10px` | arc border | `scale(.98)` | arc border | — |

Rule: **blue surface → `secondary`; paper surface → `primary`.**

**Arc border** (the animated hover outline, H technique):

```css
.btn { position: relative; }
.btn__arc {
  position: absolute; inset: 0; padding: 1.25px; overflow: hidden;
  opacity: 0; pointer-events: none; border-radius: inherit;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
}
.btn__arc::before {
  content: ""; position: absolute; top: 0; left: 0; width: 300%; height: 300%;
  transform: translate(-10%, -10%);
  background: linear-gradient(160deg,
    transparent 0 15%, currentColor 20%, color-mix(in srgb, currentColor 45%, transparent) 25%,
    transparent 35% 55%, currentColor 60%, color-mix(in srgb, currentColor 45%, transparent) 65%,
    transparent 75% 95%, currentColor 100%);
}
.btn:focus-visible > .btn__arc { opacity: 1; }
@media (hover: hover) { .btn:not(:disabled):hover > .btn__arc { opacity: 1; } }
@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .btn:not(:disabled):hover > .btn__arc::before { animation: btn-arc 2.23s linear infinite; }
}
@keyframes btn-arc { to { transform: translate(-50%, -50%); } }
```

**Other interactive elements**

| Element | Rest | Hover | Active / pressed | Notes |
|---------|------|-------|------------------|-------|
| Text link (`.link`) | `text-decoration: underline` in `currentColor` @ 25%, `text-underline-offset: 5px`, `thickness: from-font` | underline → 100% `currentColor`, **0 ms** | — | `transition: text-decoration-color 150ms` (H) |
| Nav link (header) | `label` 14px, opacity .85 | opacity 1 (instant) | — | pinned bar: 12px, opacity .8 → 1. Hermes uses .8 / .6; both are too faint for AA with this palette (§4.9) |
| Footer link chip | transparent, height 18px, `padding-inline 4px`, `margin-left -4px` | bg `--fg`, text `--bg` (inverted), right corners `2px` | — | `transition: colors 150ms`, hover 0 ms (H) |
| Accordion row | transparent | transparent | bg `--bg-pressed` while a button inside is `:active` | open row stays transparent (H) |
| Project row | transparent | bg `--bg-2`, instant (ours, mirrors accordion) | bg `--bg-pressed` | swaps MorphCard image |
| Form field | 1px `--line`, transparent bg, radius 0 | — | — | focus: `outline: 1px solid currentColor; outline-offset: 2px` |

**Header nav (desktop ≥ md)** — 3-column grid `1fr auto 1fr`, `column-gap: 24px`, `padding-top: 40px`, `padding-bottom: 20px` (H).
- Left: Capabilities · About · Projects (`label`, opacity .8).
- Center: two-line brand `AKMAL` / `PORTFOLIO`, display 36px / lh .9 / uppercase, centered (H structure). Under it, social icons 18px, hidden on mobile; render only those with a URL in `site.socials`.
- Right: FAQ · Contact · `nav-chip` "Download CV".

**Pinned bar** — appears after the header sentinel leaves the viewport. `position: fixed`, top `calc(var(--frame) - 1px)`, bg `--c-white`, text `--c-blue`, `box-shadow: 0 1px 0 color-mix(in srgb, var(--c-blue) 15%, transparent)`, `padding-block: 10px`. Hidden state: `transform: translateY(-100%); visibility: hidden; inert`. Transition `translate, visibility 300ms ease-out` (H). Center is a text monogram `AK` (24px). **Do not** use any Hermes wing/logo asset. Hidden bar **must** be `inert`, otherwise keyboard focus lands on invisible links.

**Mobile nav (< md) — no hamburger** (overrides Hermes, which uses one):
- Row 1: brand (links to `#home`) left, `secondary`/`primary` button "Contact" right.
- Row 2: horizontally scrollable anchor strip (Capabilities, About, Projects, FAQ, Contact), `scroll-snap-type: x proximity`, each item min tap height 44px, active item underlined, edge fade via `mask-image: linear-gradient(to right, transparent, #000 16px, #000 calc(100% - 16px), transparent)`.
- Whole bar sticky, bg `--bg`, `padding-top: env(safe-area-inset-top)`.

**FAQ accordion** — use `@radix-ui/react-accordion` (keyboard + ARIA solved; do not hand-roll). List: `border-bottom: 1px dotted var(--line)`; each item `border-top: 1px dotted var(--line)`, `padding-block: 20px`; trigger `min-height: 38px`, question underlined with offset 5px, plus/minus icon `14px` (H). Answer `max-width: 880px`, `body` 16px / lh 1.5, `padding-top: 8px` (12px ≥ md) (H).

**Labels/chips** — `meta` type, uppercase, `height: 18px`, `padding-inline: 6px`, bg `--fg`, text `--bg` (H "section label" pattern). Used for stack tags.

**Footer** — ghost wordmark `AKMAL`, `font-size: clamp(4rem, 22vw, 18rem)`, display 400, uppercase, centered, opacity `.15` on blue (`.02` on paper). Do **not** replicate Hermes' `fit-text` trig hack. Link groups use the footer link chip; bottom row: copyright left, "Built with React + Laravel" right (`label-sm`).

### 4.6 Effects

| Effect | Spec |
|--------|------|
| Noise | Inline SVG `feTurbulence` data-URI (baseFrequency `.72`, 4 octaves, `stitchTiles`), tile `12.8rem`, overlay `::after` on the MorphCard and hero art areas, `mix-blend-mode: plus-lighter`, opacity `.9`. (H technique) |
| Dither | `repeating-conic-gradient(currentColor 0% 25%, transparent 0% 50%) 0 0 / 2px 2px` — decorative strips only. (H) |
| Film-grain canvas | Hermes runs a full-screen three.js canvas at opacity `.02`. **Skip it.** It costs a WebGL context + three.js for an effect nobody can see. |
| Scrollbar | `scrollbar-width: thin`; thumb transparent until the container is hovered, then `--fg` @ 20%; document scrollbar thumb `--fg` @ 65% (80% on hover); webkit width/height `.25rem`. (H) |
| Parallax / footer reveal | **P2.** Not required for v1. If added: only `transform`/`opacity`, disabled for reduced-motion. |

### 4.7 Motion

| Motion | Duration / easing | Notes |
|--------|-------------------|-------|
| Button state change | 150 ms ease-out; hover-in 0 ms | (H) |
| Arc border loop | 2.23 s linear infinite | hover only, `(hover: hover)` and no reduced-motion (H) |
| Pinned bar | 300 ms ease-out | (H) |
| Section fade/slide-in | 500–600 ms ease-out, `translateY(6px)` | (H) `animate-fade-in` / `slide-up` |
| MorphCard | scroll-linked (no time-based easing) | §5.1 |

`@media (prefers-reduced-motion: reduce)`: no arc animation, no slide-in, MorphCard static, `scroll-behavior: auto`.

### 4.8 Breakpoints (H)

`< 440px` micro · `< 768px` mobile · `768–1100px` tablet (hero single column) · `≥ 1100px` desktop · `≥ 1601px` stage margins. Tailwind: `md` = 48rem (H).

### 4.9 Accessibility rules (non-negotiable)

- Contrast (computed; re-verify with a contrast checker). On blue 600 `#0034f2`: white `#f2f2f2` ≈ 6.8:1 ✅; at 85% ≈ 5.2:1 ✅; at 80% ≈ 4.8:1 (borderline); at 60% (`--fg-2`) ≈ 3.2:1 ❌ for small text. **Rule: text < 18px on blue uses opacity ≥ .85; `--fg-2` only for text ≥ 18px.**
- On paper `#f2f2f2`: 600 ≈ 6.8:1 ✅; `--c-ink` (800) ≈ 11.7:1 ✅; `--c-muted` ≈ 5.1:1 ✅; 600 at 60% opacity ≈ 3.2:1 ❌ → never use it for text (pinned-bar links use opacity ≥ .8, ≈ 4.8:1).
- Yellow `#f2f200` is **never** text on paper (≈ 1.1:1). It exists for `::selection` on blue only (with 600 text ≈ 6.3:1).
- Every interactive element has a visible `:focus-visible` state (arc border for buttons, `outline: 1px solid currentColor; outline-offset: 2px` elsewhere).
- Inputs use **16px** font size. (Hermes' 12px inputs trigger iOS Safari zoom-on-focus; do not copy that.)
- Hit target ≥ 44px on touch for nav strip items; ≥ 24px everywhere (WCAG 2.2 2.5.8).
- Decorative images: `alt=""` + `aria-hidden`. MorphCard is decorative (`aria-hidden`, `pointer-events: none`); all its information also exists in the section text.

### 4.10 Do not copy
Hermes/Nous logo, wing mark, "Nous girl" art, hero/platform/footer artwork, copy text, trial/proprietary fonts. Tokens and *behaviors* only.

---

## 5. Section specs

### 5.1 MorphCard (persistent, md and up)

**Behavior (from the structure Akmal specified):** centered on Home → moves right on Capabilities → rotates 360° horizontally on About → on Projects becomes a vertical card rotated 90° into a rectangular image card.

**Rendering:** one element, `position: fixed; inset: 0; margin: auto`, `pointer-events: none`, `z-index: 40` (below nav 110, frame 100). Wrapper has `perspective: 1200px`; card has `transform-style: preserve-3d`. Base size is portrait 3:4, `width: clamp(220px, 26vw, 380px)`. Rotating it 90° on Projects makes it landscape without any resize. Only `transform` and `opacity` are animated.

**Keyframes** — values are *initial tuning values*, not extracted from any reference. Tune visually against the portavia reference.

| Anchor | `x` | `scale` | `rotateY` | `rotateZ` | Face content |
|--------|-----|---------|-----------|-----------|--------------|
| `home` top | `0vw` | 1 | 0 | 0 | full name |
| `capabilities` top | `0vw` | 1 | 0 | 0 | full name |
| `capabilities` center | `28vw` | .92 | 0 | 0 | full name |
| `about` top | `28vw` | .92 | 0 | 0 | full name |
| `about` bottom | `28vw` | .92 | 360 | 0 | full name |
| `projects` top | `28vw` | .92 | 360 | 0 | full name → cross-fades to project image |
| `projects` center | `20vw` | 1 | 360 | 90 | active project image |
| `faq` top | `20vw` | 1 | 360 | 90 | fades out (`opacity 0`) |

`about`'s x-position during the spin is an assumption (stays right). Confirm against the reference.

**Implementation pattern** (`motion` package; scroll-linked, no state updates per frame):

```tsx
// src/components/morph/MorphCard.tsx
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { MORPH_KEYS } from "./keys";
import { useAnchorPositions } from "./useAnchorPositions";

export function MorphCard() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const stops = useAnchorPositions(MORPH_KEYS); // px scroll offsets, strictly increasing
  const x       = useTransform(scrollY, stops, MORPH_KEYS.map(k => `${k.x}vw`));
  const scale   = useTransform(scrollY, stops, MORPH_KEYS.map(k => k.scale));
  const rotateY = useTransform(scrollY, stops, MORPH_KEYS.map(k => k.rotateY));
  const rotateZ = useTransform(scrollY, stops, MORPH_KEYS.map(k => k.rotateZ));
  const opacity = useTransform(scrollY, stops, MORPH_KEYS.map(k => k.opacity ?? 1));
  if (reduce || stops.length < 2) return null; // static fallback handled in sections

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-40 grid place-items-center [perspective:1200px]">
      <motion.div style={{ x, scale, rotateY, rotateZ, opacity }} className="card" />
    </div>
  );
}
```

```ts
// src/components/morph/keys.ts
export type MorphKey = {
  anchor: "home" | "capabilities" | "about" | "projects" | "faq";
  at: "top" | "center" | "bottom";   // where in the section the state is reached
  x: number; scale: number; rotateY: number; rotateZ: number; opacity?: number;
};
export const MORPH_KEYS: MorphKey[] = [ /* rows from the table above */ ];
```

`useAnchorPositions`: measure each section's `offsetTop`/height, convert `at` to a px scroll offset (`top − innerHeight/2`, etc.), re-measure with `ResizeObserver` on `document.body`, dedupe, and sort ascending. `useTransform` throws/misbehaves on non-monotonic input ranges — guard that.

**Below md and reduced-motion:** no fixed card. Home renders the card statically inline (name card); other sections render no card; Projects rows show their thumbnail inline. Do not try to scale the morph down to phones.

**Project image swap:** `ActiveProjectContext` is set by row `onPointerEnter/onFocus`; the card face cross-fades images (`opacity`, 150 ms). Images: AVIF/WebP, explicit `width`/`height`.

### 5.2 Home (`#home`, blue)
- `hero` type heading row: `FULLSTACK` left-aligned, `DEVELOPER` right-aligned (`display:flex; justify-content: space-between` on md+; stacked and left/right via `align-self` below md). Centered card between/behind per the original design intent — confirm z-order with Akmal; default: card above text.
- Card face: `[FULL NAME]` in `heading` type.
- Below: one-line positioning (`body`), `secondary` button "View projects" → `#projects`, `nav-chip`-style "Download CV".
- Compact vertical padding `clamp(28px, 6vh, 60px)`.

### 5.3 Capabilities (`#capabilities`, blue)
- 2-column layout on md+: left = heading + 2×2 grid (gap `80px 40px`), right = empty slot where the MorphCard lands. Single column below md.
- Each item: `subheading` title, `body` description. Draft copy uses **only stated stack**:
  1. **Backend & API** — Laravel, PHP, REST, Sanctum, Spatie Laravel-Permission, Form Requests.
  2. **Database** — MySQL, migrations, transactions, `lockForUpdate`, UNIQUE constraints.
  3. **Frontend** — React, Vite, Tailwind CSS.
  4. **Mobile & Deploy** — Flutter; cPanel/FTP deployment.
- Do not add skill bars, percentages, or logos.

### 5.4 About (`#about`, blue)
- Layout from `docs/reference/portavia-about.png` (title / text / element positions), no numbered indicators.
- Blocks: `[BIO]`; experience — PKL at PT Laskar Teknologi Mulia, Jan–Apr 2026; education — S1 Informatika, Itenas; TOEIC 830; stack summary.
- `secondary` button "Download CV" → `/cv/akmal-cv.pdf` (`download` attribute). File lives in `frontend/public/cv/`.
- MorphCard spins 360° across this section's scroll range.

### 5.5 Projects (`#projects`, paper)
- Simple list, one row per project, `border-top: 1px dotted var(--line)`, `padding-block: 20px`.
- Row layout (md+): name (`title` 36px) | blurb (`body`) | tags (chips) | links (`ghost` buttons "Repo", "Live"). Mobile: stacked.
- Content (`src/content/projects.ts`):

| Project | Blurb (draft — only stated facts) | Result/impact |
|---------|-----------------------------------|---------------|
| Klinik Online | Clinic appointment booking (React + Laravel + MySQL) that prevents double-booking under concurrent requests via DB transactions, `lockForUpdate`, and a UNIQUE constraint; RBAC with Spatie Laravel-Permission, auth with Sanctum. | `[ISI HASIL]` |
| Foody | Built during the PKL at PT Laskar Teknologi Mulia. | `[ISI DETAIL]` |
| Portfolio Website | React + Vite SPA with a Laravel API-only backend; contact form with Form Request validation and Mailable. | `[ISI HASIL]` |

- No row is rendered with its placeholder visible in production: the build must **fail** (or lint-warn) if any string in `src/content` still contains `[ISI`. Add a tiny `scripts/check-placeholders.mjs` to `npm run build`.

### 5.6 FAQ (`#faq`, paper)
- Radix accordion per §4.5. Draft questions (answers = placeholders until written): "Are you open to internships?", "Which stack do you work with?", "How do I reach you?", "Where are you based?".
- Only one item open at a time (`type="single" collapsible`).

### 5.7 Contact (`#contact`, blue)
- Fields: `name`, `email`, `message`, hidden honeypot `website` (`tabIndex={-1}`, `autoComplete="off"`, visually hidden with CSS, **not** `display:none` alone — some bots skip those; use off-screen positioning + `aria-hidden`).
- Labels: `label-sm` 12px uppercase; inputs 16px; 1px `--line` border; radius 0.
- Button: `secondary` "Send message". While submitting: `disabled`, `aria-busy="true"`, text "Sending…".
- Result region `aria-live="polite"`: success ("Message received.") / field errors under each field (from 422) / "Too many attempts, try again in a minute." (429) / generic failure.
- Client validation mirrors server rules but the server is the authority.

### 5.8 Footer — see §4.5.

---

## 6. Backend deep dive (Laravel API-only)

### 6.1 Contract

`POST /api/contact` — `Content-Type: application/json`, `Accept: application/json`

| Status | Body | When |
|--------|------|------|
| 201 | `{ "message": "Message received." }` | stored (mail may or may not have been sent) **or** honeypot tripped (fake success) |
| 422 | Laravel default `{ "message", "errors": { field: [..] } }` | validation failure |
| 429 | Laravel default throttle response (+ `Retry-After`) | rate limit |
| 500 | `{ "message": "Server Error" }` | only unexpected failures (never leaks stack when `APP_DEBUG=false`) |

### 6.2 Code

```php
// routes/api.php   (php artisan install:api creates it in Laravel 11/12)
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:contact');
```

```php
// app/Providers/AppServiceProvider.php — method boot()
RateLimiter::for('contact', fn (Request $request) => [
    Limit::perMinute(3)->by($request->ip()),
    Limit::perDay(20)->by($request->ip()),
]);
```

```php
// app/Http/Requests/StoreContactRequest.php
public function authorize(): bool { return true; }

public function rules(): array
{
    return [
        'name'    => ['required', 'string', 'max:100'],
        'email'   => ['required', 'email:rfc', 'max:150'],
        'message' => ['required', 'string', 'min:10', 'max:2000'],
        'website' => ['nullable', 'string'], // honeypot, handled in controller
    ];
}
```

```php
// app/Http/Controllers/ContactController.php
public function store(StoreContactRequest $request): JsonResponse
{
    if ($request->filled('website')) {
        return response()->json(['message' => 'Message received.'], 201); // honeypot: pretend success, store nothing
    }

    $contact = ContactMessage::create([
        ...$request->safe()->only(['name', 'email', 'message']),
        'ip_address' => $request->ip(),
    ]);

    try {
        Mail::to(config('portfolio.contact_to'))->send(new ContactReceived($contact));
        $contact->update(['mailed_at' => now()]);
    } catch (Throwable $e) {
        report($e); // row is already stored; mailed_at stays null so failures are queryable
    }

    return response()->json(['message' => 'Message received.'], 201);
}
```

```php
// config/portfolio.php   ← read env() ONLY in config files; env() returns null after `config:cache`
return ['contact_to' => env('CONTACT_TO')];
```

```php
// database/migrations/xxxx_create_contact_messages_table.php
Schema::create('contact_messages', function (Blueprint $table) {
    $table->id();
    $table->string('name', 100);
    $table->string('email', 150);
    $table->text('message');
    $table->string('ip_address', 45)->nullable(); // 45 = max IPv6 text length
    $table->timestamp('mailed_at')->nullable();
    $table->timestamps();
});
```
No extra indexes: the table stays tiny, reads are manual.

```php
// app/Mail/ContactReceived.php — envelope()
new Envelope(
    subject: 'Portfolio contact: '.Str::limit(preg_replace('/\s+/', ' ', $this->contact->name), 60),
    replyTo: [new Address($this->contact->email, $this->contact->name)],
);
// View: plain-text or Blade with {{ }} (escaped). Never {!! !!} with user input.
```

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_methods' => ['POST'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
'supports_credentials' => false,
```

### 6.3 Environment

| Variable | Dev | Prod |
|----------|-----|------|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | **`false`** |
| `APP_KEY` | generated | generated once on server; never committed |
| `FRONTEND_URL` | `http://localhost:5173` | `https://yourdomain.com` |
| `CONTACT_TO` | your inbox | your inbox |
| `MAIL_MAILER` | `log` | `smtp` (a mailbox on your own domain) |
| `VITE_API_URL` (frontend) | `http://localhost:8000/api` | `https://api.yourdomain.com/api` |

`VITE_*` values are embedded in the public bundle — never put a secret in them.

### 6.4 Tests (minimum — 5 feature tests)
1. Valid payload → 201 + row exists.
2. Invalid email / short message → 422 with `errors.email` / `errors.message`.
3. Honeypot filled → 201 + **no** row.
4. 4th request within a minute from the same IP → 429.
5. Mail transport throws → still 201, row exists, `mailed_at` is null.

### 6.5 Security notes
- **CSRF is not the control for this endpoint.** CSRF abuses *ambient credentials* (session cookies). This endpoint is public, stateless, cookie-less (`api` middleware group has no CSRF/session). A forged cross-site POST achieves nothing a direct POST doesn't. The real controls are: rate limiting, honeypot, CORS allowlist, validation, output escaping. If the PRD lists "CSRF" as a requirement for the contact form, reword it to "abuse protection (rate limit + honeypot)". CSRF/Sanctum SPA cookies only become relevant if authenticated endpoints are added later.
- CORS is a browser control, not auth. It does not stop server-side bots — hence the throttle.
- Escape on output; strip control characters from `name` before it touches the subject (done above).
- Add Cloudflare Turnstile **only if** spam appears despite throttle + honeypot (P2).

---

## 7. Frontend architecture

```
frontend/
├─ index.html                  # static meta, OG/Twitter, font preloads
├─ public/                     # cv/akmal-cv.pdf, og.png, favicon.svg
└─ src/
   ├─ main.tsx  App.tsx
   ├─ styles/                  # tokens.css, base.css, effects.css, index.css
   ├─ content/                 # site.ts, capabilities.ts, about.ts, projects.ts, faq.ts
   ├─ components/
   │  ├─ ui/                   # Button, Chip, TextLink, Accordion, Field
   │  ├─ layout/               # Header, PinnedBar, MobileNav, Frame, Surface, Footer
   │  ├─ morph/                # MorphCard, keys.ts, useAnchorPositions.ts
   │  └─ sections/             # Home, Capabilities, About, Projects, Faq, Contact
   ├─ hooks/                   # useScrollSpy, usePinnedBar, useMediaQuery
   ├─ lib/                     # api.ts, contact.ts
   └─ context/                 # ActiveProjectContext.tsx
```

```ts
// src/lib/api.ts
import axios, { AxiosError } from "axios";

export type ApiError =
  | { kind: "validation"; errors: Record<string, string[]> }
  | { kind: "rate_limited"; retryAfter?: number }
  | { kind: "network" }
  | { kind: "server" };

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10_000,
  headers: { Accept: "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ errors?: Record<string, string[]> }>) => {
    if (!err.response) return Promise.reject<ApiError>({ kind: "network" });
    const { status, data, headers } = err.response;
    if (status === 422) return Promise.reject<ApiError>({ kind: "validation", errors: data.errors ?? {} });
    if (status === 429) return Promise.reject<ApiError>({ kind: "rate_limited", retryAfter: Number(headers["retry-after"]) || undefined });
    return Promise.reject<ApiError>({ kind: "server" });
  },
);
```
No auth interceptor — there is no auth.

**Scrollspy:** `IntersectionObserver` with `rootMargin: "-45% 0px -50% 0px"` on the six `section[id]`; update `aria-current="location"` on the active nav link; update URL hash with `history.replaceState` (not `pushState`, so Back doesn't walk through every section).

**Anchor scrolling:** `html { scroll-behavior: smooth; }` inside `@media (prefers-reduced-motion: no-preference)`; every section gets `scroll-margin-top` = pinned bar height + frame.

**Tooling:** ESLint + Prettier (frontend), Laravel Pint (backend). `npm run build` must run the placeholder check and `tsc --noEmit`.

---

## 8. Deployment (cPanel)

**Frontend**
1. `npm run build` locally → upload **contents** of `dist/` into `public_html/` (not the `dist` folder itself).
2. `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "DENY"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  <FilesMatch "\.(js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"   # Vite filenames are content-hashed
  </FilesMatch>
  <Files "index.html">
    Header set Cache-Control "no-cache"
  </Files>
</IfModule>
```
3. CSP is **P2**: `motion` writes inline styles, so a strict `style-src` needs a deliberate `'unsafe-inline'` decision.

**Backend**
1. Create subdomain `api.` in cPanel with **document root = `<app>/public`** (the app code, `.env`, `vendor` stay outside `public_html`).
2. Upload code; `composer install --no-dev --optimize-autoloader` (cPanel Terminal if available, otherwise build `vendor` locally and upload a zip, then extract in File Manager).
3. Create `.env` on the server (never upload your dev `.env`); `php artisan key:generate`; `php artisan migrate --force`.
4. `chmod 775 storage bootstrap/cache` (recursive on `storage`).
5. `php artisan config:cache && php artisan route:cache` **after** the `.env` is final (config cache bakes env in).
6. Mail: create a mailbox on the domain, set SMTP vars, enable SPF/DKIM via cPanel *Email Deliverability* — otherwise the notification lands in spam.

**Same-origin variant (if the host can't do subdomains):** serve Laravel's `public/` contents under `public_html/api/`, adjust `index.php` paths, route `/api/*` away from the SPA fallback; then drop CORS. More fragile — use only if forced.

---

## 9. Reliability & monitoring (right-sized)

- Uptime: UptimeRobot (free) on `https://yourdomain.com/` and `https://api.yourdomain.com/up`.
- Errors: Laravel `storage/logs/laravel.log` (daily channel, keep 14 days); check after each deploy.
- Data: export `contact_messages` monthly (cPanel phpMyAdmin or `mysqldump`); losing it is low-impact, so no automation in v1.
- Failure mode that matters: SMTP down → message still stored (`mailed_at IS NULL` finds it). That is the reason for D3 below.

---

## 10. Decisions & trade-offs

| ID | Decision | Alternative | Cost accepted | Revisit when |
|----|----------|-------------|---------------|--------------|
| D1 | React SPA | Static site generator / SSR | Weak crawler/OG handling | SEO matters → `vite-ssg` or Astro |
| D2 | Content in TS files | DB/CMS | Content edits need a rebuild + upload | updates > weekly, or non-dev editors |
| D3 | Contact: DB first, then mail | Mail only | One table + migration | never (cheap insurance) |
| D4 | `api.` subdomain | Same-origin | CORS config | host can't do subdomains |
| D5 | `motion` `useScroll` for MorphCard | GSAP ScrollTrigger / CSS scroll-driven animations | +bundle weight (check analyzer) | bundle > 150 KB gzip |
| D6 | MorphCard md+ only | Scale down for phones | Mobile is plainer | never |
| D7 | Barlow Condensed / Inter / JetBrains Mono | Hermes fonts | Not pixel-identical | licensed fonts bought |
| D8 | Axios (already named in the PRD blurb) | native `fetch` wrapper | ~13 KB gzip for one POST | LCP budget is tight → swap to fetch |
| D9 | Scrollable anchor strip on mobile | Hamburger (Hermes) | Strip needs scroll affordance | > 6 sections |
| D10 | Radix Accordion | Native `<details>` | small dependency | — |
| D11 | Skip three.js film grain | Replicate | Slightly less texture | never |
| D12 | Rate limit + honeypot | Turnstile/reCAPTCHA | Some bots may pass | spam observed |
| D13 | Owner-supplied blue scale, brand = step 600, neutral paper | Hermes' exact `#0000f2` + derived tints | Hue ≈ 13° more azure than Hermes | side-by-side check looks off → set `--primary-600` to `#0000f2` and re-derive 500/700/800 |

---

## 11. Open items

1. `[FULL NAME]`, `[BIO]`, `[ISI DETAIL]` (Foody), `[ISI HASIL]` ×2, social URLs.
2. About layout screenshot → `docs/reference/portavia-about.png`.
3. MorphCard: card z-order vs. "FULLSTACK/DEVELOPER" text on Home; x-position during the About spin; tune keyframes visually.
4. Confirm cPanel plan has Terminal access and PHP 8.2+.
5. Confirm A1–A5.
6. Hermes `--hpv2-shadow-*` values were not available → `--shadow-*` are ours; adjust by eye.
7. Palette: verify 600 (`#0034f2`) against Hermes on a real screen; contrast numbers in §4.9 are computed, not measured with a tool.

---

## 12. Definition of done

- [ ] Six sections in order, anchors work, scrollspy correct, no hamburger at any width.
- [ ] Every interactive element matches the §4.5 matrix (hover instant-in, active `scale(.98)`, focus-visible visible).
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95.
- [ ] No text < 12px; no small text below 4.5:1 contrast; inputs 16px.
- [ ] No raw hex outside `tokens.css`; palette roles match §4.2.1.
- [ ] Reduced-motion verified (OS setting on): no arc animation, no MorphCard, no smooth scroll.
- [ ] 5 backend tests green; `APP_DEBUG=false` verified in prod; `config:cache` run after final `.env`.
- [ ] Real contact submission received by email **and** present in `contact_messages`.
- [ ] No `[ISI` / `[FULL NAME]` / `[BIO]` strings in the production bundle.
- [ ] No Hermes/Nous assets or fonts in the repo.