# Vince Congini Site Agent Standards
> Repo-local implementation rules. Durable context lives in the Obsidian LLM Wiki.

## Knowledge Base Split

- **Vault root:** `/Users/vincentcongini/obsidian/vince-obsidian-vault/vince-obsidian-vault`
- **Project slug:** `vince-congini-site`
- **Project index:** `/Users/vincentcongini/obsidian/vince-obsidian-vault/vince-obsidian-vault/wiki/projects/vince-congini-site/index.md`
- **Pipeline manifest:** `/Users/vincentcongini/obsidian/vince-obsidian-vault/vince-obsidian-vault/wiki/projects/vince-congini-site/pipeline-manifest.md`
- **Agent handoff:** `/Users/vincentcongini/obsidian/vince-obsidian-vault/vince-obsidian-vault/wiki/projects/vince-congini-site/synthesis/Agent Handoff Summary.md`
- **Context routing:** `/Users/vincentcongini/obsidian/vince-obsidian-vault/vince-obsidian-vault/wiki/guidelines/Agent Context Routing.md`

**First-load list for implementation tasks:**
1. This file (AGENTS.md)
2. Agent Handoff Summary (above)
3. Agent Context Routing (above) — then load only matched guidelines

This file is authoritative for repo-local implementation details. If the wiki and this file disagree about implementation, follow this file and current code, then update the wiki.

## Project Context

- Static personal portfolio and resume site for Vincent Congini.
- Stack: semantic HTML, Sass/CSS custom properties, minimal vanilla JavaScript.
- Source files live under `src/`.
- `dist/` is generated deploy output; do not edit it directly unless the task explicitly targets deployment artifacts.
- Existing project docs: `README.md`, `PRODUCT.md`, `DESIGN.md`.

## Protected Areas

- `dist/` — generated deploy output. Do not edit unless task explicitly targets deployment artifacts.

## Commands

- **Install:** `npm install`
- **Dev server:** `npm run dev` (Sass watcher plus local server on port 3000)
- **Full build:** `npm run build`
- **Cloudflare build (no PDF):** `npm run build:cloudflare`
- **Resume PDF only:** `npm run resume:pdf`
- **Deploy:** `npm run deploy`

Full build and deploy may require Chrome or Chromium for resume PDF generation. Use `CHROME_PATH` for non-standard Chrome installs and `CHROME_NO_SANDBOX=1` only when a restricted environment requires it.

## Design Constraints

- Preserve quiet technical credibility: restrained, precise, professional, content-led.
- Follow `DESIGN.md` and the project wiki design summary before visual changes.
- Avoid decorative gradients, glassmorphism, neon developer styling, generic template layouts, excessive monospace, and decorative blobs/orbs.
- Maintain WCAG AA intent, visible focus states, semantic HTML, dark mode, and reduced-motion behavior.

## Workflow

- Prefer small direct edits in `src/`.
- Do not introduce a frontend framework or large dependency unless explicitly requested.
- Verify with the narrowest useful command, usually `npm run build` for production-facing changes.
