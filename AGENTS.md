# Agent Standards

Read `.claude/CLAUDE.md` for full project context, commands, code style, and wiki pointers.

This file exists so Codex and other agents that read root `AGENTS.md` get the bootstrap chain.

## Quick Reference

- **Wiki vault:** `/Users/vincentcongini/obsidian/vince-obsidian-vault/vince-obsidian-vault`
- **Pipeline manifest:** `wiki/projects/vince-congini-site/pipeline-manifest.md` (in vault)
- **Context routing:** `wiki/guidelines/Agent Context Routing.md` (in vault)
- **TDD default:** false
- **Protected areas:** `dist/` (generated deploy output)

## First-Load List

1. `.claude/CLAUDE.md` (repo-local implementation rules)
2. Vault: `wiki/projects/vince-congini-site/synthesis/Agent Handoff Summary.md`
3. Vault: `wiki/projects/vince-congini-site/pipeline-manifest.md`
4. Vault: `wiki/guidelines/Agent Context Routing.md` — then load only matched guidelines
