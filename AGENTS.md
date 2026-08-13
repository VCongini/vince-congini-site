# Agent Standards

Read `.claude/CLAUDE.md` for full project context, commands, code style, and wiki pointers. Agents without Claude Code tooling should read it as a plain Markdown file; nothing in it is harness-specific.

This file exists so Codex and other agents that read root `AGENTS.md` get the bootstrap chain.

## Quick Reference

- **Wiki vault:** `/Users/vincentcongini/obsidian/vince-obsidian-vault/vince-obsidian-vault`
- **Pipeline manifest:** `wiki/projects/vince-congini-site/pipeline-manifest.md` (in vault)
- **Routing skill:** `wiki/skills/wiki-context-routing/SKILL.md` (in vault) — route first, load second
- **Context routing:** `wiki/guidelines/Agent Context Routing.md` (in vault) — standards/skill matching, read only after routing
- **TDD default:** false
- **Protected areas:** `dist/` (generated deploy output)

## First-Load List

1. `.claude/CLAUDE.md` (repo-local implementation rules)
2. Vault: `wiki/projects/vince-congini-site/synthesis/Agent Handoff Summary.md`
3. Vault: `wiki/projects/vince-congini-site/pipeline-manifest.md`
4. Vault: `wiki/skills/wiki-context-routing/SKILL.md` — route the task class first
5. Vault: `wiki/guidelines/Agent Context Routing.md` — then load only matched guidelines
