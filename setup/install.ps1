# Windows PowerShell version. Run once from the repository root:  .\setup\install.ps1
New-Item -ItemType Directory -Force -Path .claude\skills, .claude\agents, .github\workflows | Out-Null
Copy-Item setup\claude\settings.json .claude\settings.json -Force
Copy-Item setup\claude\skills\new-page .claude\skills\ -Recurse -Force
Copy-Item setup\claude\agents\*.md .claude\agents\ -Force
Copy-Item setup\github\workflows\ci.yml .github\workflows\ci.yml -Force
Write-Host "Installed: .claude/settings.json, .claude/skills/new-page, .claude/agents/*, .github/workflows/ci.yml"
