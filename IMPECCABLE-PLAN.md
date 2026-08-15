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
> Follow-up critique pass: no detector findings remain. Best remaining score lift is interaction feedback and state clarity. Score after 6.4-6.6 estimated at **36/40** (Excellent threshold).
> Final critique pass: no detector findings remain. Remaining gains are recovery-path polish and clearer transient action feedback. Score after 6.7-6.8 estimated at **37/40**.

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

### 6.4 Add Contact Copy Feedback

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | The contact endpoint relied on `mailto:` only. That is fragile for recruiters on locked-down work machines or users without a configured mail client, and there was no visible confirmation for any contact action. |
| **Solution Applied** | Converted the email row into a split contact row with a direct mail link plus a `Copy` button. Added an `aria-live` status message that confirms successful clipboard copy or gives a manual recovery instruction if clipboard access fails. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss`, `src/assets/scripts/main.js` |
| **Acceptance** | Users can copy the email without launching a mail client. The copy action produces visible and screen-reader-readable feedback. |

### 6.5 Publish Active UI State to Assistive Tech

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | The site visually marked active in-page navigation links and switched the theme icon, but the equivalent state was not fully exposed semantically. |
| **Solution Applied** | Added `aria-pressed` updates to the theme toggle so dark mode is announced as an active toggle state. Updated section observer logic so active in-page nav links receive `aria-current="location"` and inactive links have it removed. |
| **Files** | `src/assets/scripts/main.js` |
| **Acceptance** | Visual active states now have semantic equivalents for keyboard and screen-reader users. |

### 6.6 Prevent Mobile Nav First-Paint Leak

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | Fresh mobile screenshots showed faint hidden nav labels at the top of the page during initial render. The deferred script added `.js-enabled` only after CSS loaded, so the no-JS fallback menu briefly painted before being hidden. |
| **Solution Applied** | Updated the existing head bootstrap script on all pages to add `.js-enabled` before the stylesheet loads, while still applying the saved theme before render. |
| **Files** | `src/index.html`, `src/resume.html`, `src/404.html` |
| **Acceptance** | Mobile nav links do not leak during first paint. The no-JS fallback remains available when JavaScript is disabled. |

### 6.7 Strengthen 404 Recovery Paths

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | The 404 page had only one recovery path: `Back to Home`. That is acceptable, but it leaves visitors who came looking for the resume or who found a broken link with unnecessary backtracking. |
| **Solution Applied** | Expanded the 404 copy with concrete recovery guidance and added three direct actions: home, resume, and email. The actions reuse existing button styles and stack cleanly on mobile. |
| **Files** | `src/404.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Error recovery is specific and task-focused. A recruiter can recover directly to the resume or report a broken link without hunting. |

### 6.8 Make Copy Feedback Visible on the Control

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | Email copy feedback appeared in the live status text, but the button itself did not change. Users who click and keep their eyes on the control get weaker confirmation than they should. |
| **Solution Applied** | Updated the copy action so the button text changes to `Copied` or `Failed` for four seconds while the `aria-live` message announces the same outcome. The button then resets to `Copy`. |
| **Files** | `src/assets/scripts/main.js` |
| **Acceptance** | The copy action confirms directly where the action occurred and still provides assistive-tech feedback. |

---

## Wave 4: Template Debt and Reading Comfort

> Re-critique on 2026-08-15 against the `feat/math-bearings-project` branch (PR #4).
> Independent score: **31/40**. Deterministic scan: clean (3 hits, all false positives
> on 1px `border-left` dividers).
> The homepage hero, the copy, and the print resume all read as authored. The template
> debt had moved into the two case-study pages, the project chips, and the experience stack.

### 7.1 De-Template the Two Case Studies

| Detail | Value |
|--------|-------|
| **Priority** | P1 |
| **Status** | **Done** |
| **Problem** | `math-bearings-technical.html` and `my-four-sous-chefs-technical.html` were class-for-class identical: a class-usage diff of the two files returned zero differences. Both used the same numbered-circle walkthrough, the same 3-up control band, and the same three decision cards. Those are the three most template-coded layouts available, and a visitor who read both pages met the mold rather than the projects. |
| **Solution Applied** | Removed `.walkthrough-step` and its pale-blue numbered circles entirely. **Math Bearings** now uses `.case-cycle`: a 2x2 field of named phases (Place, Serve, Grade, Decay) closed by a `.case-cycle__return` statement, because mastery decay makes the sequence a loop rather than a list. **My Four Sous Chefs** now uses `.case-pipeline`: a connected vertical chain where each stage declares the data at its boundary (`in: photos, pantry lists, preferences` to `out: durable product state`), because the product is literally a transform chain. Math Bearings' production section became `.gate-list`, a ruled name/claim/prose list matching its "gates that fail closed" framing; My Four Sous Chefs keeps `.control-band`. Class-usage diff now shows six structural differences. |
| **Files** | `src/math-bearings-technical.html`, `src/my-four-sous-chefs-technical.html`, `src/assets/styles/main.scss` |
| **Acceptance** | The two case studies no longer share a structure. Numbered circles are gone from the codebase. Each page's spine comes from its own project. |

### 7.2 Replace Project Highlight Chips With a Ruled List

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `.project-card__highlights` wrapped six sentence-length phrases into bordered chips inside a ~470px column, so each phrase took its own row at its own width. Math Bearings stacked six deep, My Four Sous Chefs broke two-per-row: adjacent cards with different rhythm and a ragged right edge on both. They are claims, not tags. |
| **Solution Applied** | Dropped the boxes. Highlights are now a ruled spec list: hairline top border per item, 0.85rem body face at weight 400, closing border on the last item. Holds its shape at any column width. Also dropped `font-weight: 600` from `.project-card__proof`, which was setting a five-line paragraph in bold. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Highlights read as evidence rows, not tags. Both project cards have the same rhythm. |

### 7.3 Fix Uncapped Line Length

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | `.experience-item__desc` had no `max-width`, so the most recent role ran about 128 characters per line. `.resume-list li` ran about 96. The site already capped `.project-card__proof` at 52ch and `.case-proof` at 760px, so the discipline existed but was missing exactly where the reading happens. |
| **Solution Applied** | `.experience-item` became a two-column grid (a 260px meta rail carrying role, company, and dates, plus the description) which fixes the measure structurally and stops the four items reading as four identical full-width blocks. Wrapped the meta in `.experience-item__meta` in the markup. Added `max-width: 68ch` to the description and `max-width: 74ch` to `.resume-list li`, reset to `none` in print. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss`, `src/assets/styles/_resume.scss` |
| **Acceptance** | No reading column exceeds 75ch. The experience section has internal structure instead of four repeated blocks. |

### 7.4 Give the PDF the Site's Typography

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | **Done** |
| **Problem** | Print overrode all three font families to Arial, so the artifact a recruiter downloads and keeps carried none of the site's typographic identity. ATS parses text, not glyphs, so the hedge bought nothing. |
| **Solution Applied** | Print now uses `'Schibsted Grotesk', Arial, Helvetica, sans-serif` for display and `'Source Sans 3', Arial, Helvetica, sans-serif` for body and mono, keeping Arial as the fallback for a print run without webfonts. Source Sans 3 runs taller, which pushed the PDF to two pages and tripped `assertSinglePage`. Reclaimed the height by stepping the print scale down: body 9.25pt to 8.9pt, `.resume-list li` 9pt to 8.6pt at 1.25 leading, `.resume-job__role` 10.5pt to 10pt, job margin 6px to 5px, and `@page` margin 0.4in to 0.35in. |
| **Files** | `src/assets/styles/_resume.scss` |
| **Acceptance** | The PDF is set in the site's fonts and `npm run resume:pdf` still passes the one-page assertion. |

### 7.5 Correctness and Consistency Fixes

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | Six defects found by reading the rendered output rather than the source. (1) The open mobile menu was 95% opaque with a backdrop blur over the dark hero, so the hero name read straight through the menu items. (2) `.nav__link:last-child` matched every link, since each `<a>` is the only child of its `<li>`, silently removing all mobile menu separators. (3) `.contact-row:hover` set `border-color` to the value it already had, making the hover state a no-op. (4) `--text-tertiary` was more prominent than `--text-secondary` in both themes, so metadata out-contrasted body copy. (5) `justify-content: space-between` stranded the resume project descriptor in mid-air and marooned job locations at the far right. (6) `.case-story__proof` put a bottom rule on its last child, leaving a hanging line. Plus: `#skills`/"Focus"/"Engineering Focus" named one section three ways, and `\|` and `·` were both in use as separators. |
| **Solution Applied** | Mobile menu panels are fully opaque in both themes and the now-pointless `backdrop-filter` is gone. Separator rule retargeted to `.nav__links > li:last-child .nav__link`. Contact row hover moves to `var(--accent)`. Tertiary retuned to `oklch(0.50 0.025 260)` light and `oklch(0.66 0.018 260)` dark, both verified at 4.5:1 or better on every surface they land on including `--accent-pale`. Both stranded layouts became wrapping flex rows with a middot separator, screen and print. Orphan rule scoped with `:not(:last-child)`. Section id renamed to `#focus` across both pages. Resume title separator changed to `·`. Also removed the tinted rounded tile behind the contact icons and switched `.resume-project__type` off mono, since it sets a human phrase rather than technical metadata. |
| **Files** | `src/index.html`, `src/resume.html`, `src/assets/styles/main.scss`, `src/assets/styles/_resume.scss` |
| **Acceptance** | Mobile menu is legible over the hero with visible separators. Hover states do something. Metadata reads quieter than body copy while still passing AA. One name and one separator per concept. |

### 7.6 Wave 4 Verification

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | **Done** |
| **Problem** | The Wave 4 edits introduced two regressions of their own, caught by re-running the detector rather than by eye. |
| **Solution Applied** | `.gate-list__claim` was setting 32 to 34 character sentences in uppercase, tripping `all-caps-body`; uppercase removed and the claim reset to 0.9rem accent-colored body face. `.case-pipeline__io` was 11.2px, tripping `tiny-text`; raised to 0.75rem. Re-scan returns only the four known false positives on 1px `border-left` dividers. `npm run build` succeeds and the PDF stays one page. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Detector clean apart from known false positives. Build and PDF green. |

---

## Phase Summary

| Phase | Items | Priority Range | Focus |
|-------|-------|---------------|-------|
| **Phase 1** | 1.1 - 1.5 | P1-P2 | Remove AI tells, establish distinctive visual identity |
| **Phase 2** | 2.1 - 2.3 | P2-P3 | Fix content gaps and cognitive load |
| **Phase 3** | 3.1 - 3.5 | P2-P3 | Accessibility and technical standards |
| **Phase 4** | 4.1 - 4.3 | P2-P3 | Visual distinction and final polish |
| **Wave 2** | 5.1 - 5.8 | P2-P3 | Post-critique refinement (31→33+ target) |
| **Wave 3** | 6.1 - 6.8 | P2-P3 | Legibility, interaction, and recovery tightening |
| **Wave 4** | 7.1 - 7.6 | P1-P3 | Template debt in the case studies, reading comfort, PDF typography |

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
| 2026-05-02 | 6.4 | Done — Contact email row now includes copy-to-clipboard with live success/error feedback |
| 2026-05-02 | 6.5 | Done — Theme toggle exposes `aria-pressed`; active section nav exposes `aria-current="location"` |
| 2026-05-02 | 6.6 | Done — Head bootstrap now adds `.js-enabled` before CSS to prevent mobile nav first-paint leak |
| 2026-05-02 | 6.7 | Done — 404 page now offers direct recovery links to home, resume, and email |
| 2026-05-02 | 6.8 | Done — Copy button now changes to `Copied` or `Failed` before resetting |
| 2026-08-15 | 7.1 | Done — Case studies de-templated: Math Bearings uses a mastery cycle and gate list, My Four Sous Chefs uses a data pipeline |
| 2026-08-15 | 7.2 | Done — Project highlights changed from bordered chips to a ruled spec list; proof paragraph no longer bold |
| 2026-08-15 | 7.3 | Done — Experience item split into meta rail plus description; reading columns capped at 68ch and 74ch |
| 2026-08-15 | 7.4 | Done — Print uses Schibsted Grotesk and Source Sans 3; print scale stepped down to hold one page |
| 2026-08-15 | 7.5 | Done — Opaque mobile menu, working separator and hover selectors, tertiary/secondary hierarchy corrected, stranded layouts joined, `#focus` rename |
| 2026-08-15 | 7.6 | Done — Fixed all-caps and tiny-text regressions introduced in 7.1; detector clean, build and PDF green |
