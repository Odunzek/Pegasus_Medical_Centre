#!/usr/bin/env sh
# Copies the Claude Code and GitHub configuration into place. Run once from the repository root:
#   sh setup/install.sh
set -e
mkdir -p .claude/skills .claude/agents .github/workflows
cp setup/claude/settings.json .claude/settings.json
cp -r setup/claude/skills/new-page .claude/skills/
cp setup/claude/agents/*.md .claude/agents/
cp setup/github/workflows/ci.yml .github/workflows/ci.yml
echo "Installed: .claude/settings.json, .claude/skills/new-page, .claude/agents/*, .github/workflows/ci.yml"
