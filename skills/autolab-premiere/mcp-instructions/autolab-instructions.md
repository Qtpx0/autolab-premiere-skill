# AutoLab MCP — Mandatory Instructions
# Copy this file to: <your antigravity MCP dir>/autolab/instructions.md
# e.g. C:\Users\<you>\.gemini\antigravity\mcp\autolab\instructions.md

## BEFORE ANY AUTOLAB OPERATION (Current Rule Version: `1.8.2`)
- **Automatic Personal Skill & `GEMINI.md` Version Check:** Check if the workspace `GEMINI.md` has `<!-- autolab-rule-version: 1.8.2 -->`.
  - **If it matches `1.8.2` (Normal Fast-Path):** Do NOT read `SKILL.md` for stock checks — immediately run `autolab_pr_inspect` using the user's paths in `GEMINI.md` Rule 1 in **1 single call** and render the Markdown Stock Dashboard Table!
  - **If `<!-- autolab-rule-version: 1.8.2 -->` is missing or older (Existing User Auto-Upgrade):** Read the user's personal workflow `SKILL.md` (for their `diskRoot`, `categoryBin`, `excludeDirs`, `stagingBin`) and `autolab-premiere/mcp-instructions/gemini-md-template.md` + `references/06-personal-workflow-skill-builder-guide.md` (Section 4), then use `edit_file` to non-destructively upgrade their `GEMINI.md` (substituting their real paths into Rule 1 & Rule 10 and adding `<!-- autolab-rule-version: 1.8.2 -->`) and their personal `SKILL.md` Engine rules without deleting any personal paths or promo mappings!
- **For Cutting / Framing / Exporting:** Read your personal workflow `SKILL.md` (e.g. `autolab-premiere-automation`) first. Never guess or improvise.

## TOOL ROUTING (CRITICAL)
- **One-Call Stock check / Bin inspection (< 1s):** ALWAYS use `autolab_pr_inspect` (1 call). NEVER use premiere-pro MCP tools (`get_bin_contents`, `list_project_items`, `search_project_items`), NEVER call `autolab_pr_bin_tree` on root/category bins during stock checks (overflows into `output.txt`), and NEVER run PowerShell `Get-ChildItem` to recount disk folders!
- **Auto Frame pipeline:** ALWAYS use `autolab_af_pipeline` (one command does everything). NEVER call `af_queue_add` → `af_set_bin_template` → `af_start_queue` separately unless the user explicitly asks to break it up.
- **Framing:** Use `autoFit: true` by default for both movies/series (with `frame` + `promo`) and TV shows (with `profileName` Master Profile) unless the user explicitly asks to lock scale (`autoFit: false`).

## AME EXPORT & STOCK INSPECTION (v1.8.2)
- **AME Auto-Render:** `autolab_pr_export_ame` automatically executes `startQueue: true` (zero-delay auto-render in AME via `app.encoder.startBatch()`). Never tell user to click start queue manually or wait for countdown.
- **Smart Stock Inspection:** `autolab_pr_inspect` returns `diskFolders` for all shows on disk and automatically inspects Premiere Pro for `lowStockShows` (`lowStockThreshold: 25, scanPremiere: true`) in `< 0.1s`. Never report shows with abundant stock (> 25 clips) in `readyToCut` unless explicitly queried.

## SPEED RULES
- One tool call should accomplish the task. If you're making more than 3 AutoLab calls for a single user request, you're doing it wrong.
- Never write `node -e` scripts. Use native MCP tools or CLI with the installed path.
