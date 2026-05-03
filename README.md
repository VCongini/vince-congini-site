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

`npm run build` and `npm run deploy` require Chrome or Chromium so the resume page can be printed to PDF. Set `CHROME_PATH` if Chrome is installed in a non-standard location. In restricted containers that require Chrome's sandbox to be disabled, set `CHROME_NO_SANDBOX=1` explicitly.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Watch Sass + serve locally on port 3000 |
| `npm run build` | Compile Sass, regenerate the downloadable resume PDF, and prepare `dist/` with fingerprinted assets |
| `npm run sass:build` | One-time Sass compilation (compressed) |
| `npm run sass:watch` | Watch Sass for changes |
| `npm run resume:pdf` | Regenerate `src/assets/files/vincent-congini-resume.pdf` from `src/resume.html` |
| `npm run dist:prepare` | Copy `src/` to `dist/`, fingerprint CSS/JS, and rewrite built HTML references |

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
      vincent-congini-resume.pdf      Generated downloadable resume PDF (ignored by git)
dist/                                 Generated deploy output with hashed CSS/JS
package.json                          Sass + concurrently dev dependencies
```

## Design system

Styling follows the brand design document (`vince-congini-site-brand-design.pdf`) with these specifications:

- **Typography** — Schibsted Grotesk (display/headings), Source Sans 3 (body), JetBrains Mono (technical metadata only) via Google Fonts
- **Colors** — OKLCH cobalt-indigo accent tokens on subtly tinted neutral backgrounds, with manual and system dark mode support
- **Spacing** — 6 / 12 / 24 / 48 / 80 / 128px scale as CSS custom properties
- **Layout** — 1100px max-width, `clamp()`-based responsive padding, two-column grid where appropriate

## Features

- Semantic HTML (`header`, `nav`, `main`, `section`, `article`, `footer`)
- Accessible: skip link, visible focus states, ARIA attributes, keyboard navigable, sufficient color contrast
- Responsive: mobile nav with hamburger toggle, single-column stacking on small screens
- Dark mode via CSS custom properties and `prefers-color-scheme`
- `prefers-reduced-motion` respected (disables animations and smooth scroll)
- Print-friendly resume page (hides chrome, tightens layout, letter-size `@page`)
- Downloadable resume PDF generated from the live resume page during `npm run build` / `npm run deploy`
- Sticky nav with backdrop blur, scroll-aware transparency on the homepage hero
- Active section highlighting via Intersection Observer
- SEO metadata for `vincecongini.com` with canonical URLs, social previews, structured data, `robots.txt`, and `sitemap.xml`
- Umami analytics script configured for `vincecongini.com`, with a deploy header policy that allows Umami and Cloudflare Web Analytics scripts and event endpoints
- Fingerprinted production CSS and JavaScript generated into `dist/` for safe long-lived caching
- Inline SVG icons (no icon library dependencies)
- SVG data-URI favicon with PNG fallback

## Deployment

The `dist/` directory is the deploy root after running `npm run build`. Any static host works:

- **Netlify / Vercel / Cloudflare Pages** — set build command to `npm run build` and publish directory to `dist`
- **GitHub Pages** — push the built `dist/` contents to the deploy branch and configure the custom domain in repository settings.
- **Manual** — run `npm run build` then upload `dist/` to any web server

## Customization checklist

- [ ] Add `og:image` meta tag with a social preview image
- [ ] Update canonical URLs, `robots.txt`, and `sitemap.xml` if changing the production domain
- [ ] Replace the inline SVG favicon and PNG fallback with a full favicon set if desired
- [ ] Use a dedicated Umami website ID for this portfolio if it should be tracked separately from other projects

## Tech stack

- HTML
- Sass / CSS custom properties
- Vanilla JavaScript
- Google Fonts (Syne, DM Sans, DM Mono)
