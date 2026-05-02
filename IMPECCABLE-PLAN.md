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
| **Status** | Not started |
| **Problem** | Four experience cards on the homepage show role, company, and description but no dates or duration. Visitors cannot assess depth of experience. 17+ years of career progression is invisible. |
| **Proposed Solution** | Add date ranges to each `.experience-item` on the homepage (matching the resume page format). Consider adding total years of experience somewhere prominent (hero subtitle or experience section intro). Style the dates consistently with the resume page treatment. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Every experience item on the homepage shows a date range. Career depth is immediately apparent to a 30-second visitor. |

### 2.2 Restructure Skills Section to Reduce Cognitive Load

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | Not started |
| **Problem** | 30+ skill tags across 5 groups displayed simultaneously. The `tag--accent` binary distinction does not communicate clear hierarchy. Fails the working memory cognitive load test. A hiring manager cannot extract signal in 30 seconds. |
| **Proposed Solution** | Reduce to 3-4 groups maximum. Show only 8-12 "headline" skills. Use size, weight, or position (not just border color) to create genuine hierarchy. Consider a prose-plus-tags hybrid: a short sentence per group describing the capability, with key technologies as supporting tags. Remove or collapse less critical items behind progressive disclosure. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Skills section is scannable in under 10 seconds. Clear hierarchy between primary and supporting skills. No more than 4 visible groups. |

### 2.3 Fix "Capabilities" vs "Skills" Terminology Mismatch

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | Not started |
| **Problem** | Nav link says "Skills" but the section heading says "Capabilities." |
| **Proposed Solution** | Pick one term and use it consistently in both locations. |
| **Files** | `src/index.html` |
| **Acceptance** | Nav link text matches section heading text. |

---

## Phase 3: Accessibility & Technical Quality

Fix measurable standards violations.

### 3.1 Fix Color Contrast on Tertiary Text

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | Not started |
| **Problem** | `--text-tertiary: #6E7282` on `--bg: #F8F6F2` is ~3.7:1, failing WCAG AA for normal text. Used on contact labels, resume metadata, footer copy (small uppercase mono labels at 0.7rem). |
| **Proposed Solution** | Darken `--text-tertiary` to a value that clears 4.5:1 against both light and dark backgrounds. Verify dark mode tertiary also passes. This will need to be revisited after Phase 1.5 (palette evolution) to ensure the new palette maintains compliance. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | All text/background combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text). Verified in both light and dark modes. |

### 3.2 Fix Tight Line Heights on Wrapping Headings

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | Not started |
| **Problem** | `line-height: 1.1` on `.resume-header__title`, `.resume-project__title`, `.resume-job__role`, `.experience-item__role`. These are multi-word headings that can wrap to two lines, where 1.1 makes lines visually collide. |
| **Proposed Solution** | Increase to `line-height: 1.2` minimum for all heading classes that can wrap. Single-line display headings (hero name) can remain at 1.0. |
| **Files** | `src/assets/styles/main.scss`, `src/assets/styles/_resume.scss` |
| **Acceptance** | No heading text visually collides when it wraps. All wrapping headings have line-height >= 1.2. |

### 3.3 Increase Mobile Nav Toggle Touch Target

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | Not started |
| **Problem** | `.nav__toggle` is 32x32px with 4px padding. Below the 44x44px recommended minimum touch target for mobile. |
| **Proposed Solution** | Increase to `min-width: 44px; min-height: 44px;` or use padding to achieve 44px effective touch area while keeping the visual size the same. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Nav toggle effective touch area is at least 44x44px. Visual appearance remains clean. |

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
| **Status** | Not started |
| **Problem** | Space tokens (`--space-xs` through `--space-2xl`) and `--nav-height` use hardcoded `px` values. These won't scale with user font-size preferences. |
| **Proposed Solution** | Convert spacing tokens to `rem` values (e.g., `6px` becomes `0.375rem`). Keep `--nav-height` in px since it is used for scroll offset calculations where pixel precision matters, or convert and test. |
| **Files** | `src/assets/styles/main.scss` |
| **Acceptance** | Spacing tokens use `rem`. Layout scales correctly when browser base font size is changed. Print styles (which override tokens with px values) remain unaffected. |

---

## Phase 4: Polish & Distinction

Make the site feel authored, not generated.

### 4.1 Strengthen Visual Hierarchy and Rhythm

| Detail | Value |
|--------|-------|
| **Priority** | P2 |
| **Status** | Not started |
| **Problem** | The hierarchy relies almost entirely on font size and weight. Sections have identical visual rhythm (same padding, same label treatment, same card patterns). The experience section is a stack of identical cards that creates monotony. |
| **Proposed Solution** | Vary spacing between sections for rhythm. Differentiate section types visually (not just alternating background). Give the experience section a distinct layout treatment (timeline, staggered cards, or prose-based format rather than identical cards). Ensure the type scale has >= 1.25 ratio between steps. |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | A visitor can distinguish sections by feel, not just by reading the label. No two adjacent sections have identical visual treatment. |

### 4.2 Improve Contact Section Warmth

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | Not started |
| **Problem** | The contact section is emotionally flat. "I'm open to senior engineering roles, technical leadership opportunities, and interesting product conversations" reads like a template placeholder. This is the conversion endpoint. |
| **Proposed Solution** | Add personality to the contact copy. Make the email/LinkedIn cards feel more inviting. Consider a brief personal note or a more specific call to action. The design treatment should signal "this is where I want you to end up." |
| **Files** | `src/index.html`, `src/assets/styles/main.scss` |
| **Acceptance** | Contact section feels like an invitation, not a form field. Copy has personality that matches the brand voice. |

### 4.3 Final Polish Pass

| Detail | Value |
|--------|-------|
| **Priority** | P3 |
| **Status** | Not started |
| **Problem** | After all changes, a final consistency and quality pass is needed. |
| **Proposed Solution** | Run `$impeccable polish` to catch any remaining issues, verify print styles, dark mode, and mobile responsiveness are all cohesive after changes. Rebuild CSS (`npm run sass:build`) and verify PDF generation still works (`npm run resume:pdf`). |
| **Files** | All source files |
| **Acceptance** | Build succeeds. PDF generates correctly. Dark mode is cohesive. Mobile is responsive. No regressions from critique baseline. Re-run `$impeccable critique` to verify score improvement. |

---

## Phase Summary

| Phase | Items | Priority Range | Focus |
|-------|-------|---------------|-------|
| **Phase 1** | 1.1 - 1.5 | P1-P2 | Remove AI tells, establish distinctive visual identity |
| **Phase 2** | 2.1 - 2.3 | P2-P3 | Fix content gaps and cognitive load |
| **Phase 3** | 3.1 - 3.5 | P2-P3 | Accessibility and technical standards |
| **Phase 4** | 4.1 - 4.3 | P2-P3 | Visual distinction and final polish |

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
