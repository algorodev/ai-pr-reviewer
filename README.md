# AI PR Reviewer
Low-noise AI code review for PRs. GitHub App + CLI. JS/TS & Python first.

## Quickstart

`pnpm install`

`pnpm build`

## Packages
- @aipr/core — types, config
- @aipr/diff — diff parsing + chunking
- @aipr/providers — LLM provider abstraction
- apps/github-app — webhook server
- apps/cli — local review
