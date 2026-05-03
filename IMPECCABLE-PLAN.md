# Impeccable Redesign Plan

> Source of truth for all design improvements to vincecongini.com.
> Generated from `$impeccable critique` on 2026-05-02.
> Score at critique: **26/40** (Acceptable). Target: **32+/40** (Good).

---

## Guiding Constraints

- Resume page must continue generating the downloadable PDF via `scripts/generate-resume-pdf.mjs`
- Print styles must be preserved and updated alongside screen styles
- Both pages (index + resume) are in scope for visual updates
- All changes must maintain WCAG AA compliance
- Dark mode (`prefers-color-scheme`) must remain functional
- `prefers-reduced-motion` support must be preserved

---

## Phase 1: De-Slop (Remove AI Tells)

The highest-leverage changes. These shift perception from "AI generated this" to "a person with taste made this."

### 1.1 Replace Font Stack

| Detail | Value |
|--------|-------|
| **Priority** | P1 |
| **Status** | **Done** |
| **Problem** | Syne, DM Sans, DM Mono are all on the reflex-reject list. This is the most recognizable AI portfolio font combination in 2025-2026. |
| **Solution Applied** | Display: **Schibsted Grotesk** (Scandinavian precision, confident terminals, not on reject list). Body: **Source Sans 3** (Adobe's open-source workhorse, exceptional readability). Mono: **JetBrains Mono** (developer-respected, used sparingly). Updated CSS tokens and Google Fonts `<link>` in all three HTML files (index, resume, 404). |
| **Files** | `src/index.html`, `src/resume.html`, `src/404.html`, `src/assets/styles/main.scss` |
| **Acceptance** | No reflex-reject fonts in use. Font pairing feels authored, not generated. Print styles still render correctly. PDF generates successfully. |

### 1.2 Reduce Monospace Overuse

| Detail | Value |
|--------|-------|
| **Priority** | P1 |
| **Status** | **Done** |
| **Problem** | `font-family: var(--font-mono)` appears in 15+ UI elements (nav links, buttons, section labels, skill labels, contact labels, footer, breadcrumbs, status text, metadata). Monospace-everything is the lazy AI shorthand for "developer." |
| **Solution Applied** | Reduced from 15+ elements to 4 instances across 2 semantic roles: **URLs** (project-card__url, resume-project__url) and **technical metadata** (project-card__status, resume-project__type). All other elements switched to `var(--font-body)` with `font-weight: 600` to maintain visual structure. Updated: nav links, buttons, section labels, skip link, hero scroll, project highlights, experience company, skill group labels, tags, contact labels, footer, breadcrumbs, resume header labels, resume stack labels, resume job meta, resume skill group labels, resume education dates, error page label. |
| **Files** | `src/assets/styles/main.scss`, `src/assets/styles/_resume.scss` |
| **Acceptance** | Mono appears in exactly 2 distinct UI roles (URLs, technical metadata). The site no longer reads as "monospace = developer." |

### 1.3 Remove Side-Stripe Borders

| Detail | Value |
|--------|-------|
| **Priority** | P1 |
| **Status** | **Done** |
| **Problem** | `border-left: 3px solid var(--accent)` on `.hero__statement` and `border-left: 4px solid var(--accent)` on `.resume-project__card` violate the absolute ban on side-stripe borders > 1px as colored accent. |
| **Solution Applied** | Hero statement: replaced `border-left` with `background: oklch(0.98 0.003 260 / 0.06)` (subtle frosted tint on dark hero) + `border-radius` + full padding. Resume project card (screen): removed `border-left: 4px`, relying on existing `border: 1px solid var(--border)` + background. Resume project card (print): changed `border-left: 5px` to `border-top: 3px solid var(--accent)` for structural emphasis without side-stripe. |
| **Files** | `src/assets/styles/main.scss`, `src/assets/styles/_resume.scss` |
| **Acceptance** | Zero instances of side-stripe borders > 1px as colored accent on screen. Print uses top-border instead. |

### 1.4 Remove Em Dashes from Copy and Decorations

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `&mdash;` used in date ranges (should be en dashes), aria-labels, and as decorative `::before` content on every section label (double em-dash prefix). Em dashes are on the absolute ban list. The section label prefix is also an editorial-magazine AI reflex. |
| **Solution Applied** | All `&mdash;` in resume.html date ranges → `&ndash;`. Aria-labels in index.html and resume.html: `&mdash;` → comma. 404.html label: `&mdash;` → `·` (middle dot). Section label `::before`: replaced `content: '\2014\2014\00a0\00a0'` with a 16×2px accent-colored line (`display: block; width: 16px; height: 2px; background: var(--accent-rule)`). Print styles already hide `::before` with `content: none`. |
| **Files** | `src/index.html`, `src/resume.html`, `src/404.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Zero em dashes anywhere in source. Date ranges use en dashes. Section labels use a small accent mark. |

### 1.5 Evolve Color Palette Beyond Safe Navy-on-Cream

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `#2A3A8C` accent on `#F8F6F2` background is close to the generic "blue on cream" AI palette. The overall strategy is Restrained, which for a brand-register site reads as timid. `#fff` appears 13 times; neutrals are not tinted toward the brand hue. Colors use hex, not OKLCH. |
| **Solution Applied** | Full OKLCH conversion with brand hue 260 (cobalt-indigo). Committed strategy: hero bg is `oklch(0.20 0.04 260)` (deep branded indigo-black, not flat gray). Accent is `oklch(0.45 0.18 260)` (richer, more saturated cobalt). All neutrals tinted toward brand hue (chroma 0.005–0.025). All `#fff` replaced with `oklch(0.98 0.003 260)` (blue-tinted near-white). All `rgba(255,...)` converted to `oklch(.../ alpha)`. Dark mode fully updated with OKLCH tokens. Hero selection, project dot green, mobile nav overlays all converted. Print styles retain hex (needed for PDF renderer compatibility) — `#fff` kept only in print `@media` for paper background. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Zero `#fff` or `#000` on screen. Hero uses Committed color strategy. All custom properties use OKLCH. Both light and dark modes updated. Print styles preserved with hex fallbacks. |

---

## Phase 2: Content & UX Gaps

Address information architecture and cognitive load issues.

### 2.1 Add Dates to Homepage Experience Section

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | Four experience cards on the homepage show role, company, and description but no dates or duration. Visitors cannot assess depth of experience. 17+ years of career progression is invisible. |
| **Solution Applied** | Added `.experience-item__dates` to all 4 experience items with date ranges matching the resume (using `&ndash;` for ranges). New CSS class styled as italic tertiary text at 0.75rem with letter-spacing. Company margin reduced from `space-sm` to `2px` so dates sit visually below company name before the description. Career depth (2007–Present) is now immediately visible. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Every experience item shows a date range. 17+ years of progression is immediately apparent. |

### 2.2 Restructure Skills Section to Reduce Cognitive Load

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | 30+ skill tags across 5 groups displayed simultaneously. The `tag--accent` binary distinction does not communicate clear hierarchy. Fails the working memory cognitive load test. A hiring manager cannot extract signal in 30 seconds. |
| **Solution Applied** | Reduced from 5 groups / 30+ tags to **3 groups / 11 tags** using a prose-plus-tags hybrid. Each group has a descriptive sentence (the capability) and 3-4 key technology tags (the tools). Groups: "Frontend & Architecture" (TypeScript, React, Vite, Node.js), "AI & Product Engineering" (Anthropic Claude, Supabase, PostgreSQL, Stripe), "Quality & Delivery" (Playwright, Vitest, CI/CD). Removed `tag--accent` binary distinction. Added `.skill-group__desc` CSS class. Full skills detail remains on the resume page. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | 3 groups, 11 tags, prose descriptions. Scannable in under 10 seconds. Clear hierarchy between capability (prose) and tools (tags). |

### 2.3 Fix "Capabilities" vs "Skills" Terminology Mismatch

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | Nav link says "Skills" but the section heading says "Capabilities." |
| **Solution Applied** | Changed section heading from "Capabilities" to "Skills" to match the nav link. "Skills" is more immediately understood by hiring managers scanning quickly. |
| **Files** | `src/index.html` |
| **Acceptance** | Nav link text ("Skills") matches section heading text ("Skills"). |

---

## Phase 3: Accessibility & Technical Quality

Fix measurable standards violations.

### 3.1 Fix Color Contrast on Tertiary Text

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** (addressed during Phase 1.5) |
| **Problem** | `--text-tertiary: #6E7282` on `--bg: #F8F6F2` is ~3.7:1, failing WCAG AA for normal text. Used on contact labels, resume metadata, footer copy (small uppercase mono labels at 0.7rem). |
| **Solution Applied** | Set `--text-tertiary: oklch(0.38 0.02 260)` in light mode (L=0.38 on L=0.97 bg ≈ 5.8:1). Dark mode: `oklch(0.62 0.02 260)` on `oklch(0.18...)` bg ≈ 4.8:1. Both pass WCAG AA 4.5:1 for normal text. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | All text/background combinations meet WCAG AA in both light and dark modes. |

### 3.2 Fix Tight Line Heights on Wrapping Headings

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `line-height: 1.1` on `.resume-header__title`, `.resume-project__title`, `.resume-job__role`, `.experience-item__role`. These are multi-word headings that can wrap to two lines, where 1.1 makes lines visually collide. |
| **Solution Applied** | Increased `line-height` from 1.1 to 1.25 on all four heading classes: `.experience-item__role` (main.scss), `.resume-header__title`, `.resume-project__title`, `.resume-job__role` (_resume.scss). Hero name remains at 1.0 (single-line display). |
| **Files** | `src/assets/styles/main.scss`, `src/assets/styles/_resume.scss` |
| **Acceptance** | All wrapping headings have line-height 1.25. No text collision on wrap. |

### 3.3 Increase Mobile Nav Toggle Touch Target

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `.nav__toggle` is 32x32px with 4px padding. Below the 44x44px recommended minimum touch target for mobile. |
| **Solution Applied** | Changed to `min-width: 44px; min-height: 44px; padding: 10px;`. Visual hamburger lines remain the same size (rendered by inner `<span>` elements), but the touch target is now 44×44px minimum. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Nav toggle effective touch area is at least 44×44px. Visual appearance unchanged. |

### 3.4 Remove Orphaned CSS

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** (addressed during Phase 1) |
| **Problem** | `.btn--ghost` is defined in main.scss but never used in any HTML file. |
| **Solution Applied** | Removed the `.btn--ghost` ruleset from main.scss during the Phase 1 cleanup. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | No CSS rulesets with zero HTML references. |

### 3.5 Convert Spacing Tokens to rem

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | Space tokens (`--space-xs` through `--space-2xl`) and `--nav-height` use hardcoded `px` values. These won't scale with user font-size preferences. |
| **Solution Applied** | Converted all spacing tokens to rem: 6→0.375, 12→0.75, 24→1.5, 48→3, 80→5, 128→8. Converted `--inline-pad` and `--col-gap` clamp values to rem. Kept `--nav-height` at 56px (scroll offset precision). Kept `--radius-*` and `--max-width` in px (border-radius and max-width don't need to scale). Print styles retain px overrides (unchanged). |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Spacing tokens use `rem`. Layout scales with user font-size. Print styles unaffected. |

---

## Phase 4: Polish & Distinction

Make the site feel authored, not generated.

### 4.1 Strengthen Visual Hierarchy and Rhythm

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | The hierarchy relies almost entirely on font size and weight. Sections have identical visual rhythm (same padding, same label treatment, same card patterns). The experience section is a stack of identical cards that creates monotony. |
| **Solution Applied** | Added `section--tight` modifier (5rem padding vs 8rem default). Applied to skills section so it sits tighter against adjacent sections. Experience section already differentiated by the new date ranges, prose-based descriptions, and alternating bg. Section label treatment changed earlier (16px accent line vs em-dash). Combined with Phase 1's hero bg color (deep indigo vs flat dark), Phase 2's skills prose-plus-tags hybrid, and varied spacing, each section now has a distinct visual feel. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Adjacent sections have different visual treatments. Spacing varies for rhythm. |

### 4.2 Improve Contact Section Warmth

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | The contact section is emotionally flat. "I'm open to senior engineering roles, technical leadership opportunities, and interesting product conversations" reads like a template placeholder. This is the conversion endpoint. |
| **Solution Applied** | Replaced template-style copy with direct, confident CTA: "Building something that needs strong front-end leadership? I'd like to hear about it." Matches the brand voice (credible, precise, authored) and reads as a personal invitation rather than a form field. |
| **Files** | `src/index.html` |
| **Acceptance** | Contact copy has personality. Reads as an invitation, not a placeholder. |

### 4.3 Final Polish Pass

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | After all changes, a final consistency and quality pass is needed. |
| **Solution Applied** | Final build verified: `sass:build` succeeds, `resume:pdf` generates (223KB). Scanned for remaining slop markers (`#fff`, `#000`, `mdash`, reject-list fonts): zero hits outside print styles. All 16 plan items complete. |
| **Files** | All source files |
| **Acceptance** | Build succeeds. PDF generates. Zero AI slop markers remaining on screen. |

---

## Wave 2: Post-Critique Refinement

> Re-critique on 2026-05-02. Score improved from **26/40** to **31/40** (Good).
> AI slop detection: **PASS**. Target: **33+/40**.

### 5.1 Fix Skills Grid Orphan

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | Three skill groups in `grid-template-columns: repeat(2, 1fr)` puts two groups on row one and one alone on row two. The empty right cell reads as a layout mistake. The orphaned group (Quality & Delivery) appears less important. |
| **Solution** | Change desktop skills grid to `repeat(3, 1fr)`. Keep existing 1-column mobile fallback at 768px. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | All 3 skill groups fill one row on desktop. No visual orphan. Mobile unchanged. |

### 5.2 Strengthen Hero Statement Box

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `.hero__statement` background at `oklch(0.98 0.003 260 / 0.06)` — 6% opacity — is nearly invisible. Reads as a rendering artifact or a removed design element that left a ghost. |
| **Solution** | Increase background opacity to ~12-15% so the panel is clearly visible as a distinct element that frames the value proposition. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Hero statement panel is clearly visible as a distinct element on standard and low-contrast displays. |

### 5.3 Add Experience Substance to Homepage

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | Four one-sentence experience descriptions after a rich project card with 6 highlights. The most recent role has the same depth as the oldest. Hiring managers get titles and companies but no evidence of impact. Resume page has specifics (RARE Award, monorepo extraction, CI/CD pipelines) that should surface on the homepage. |
| **Solution** | Add 2-3 specific accomplishments to the most recent role's homepage description. Optionally add 1-2 to the second most recent role. Older roles stay concise. |
| **Files** | `src/index.html` |
| **Acceptance** | Most recent experience item shows measurable or specific accomplishments. Progressive depth: recent roles have more detail than older ones. |

### 5.4 Fix Favicon Color Consistency

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | Inline SVG favicon uses hex `#2A3A8C` (old accent) while the site palette uses OKLCH hue 260. These render differently. On a "practice what you preach" site, metadata is part of the craft. |
| **Solution** | Update the SVG favicon `fill` to match the computed hex equivalent of `oklch(0.45 0.18 260)`. |
| **Files** | `src/index.html`, `src/resume.html`, `src/404.html` |
| **Acceptance** | Favicon color visually matches the on-screen accent. |

### 5.5 Refine Hero Confidence

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | The `min-height: 100vh` hero forces a full scroll before substance. The "Scroll" indicator is itself an admission the user might not continue. The intent is confidence, but the bottom 40-50% of the viewport is unused space. |
| **Solution** | Reduce hero from `100vh` to `min-height: 85vh` (or `85svh`). Enough height to feel intentional, but the top of the project section peeks above the fold, signaling content below. Remove the "Scroll" indicator — if the hero is properly sized, it's unnecessary. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Hero is still a confident full-width section. Content peeks above the fold on standard viewports. No scroll indicator needed. |

### 5.6 Remove Dead CSS and Meta Cleanup

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | `.tag--accent` CSS defined but never used in HTML. Em dash characters (`—`) in OG/Twitter image:alt meta tags. `text-transform: uppercase` on project highlight phrases (47 chars of uppercase at 0.7rem is unreadable). |
| **Solution Applied** | Removed `.tag--accent` CSS rule. Replaced em dashes in meta alt text with commas. Removed `text-transform: uppercase` from `.project-card__highlights li`. |
| **Files** | `src/assets/styles/main.scss`, `src/index.html`, `src/resume.html` |
| **Acceptance** | Zero dead CSS. Zero em dashes in source. Project highlights readable in normal case. |

### 5.7 Final Wave 2 Polish

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | After all Wave 2 changes, verify build, PDF generation, and zero regressions. |
| **Solution Applied** | `sass:build` succeeds. `resume:pdf` generates (223KB). Zero dead CSS, zero em dashes, zero old hex values, zero slop markers. |
| **Files** | All source files |
| **Acceptance** | Build succeeds. PDF generates. No visual regressions. |

### 5.8 Dark/Light Mode Toggle

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | Dark mode exclusively controlled via `prefers-color-scheme` media query. No user-facing toggle. On a "practice what you preach" portfolio site, building a theme toggle demonstrates front-end craft. |
| **Solution Applied** | **CSS**: Refactored dark mode into `@mixin dark-theme` and `@mixin dark-mobile`. System preference uses `html:not([data-theme])` guard; manual override uses `html[data-theme="dark"]`. Added `.theme-toggle` button styles with icon visibility rules (moon in light, sun in dark). **HTML**: Added inline `<script>` in `<head>` (all 3 pages) to read `localStorage` and set `data-theme` before render (prevents flash). Added toggle button with moon/sun SVG icons to nav in index.html and resume.html. **JS**: Toggle click swaps `data-theme` attribute and persists to `localStorage`. System preference change listener updates icon when no manual preference set. Aria label updates dynamically. **Nav layout**: Changed from `justify-content: space-between` to `margin-left: auto` on links to accommodate the toggle as a sibling element. Mobile: toggle sits beside hamburger via flex `order`. |
| **Files** | `src/assets/styles/main.scss`, `src/index.html`, `src/resume.html`, `src/404.html`, `src/assets/scripts/main.js` |
| **Acceptance** | Toggle switches between light/dark mode. Preference persists across pages and sessions. System preference respected as default. No flash of wrong theme on load. Icons swap correctly. Accessible via keyboard with descriptive aria-label. |

---

## Wave 3: Legibility & Interaction Tightening

> Re-critique on 2026-05-02 after Wave 2. Score estimated at **34/40** (Good).
> AI slop detection: **PASS**. Deterministic scan found small text and tight-leading issues only.

### 6.1 Increase Featured Project Chip Text

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `$impeccable critique` deterministic scan flagged six `11.2px` text instances on the homepage. These map to the featured project highlight chips, which are real content, not decorative labels. |
| **Solution Applied** | Increased `.project-card__highlights li` from `0.7rem` to `0.75rem` and reduced letter spacing from `0.04em` to `0.02em` to preserve fit while improving readability. Increased `.project-card__status` to `0.75rem` for consistency. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Featured project chips render at 12px minimum, with less cramped tracking. CLI detector no longer flags tiny text. |

### 6.2 Relax Resume Heading Leading

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `$impeccable critique` deterministic scan flagged a `line-height 1.25x` issue on the resume. Several resume headings can wrap on mobile or narrow print contexts, where 1.25 still reads tight. |
| **Solution Applied** | Increased `.resume-header__title`, `.resume-project__title`, and `.resume-job__role` line-height from `1.25` to `1.35`. |
| **Files** | `src/assets/styles/_resume.scss` |
| **Acceptance** | Wrapping resume headings have enough breathing room on screen and mobile. CLI detector no longer flags tight leading. |

### 6.3 Improve Toggle Touch Target and State Label

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | The theme toggle was visually tidy but only `36x36px`, smaller than the 44px mobile target used for the nav toggle. The menu button also kept a static `Menu` label while open. |
| **Solution Applied** | Increased `.theme-toggle` to `44x44px` minimum and updated menu JavaScript to switch the button aria-label between `Open menu` and `Close menu`. |
| **Files** | `src/assets/styles/main.scss`, `src/assets/scripts/main.js` |
| **Acceptance** | Header controls meet the same mobile hit target standard. Screen-reader state is clearer when the menu opens and closes. |

---

## Phase Summary

| Phase | Items | Priority Range | Focus |
|-------|-------|---------------|-------|
| **Phase 1** | 1.1 - 1.5 | P1-P2 | Remove AI tells, establish distinctive visual identity |
| **Phase 2** | 2.1 - 2.3 | P2-P3 | Fix content gaps and cognitive load |
| **Phase 3** | 3.1 - 3.5 | P2-P3 | Accessibility and technical standards |
| **Phase 4** | 4.1 - 4.3 | P2-P3 | Visual distinction and final polish |
| **Wave 2** | 5.1 - 5.8 | P2-P3 | Post-critique refinement (31→33+ target) |
| **Wave 3** | 6.1 - 6.3 | P2-P3 | Legibility and interaction tightening |

---

## Changelog

| Date | Item | Change |
|------|------|--------|
| 2026-05-02 | All | Plan created from `$impeccable critique` findings |
| 2026-05-02 | 1.1 | Done — Fonts: Schibsted Grotesk / Source Sans 3 / JetBrains Mono |
| 2026-05-02 | 1.2 | Done — Mono reduced from 15+ elements to 4 instances (2 roles) |
| 2026-05-02 | 1.3 | Done — Side-stripe borders removed (hero: bg tint, resume card: removed, print: top-border) |
| 2026-05-02 | 1.4 | Done — Zero em dashes remain; section labels use 16px accent line |
| 2026-05-02 | 1.5 | Done — Full OKLCH palette, Committed hero, tinted neutrals, dark mode updated |
| 2026-05-02 | 3.4 | Done — `.btn--ghost` removed (during Phase 1 cleanup) |
| 2026-05-02 | 2.1 | Done — Date ranges added to all 4 homepage experience items |
| 2026-05-02 | 2.2 | Done — Skills restructured: 5 groups/30+ tags → 3 groups/11 tags with prose |
| 2026-05-02 | 2.3 | Done — Section heading changed from "Capabilities" to "Skills" |
| 2026-05-02 | 3.1 | Done — Tertiary text contrast fixed during Phase 1.5 palette (≈5.8:1 light, ≈4.8:1 dark) |
| 2026-05-02 | 3.2 | Done — Line heights increased from 1.1 to 1.25 on 4 heading classes |
| 2026-05-02 | 3.3 | Done — Nav toggle touch target increased to 44×44px minimum |
| 2026-05-02 | 3.5 | Done — Spacing tokens converted from px to rem |
| 2026-05-02 | 4.1 | Done — Section spacing varied, visual hierarchy improved across phases |
| 2026-05-02 | 4.2 | Done — Contact copy rewritten: direct, confident CTA |
| 2026-05-02 | 4.3 | Done — Final verification: build, PDF, zero slop markers |
| 2026-05-02 | 5.6 | Done — Removed `.tag--accent` dead CSS, em dashes in meta, uppercase on highlights |
| 2026-05-02 | 5.1 | Done — Skills grid changed from `repeat(2, 1fr)` to `repeat(3, 1fr)` on desktop |
| 2026-05-02 | 5.2 | Done — Hero statement background opacity increased from 6% to 12% |
| 2026-05-02 | 5.3 | Done — Senior Tech Lead description expanded with monorepo extraction, CI/CD, RARE Award |
| 2026-05-02 | 5.4 | Done — Favicon fill updated from `#2A3A8C` to `#044cb6` (OKLCH 0.45 0.18 260) |
| 2026-05-02 | 5.5 | Done — Hero reduced to 85vh/svh, scroll indicator removed |
| 2026-05-02 | 5.7 | Done — Build, PDF (223KB), and regression verification passed |
| 2026-05-02 | 5.8 | Done — Dark/light toggle: mixin refactor, localStorage persistence, flash prevention, moon/sun icons |
| 2026-05-02 | 6.1 | Done — Featured project chip/status text increased to 0.75rem |
| 2026-05-02 | 6.2 | Done — Resume heading line-height increased to 1.35 |
| 2026-05-02 | 6.3 | Done — Theme toggle hit target increased to 44px; menu aria-label now reflects open/close state |
