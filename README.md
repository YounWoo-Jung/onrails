# onrails

A CLI that orchestrates Rails development simply and quickly.

**Philosophy: Convention over Configuration** - It auto-detects Rails projects and runs without complex setup.

## Installation

```bash
bun install
```

Global install:

```bash
bun link
```

## Default adapter: opencode

onrails uses the [opencode](https://github.com/nicepkg/opencode) CLI for LLM calls.
You do not need to set API keys or billing in onrails - opencode handles it.

```bash
curl -fsSL https://opencode.ai/install | bash
```

## Usage

### List roles

```bash
onrails roles
```

### List workflows

```bash
onrails workflows
```

### Run a workflow

```bash
onrails run feature "Add avatar upload to user profiles"
```

```bash
onrails run refine "Fix N+1 queries with eager loading"
```

```bash
onrails run recover "Fix missing email after payment"
```

## Workflows

| Workflow | Pipeline | Purpose |
|----------|----------|---------|
| `feature` | Orion -> Lyra -> Libra | New feature development |
| `refine`  | Orion -> Lyra -> Libra | Improve existing code |
| `recover` | Phoenix -> Lyra -> Libra | Bugfix/incident recovery |

## Roles

| Role | Responsibility |
|------|----------------|
| **Orion** | Design/plan (no code) |
| **Lyra** | Implement/code (follow the plan) |
| **Libra** | Review/quality gate (BLOCKING/ADVISORY) |
| **Phoenix** | Debug/recovery (repro -> cause -> minimal fix -> prevent regression) |

Korean guide: [README.ko.md](README.ko.md)
