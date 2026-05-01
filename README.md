# Vincent Congini — Personal Portfolio

Static personal portfolio site for Vincent Congini, Senior Front End Tech Lead specializing in TypeScript, React, AI product engineering, and SaaS systems.

Built with semantic HTML, Sass, and minimal vanilla JavaScript. No frameworks, no build complexity beyond Sass compilation.

## Pages

- **/** — Homepage with hero, featured project, experience summary, capabilities, and contact
- **/resume.html** — Full HTML resume with all experience, skills, education, and a downloadable PDF

## Quick start

```bash
npm install
npm run dev
```

This starts a Sass watcher and local server at `http://localhost:3000`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Watch Sass + serve locally on port 3000 |
| `npm run sass:build` | One-time Sass compilation (compressed) |
| `npm run sass:watch` | Watch Sass for changes |

## Project structure

```
src/
  index.html                          Homepage
  resume.html                         HTML resume page
  assets/
    styles/
      main.scss                       Primary stylesheet (design tokens, layout, components)
      _resume.scss                    Resume page styles, print styles
    scripts/
      main.js                         Nav toggle, scroll detection, active section highlighting
    files/
      vincent-congini-resume.pdf      Downloadable resume PDF
package.json                          Sass + concurrently dev dependencies
```

## Design system

Styling follows the brand design document (`vince-congini-site-brand-design.pdf`) with these specifications:

- **Typography** — Syne (display/headings), DM Sans (body), DM Mono (labels/nav/tags) via Google Fonts
- **Colors** — Slate-blue accent palette (`#2A3A8C`) on warm neutral backgrounds (`#F8F6F2`), with full dark mode support via `prefers-color-scheme`
- **Spacing** — 6 / 12 / 24 / 48 / 80 / 128px scale as CSS custom properties
- **Layout** — 1100px max-width, `clamp()`-based responsive padding, two-column grid where appropriate

## Features

- Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Accessible: skip link, visible focus states, ARIA attributes, keyboard navigable, sufficient color contrast
- Responsive: mobile nav with hamburger toggle, single-column stacking on small screens
- Dark mode via CSS custom properties and `prefers-color-scheme`
- `prefers-reduced-motion` respected (disables animations and smooth scroll)
- Print-friendly resume page (hides chrome, tightens layout, letter-size `@page`)
- Sticky nav with backdrop blur, scroll-aware transparency on the homepage hero
- Active section highlighting via Intersection Observer
- Inline SVG icons (no icon library dependencies)
- SVG data-URI favicon

## Deployment

The `src/` directory is the deploy root. Any static host works:

- **Netlify / Vercel / Cloudflare Pages** — set build command to `npm run sass:build` and publish directory to `src`
- **GitHub Pages** — push `src/` contents to the deploy branch
- **Manual** — run `npm run sass:build` then upload `src/` to any web server

## Customization checklist

- [ ] Add `og:image` meta tag with a social preview image
- [ ] Add `<link rel="canonical">` once the production domain is set
- [ ] Replace the inline SVG favicon with a proper `.ico` / `.png` if desired
- [ ] Add analytics (Umami, Plausible, etc.) before deploying
- [ ] Update the copyright year in the footer if needed

## Tech stack

- HTML
- Sass / CSS custom properties
- Vanilla JavaScript
- Google Fonts (Syne, DM Sans, DM Mono)
