# PRD — Portfolio Website (v2.0)

| | |
|---|---|
| **Owner** | Akmal |
| **Date** | 2026-10-07 |
| **Status** | Draft — **blocked on content**: Foody details and project results (see §14) |
| **Replaces** | Previous PRD (retro-editorial direction) — discard it entirely |
| **Companions** | `design.md` (design system, architecture, API contract), `tech_stack_portfolio.md` (packages, TS/React rules). This PRD defines **what and why**; those two define **how**. On technical conflict, they win; on scope conflict, this file wins. |

---

## 1. Overview

### 1.1 Problem
A fullstack developer who is early in his career needs one place where a recruiter or tech lead can verify, in a few minutes, what he can build, how well he builds it, and how to contact him. A GitHub profile alone shows code but not context, results, or communication quality.

### 1.2 Product
A single-page personal portfolio: project showcase plus a complete CV, built with React + TypeScript and a Laravel API, deployed on cPanel. The site itself is a portfolio piece — its code quality, performance, accessibility, and security are part of the evidence.

### 1.3 Goals
| ID | Goal |
|----|------|
| G1 | A reviewer understands who Akmal is, what stack he works with, and sees three real projects with outcomes within 3 minutes. |
| G2 | A reviewer can download the CV and contact Akmal without friction. |
| G3 | Signal openness to internships (and, later, junior roles) clearly, without begging for it. |
| G4 | The site demonstrates production-grade standards: fast, accessible, secure, deployed properly — not a demo. |
| G5 | Content is easy to keep current (see §6, FR-9). |

### 1.4 Non-goals (v1)
CMS or admin panel, blog, authentication of any kind, multi-language, dark/light toggle, analytics/tracking, per-project case-study pages, chat widget, animations that carry information (all motion is decorative).

---

## 2. Audience

| Persona | Who | Wants | Time budget |
|---------|-----|-------|-------------|
| **Screener** | Recruiter / HR at a startup or tech company, internship program coordinator | Is this person credible? Stack match? Contact + CV | 30–90 s |
| **Evaluator** | Engineer / tech lead | Evidence of real engineering: concurrency handling, RBAC, API design; code links | 3–5 min |
| **Peer / collaborator** | Student, small-team lead | What he builds, how to reach him | 1–2 min |

Primary persona: **Screener**, then **Evaluator**. Career target is a startup/tech company with no specific company type; priority is good exposure. Therefore: no company-specific tailoring, no jargon walls, outcomes first.

Top tasks (in order): (1) read the headline + stack, (2) scan projects, (3) download CV, (4) contact.

---

## 3. Success metrics

v1 deliberately has no analytics (non-goal). Metrics are therefore verifiable by Akmal directly. Targets are **proposals** — confirm or change.

| Metric | Target | How measured |
|--------|--------|--------------|
| Lighthouse mobile (Performance / Accessibility / Best Practices) | ≥ 90 / ≥ 95 / ≥ 95 | Lighthouse before each release |
| LCP / CLS | ≤ 2.5 s / ≤ 0.1 | Lighthouse + PageSpeed Insights on the live URL |
| Contact flow works end-to-end | 100% of test submissions reach inbox **and** DB | Manual test per release |
| Outcome (lagging) | At least one interview/conversation originating from the site within 3 months of launch | Self-reported; contact messages table + inbox |
| Freshness | Content reviewed at least monthly and after every completed project | Calendar reminder |

---

## 4. Scope

### 4.1 In scope (v1)
Six sections on one page — **Home → Capabilities → About → Projects → FAQ → Contact** — plus footer; persistent navigation without hamburger; pinned bar; scroll-linked MorphCard (desktop); CV download; contact form with stored + emailed messages; Hermes-derived design system (`design.md` §4).

### 4.2 Out of scope (v1) → candidates later
| Item | Trigger to reconsider |
|------|----------------------|
| SSG/SSR for better crawler/OG handling | SEO becomes a goal |
| Cloudflare Turnstile | Spam passes throttle + honeypot |
| Parallax / footer-reveal effects (P2 in `design.md`) | v1 shipped and stable |
| CSP header | After deciding the inline-style trade-off |
| Analytics (privacy-friendly) | Need data beyond self-reporting |
| CI/CD (GitHub Actions → deploy) | Personal learning goal; separate task after v1 |

---

## 5. Content requirements

All copy lives in `frontend/src/content/*.ts`. The build **fails** if any placeholder remains (`[ISI`, `[FULL NAME]`, `[BIO]`).

### 5.1 Global
- Language: English (assumption A1). Terminology: "PKL" in Indonesian text, "Internship" in English text.
- Tone: concrete, first person, no superlatives ("passionate", "rockstar"), no skill percentages/bars.
- Identity facts already confirmed: S1 Informatika, Itenas; PKL at PT Laskar Teknologi Mulia, Jan–Apr 2026; TOEIC 830; based in Bandung, Indonesia.

### 5.2 Per section
| Section | Required content | Owner input needed |
|---------|------------------|--------------------|
| Home | `[FULL NAME]`; "Fullstack" / "Developer"; one-line positioning; CTAs: View projects, Download CV | Full name, positioning line |
| Capabilities | 4 groups: Backend & API, Database, Frontend, Mobile & Deploy — stated stack only | Review draft |
| About | `[BIO]`; PKL experience; education; TOEIC 830; CV download | Bio, PKL achievements |
| Projects | 3 rows (table below) | Foody details, results |
| FAQ | 4 Q&As: internships, stack, contact, location | All four answers |
| Contact | Short intro line, form, success/failure copy | Intro line |
| Footer | Wordmark, links, copyright | Social URLs |

### 5.3 Projects (quality over quantity — exactly three)

Each row: name · 1–2 sentence blurb **including result/impact** · stack tags · links (repo/live). Simple list, no case-study pages.

| Project | Confirmed facts | Missing |
|---------|-----------------|---------|
| **Klinik Online** | Clinic appointment booking, React + Laravel 12 + MySQL; race-condition prevention with `DB::transaction()` + `lockForUpdate()` + `UNIQUE` constraint; HTTP 409 on slot conflict; RBAC via Spatie Laravel-Permission; Sanctum SPA auth; separate dashboards for Patient, Doctor, Admin | `[ISI HASIL]`, repo/live links |
| **Foody** | Completed during PKL at PT Laskar Teknologi Mulia | `[ISI DETAIL]` — what it is, Akmal's role, stack, outcome, whether it may be shown publicly (company permission) |
| **Portfolio Website** | React + Vite SPA, TypeScript, Laravel API-only, Axios interceptor, contact form with Form Request + Mailable | `[ISI HASIL]` (e.g., Lighthouse scores after launch), repo link |

**Dependency:** Foody is client/company work. Confirm with PT Laskar Teknologi Mulia (or your supervisor) what may be disclosed *before* publishing. If nothing can be shown, the row is reduced to role + stack + generic outcome, or replaced — do not publish confidential details.

### 5.4 CV
PDF, one or two pages, English, file `akmal-cv.pdf`, linked from Home (CTA), About, and the header chip. The CV is the same content as About/Projects — no information that exists only in the PDF.

---

## 6. Functional requirements

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| FR-1 | One page, six sections in fixed order, then footer | Given the page loads, then sections appear as Home → Capabilities → About → Projects → FAQ → Contact → footer; each has an `id` matching its anchor. |
| FR-2 | Persistent navigation, no hamburger at any breakpoint, scrollspy | Clicking a nav item scrolls to its section; the active item has `aria-current="location"` while that section is in view; at 360 px width all five links are reachable without a hamburger. |
| FR-3 | Pinned bar after the header leaves the viewport | Scroll past the header → bar slides in; scroll back → bar hides and is `inert` (Tab never lands on hidden links). |
| FR-4 | MorphCard (≥ 768 px, motion allowed) | Centered on Home; right on Capabilities; one full 360° horizontal rotation across About; on Projects it ends as a rotated image card showing the hovered/focused project. Below 768 px or with reduced-motion: no fixed card, content fully usable. |
| FR-5 | Projects list | Exactly 3 rows; each shows name, blurb with result, tags, links; hovering/focusing a row swaps the MorphCard image (desktop). |
| FR-6 | About | Shows bio, PKL, education, TOEIC 830, "Download CV". |
| FR-7 | FAQ accordion | One item open at a time; operable by keyboard (Enter/Space/arrows); correct ARIA. |
| FR-8 | Contact form | Valid submit → success message, form cleared, row in `contact_messages`, email received. Invalid → per-field errors from server (422). 4th submit/min from one IP → 429 message. Honeypot filled → UI shows success, nothing stored. SMTP failure → UI still shows success, row stored with `mailed_at = NULL`. |
| FR-9 | Content maintenance | Updating a project = edit `src/content/projects.ts` → `npm run build` → upload `dist/`. No other file changes required. Procedure documented in the repo README. |
| FR-10 | Share metadata | `index.html` contains title, description, canonical, OG and Twitter tags with a 1200×630 `og.png`; pasting the URL in a messenger shows a correct preview. |
| FR-11 | CV download | Clicking any "Download CV" link downloads `akmal-cv.pdf`; file < 1 MB. |

---

## 7. Non-functional requirements

| Area | Requirement |
|------|-------------|
| Performance | LCP ≤ 2.5 s (4G, mid-range mobile), CLS ≤ 0.1, initial JS ≤ 150 KB gzip; LCP element is text; fonts self-hosted, latin subset, preloaded. |
| Accessibility | WCAG 2.2 AA; no text < 12 px; small text ≥ 4.5:1 contrast; inputs 16 px; visible focus on every control; reduced-motion honored; MorphCard `aria-hidden`. |
| Compatibility | Last 2 versions of Chrome, Edge, Firefox, Safari (iOS + macOS), Chrome Android. Layout verified at 360, 768, 1100, 1440, 1920 px. |
| Reliability | Contact messages are never lost: persisted before email is attempted. |
| Maintainability | TypeScript `strict`, ESLint + Prettier clean, no `any`; content separated from components; package list frozen per `tech_stack_portfolio.md` §2. |
| Observability | Uptime monitor on `/` and `/up`; Laravel daily log kept 14 days. |
| Privacy | The only personal data collected is what a visitor types in the form (name, email, message) plus IP address. Used solely to answer and to rate-limit/abuse-trace. No third-party trackers, no cookies set by the site. A one-line notice sits under the form. |

---

## 8. Security requirements

These were self-identified gaps (env config, rate limiting, CSRF). Resolution:

| ID | Requirement | Note |
|----|-------------|------|
| SEC-1 | Strict dev/prod environment separation: `APP_ENV=production`, `APP_DEBUG=false`, no dev `.env` on the server, `env()` only inside `config/*.php`, `config:cache` after final `.env`. | A stack trace on a public portfolio is a defect, not a convenience. |
| SEC-2 | Rate limiting on `POST /api/contact`: 3/min and 20/day per IP. | Laravel named limiter. |
| SEC-3 | **Abuse protection** on the contact form: rate limit + honeypot + server validation + CORS allowlist (single origin). | **Reworded from "CSRF".** The endpoint is public, stateless, and cookie-less, so CSRF (which exploits ambient credentials) does not apply. CSRF/Sanctum cookies become requirements only if an authenticated endpoint is ever added. |
| SEC-4 | Server-side validation via Form Request: name ≤ 100, email RFC ≤ 150, message 10–2000. | Client validation is UX only. |
| SEC-5 | Output escaping: no `{!! !!}` with user input; control characters stripped from `name` before the mail subject. | Prevents header/markup injection. |
| SEC-6 | Security headers via `.htaccess`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`; HTTPS forced. | CSP deferred (§4.2). |
| SEC-7 | Secrets never in the repo or in `VITE_*` variables; `.env.example` only. | `VITE_*` is public by design. |
| SEC-8 | Email deliverability: SPF + DKIM enabled for the sending domain; SMTP via a domain mailbox. | Otherwise notifications land in spam. |

---

## 9. Technical overview

Summary only — details in the companions.
- **Frontend:** Vite + React + TypeScript (strict) + Tailwind v4; 7 runtime packages (`tech_stack_portfolio.md` §2). Single page, no router.
- **Backend:** Laravel 12 API-only, one endpoint `POST /api/contact`, one table `contact_messages`; no Sanctum/Spatie in this project.
- **Design system:** derived from the Hermes Agent Desktop page; tokens and behaviors only — no Hermes/Nous assets or fonts (`design.md` §4).
- **Structure:** unchanged from the intended flow; retro-editorial styling removed.

---

## 10. Deployment strategy

- Manual deploy to cPanel (current habit; automation is a later learning goal, §4.2).
- Frontend: `npm run build` → upload `dist/` contents to `public_html/` with the `.htaccess` from `design.md` §8.
- Backend: subdomain `api.` with document root `api/public`; code and `.env` outside `public_html`.
- Release checklist (run **every** deploy): build passes → Lighthouse on staging/live → contact test (email + DB) → `APP_DEBUG=false` verified → uptime monitor green.
- Rollback: keep the previous `dist/` as a zip on the server; restoring = extract it back. Database rollback is not needed (additive schema).
- Version control: one Git repository (monorepo), commit per completed task, tag `v1.0.0` at launch. This also trains the consistent Git habit.

---

## 11. Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R1 | Foody details unavailable or confidential | High | High (1 of 3 projects) | Ask for permission now; fallback row with role + stack only; never block launch on it beyond M0 |
| R2 | MorphCard complexity eats the schedule | Medium | Medium | Build it **last** (M3); the site is complete and shippable without it; timebox 1 week |
| R3 | Inconsistent working pace (mood-based) | High | High | Milestones are small and checkable; one milestone = one tagged commit; no new scope mid-milestone |
| R4 | Scope creep (blog, dark mode, extra projects) | Medium | Medium | §1.4 and §4.2 are the contract; additions require a PRD change |
| R5 | cPanel host lacks Terminal / correct PHP version | Medium | High | Verify in M0 before building the backend (`design.md` §11 item 4) |
| R6 | Notification email lands in spam / fails | Medium | Medium | SPF/DKIM, domain mailbox; DB-first storage guarantees no loss |
| R7 | Form spam | Medium | Low | Throttle + honeypot; Turnstile only if needed |
| R8 | Skipped tests regress the contact flow | Medium | Medium | Exactly 5 feature tests (`design.md` §6.4), required for DoD |
| R9 | Using Hermes' proprietary fonts/assets | Low (documented) | High (legal) | Substitutes mandated; "No Hermes/Nous assets" is a DoD item |
| R10 | Performance regression from motion/fonts | Medium | Medium | Bundle visualizer before each deploy; 150 KB gzip budget |

---

## 12. Milestones

Proposed effort from kickoff; calendar dates depend on classes and are **not committed**. Each milestone ends with a tagged commit and a green checklist.

| M | Name | Deliverables | Exit criteria | Est. |
|---|------|--------------|---------------|------|
| M0 | Prerequisites | Foody permission + details; full name, bio, project results, social URLs; CV PDF; `portavia-about.png`; cPanel check (Terminal, PHP ≥ 8.2, subdomain); domain + mailbox | All `[…]` placeholders have real values or an explicit decision; host verified | 1 wk |
| M1 | Foundation | Vite + TS scaffold; tokens, fonts, surfaces; header/pinned/mobile nav; six static sections with real content; footer | Sections render at all breakpoints; no hamburger; lint/typecheck clean | 1–1.5 wk |
| M2 | Contact & backend | Laravel API, migration, Form Request, limiter, mail, CORS; form UI + states; 5 feature tests | FR-8 acceptance passes; tests green; real email received | 1 wk |
| M3 | Motion | MorphCard, project image swap, reduced-motion/mobile fallbacks | FR-4 passes; Lighthouse still ≥ targets; JS ≤ 150 KB gzip | 1 wk |
| M4 | Hardening & launch | A11y pass, Lighthouse, cross-browser check, OG image, headers, deploy, uptime monitor | DoD (§13) fully checked; `v1.0.0` tagged | 0.5–1 wk |

Critical path: M0 → M1 → M2 → M4. M3 can slip without blocking launch.

---

## 13. Definition of done (release)

- [ ] FR-1 … FR-11 acceptance criteria pass.
- [ ] No placeholder strings in the production bundle; Foody row reviewed for disclosure permission.
- [ ] Lighthouse mobile meets §3 targets on the **live** URL.
- [ ] `tsc -b`, ESLint, Prettier clean; zero `any`; runtime dependencies match the frozen list.
- [ ] 5 backend feature tests green.
- [ ] SEC-1 … SEC-8 verified on the server (check `APP_DEBUG=false`, headers via browser devtools, a real throttled request returns 429).
- [ ] Real submission arrives by email **and** appears in `contact_messages`.
- [ ] Tested at 360 / 768 / 1100 / 1440 / 1920 px; keyboard-only pass; reduced-motion pass.
- [ ] No Hermes/Nous assets or fonts in the repo.
- [ ] README documents: local run, build, deploy steps, how to update content (FR-9).
- [ ] `v1.0.0` tagged.

---

## 14. Open questions & assumptions

**Needed from Akmal (blocking):**
1. Foody: description, role, stack, outcome, disclosure permission.
2. `[FULL NAME]`, `[BIO]`, positioning line, PKL achievements.
3. `[ISI HASIL]` for Klinik Online and the portfolio; repo/live links.
4. Social URLs (GitHub, LinkedIn) — render only the ones provided.
5. `docs/reference/portavia-about.png` for the About layout.
6. Domain name; confirmation that the host supports a subdomain, Terminal, and PHP ≥ 8.2.

**Assumptions to confirm:** A1–A5 in `design.md` §0 (English-only, Tailwind v4, TypeScript, `api.` subdomain, Laravel 12); the metric targets in §3; milestone estimates in §12.

---

## 15. Change log vs previous PRD

| Change | Reason |
|--------|--------|
| Retro-editorial direction removed | Owner decision; structure kept |
| Visual system → Hermes-derived tokens/behaviors | Owner decision; proprietary fonts replaced |
| Language/framework fixed to TypeScript + React (minimal packages) | Owner decision |
| "CSRF" requirement → "abuse protection" (SEC-3) | CSRF does not apply to a public, cookie-less endpoint |
| Contact flow stores to DB before emailing | Prevents message loss on SMTP failure |
| Sanctum/Spatie excluded from the portfolio API | No auth or roles needed here |
| Content-placeholder build check added | Prevents publishing `[ISI …]` text |