# Design

## Design Register

brand

## Design Intent

A quiet, technically credible portfolio for a senior front-end tech lead. The site should feel precise, authored, and confident without becoming flashy or decorative. The design demonstrates craft through restraint, hierarchy, accessibility, and careful implementation detail.

## Visual Voice

- Technical, but not developer cosplay
- Understated confidence
- Editorial clarity without magazine affectation
- Sparse, structured, and deliberate
- Distinctive through execution, not spectacle

## Color System

Color strategy: committed restraint.

The hero uses a deep indigo-black field as the strongest brand moment. The rest of the site uses tinted light neutrals with cobalt-indigo accents.

Use OKLCH for screen colors.

Core roles:

- `--accent`: primary cobalt action color
- `--accent-mid`: quieter link and label accent
- `--accent-rule`: subtle rule and marker color
- `--bg`: page background
- `--surface`: section surface background
- `--card-bg`: card and content container background
- `--border`: structural borders
- `--text-primary`: primary reading text
- `--text-secondary`: body and supporting text
- `--text-tertiary`: labels and metadata

Avoid:

- Pure `#000` or `#fff` on screen
- Navy/gold, neon-on-black, SaaS cream, or generic blue/cream palettes
- Decorative gradients
- Glassmorphism

## Typography

Display: Schibsted Grotesk  
Body: Source Sans 3  
Mono: JetBrains Mono

Typography rules:

- Use display type for names, section-defining headings, and major hierarchy.
- Use body type for navigation, buttons, labels, and content.
- Use mono only for technical metadata and URLs.
- Avoid monospace as a generic developer signal.
- Body copy should stay readable and calm, generally `1.55` to `1.75` line-height.
- Wrapped headings should use at least `1.3` line-height.
- Avoid all-caps for long content. Short labels only.

## Layout

The layout should feel spacious but not empty.

Rules:

- Hero is the primary brand moment.
- Sections should vary rhythm; avoid identical stacked sections.
- Cards are allowed for concrete content objects: project, experience, contact rows.
- Do not nest cards.
- Keep content width constrained and scannable.
- Mobile should preserve hierarchy, not merely stack desktop content.

## Components

### Navigation

- Fixed header.
- Transparent over hero, surfaced after scroll.
- Active in-page links use visual active state and `aria-current="location"`.
- Mobile menu must not leak during first paint.
- Theme toggle must expose `aria-pressed`.

### Buttons

- Primary buttons use the accent fill.
- Secondary buttons use transparent background and border.
- Buttons should have clear labels and at least 44px practical touch targets where used as controls.

### Project Card

- One featured project is enough.
- Screenshot is required; the work should be inspectable.
- Highlight chips are content, not decoration, so keep them readable.
- Avoid turning the project section into a generic multi-card portfolio grid unless there are multiple equally strong projects.

### Experience

- Homepage experience is progressive summary.
- Resume carries full detail.
- Most recent role gets the most substance.
- Dates should remain visible.

### Contact

- Contact is the conversion endpoint.
- Email must support both `mailto:` and copy-to-clipboard.
- Copy action must provide visible feedback and `aria-live` feedback.

### 404

- Error page should provide recovery paths, not just a dead end.
- Include home, resume, and email actions.

## Motion

Motion should be minimal and purposeful.

- No bounce or elastic easing.
- No layout-property animation.
- Respect `prefers-reduced-motion`.
- Header and menu transitions should be quick and quiet.

## Accessibility

Minimum bar: WCAG AA.

Rules:

- Visible focus states on all interactive elements.
- Touch targets should be at least 44px for mobile controls.
- Icon-only controls require clear `aria-label`.
- Visual state changes should have semantic equivalents where relevant.
- Clipboard and status actions should use `aria-live`.
- Dark mode must support system preference and manual override.
- No color-only meaning.

## Copy

Voice: direct, specific, professional.

Rules:

- No em dashes.
- Avoid vague portfolio filler.
- Prefer concrete engineering evidence over adjectives.
- CTAs should be clear and short.
- Contact copy should feel like an invitation, not a template.

## Anti-Patterns

Do not introduce:

- Gradient text
- Side-stripe accent borders
- Glass cards
- Hero metric blocks
- Generic identical icon-card grids
- Decorative blobs or orbs
- Excessive monospace
- Reflex portfolio tropes
- Overly flashy developer-site effects
