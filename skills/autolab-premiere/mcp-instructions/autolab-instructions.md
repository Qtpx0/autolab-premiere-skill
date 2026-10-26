# AutoLab MCP — Mandatory Instructions
# Copy this file to: <your antigravity MCP dir>/autolab/instructions.md
# e.g. C:\Users\<you>\.gemini\antigravity\mcp\autolab\instructions.md

## BEFORE ANY AUTOLAB OPERATION
- **For Stock Check (`เช็คสต็อก`):** Do NOT waste turns reading `SKILL.md` first — call `autolab_pr_inspect` (`{ diskRoot, categoryBin, excludeDirs: "จบแล้ว,ลงแล้ว", lowStockThreshold: 25, scanPremiere: true }`) in **1 single call** and render the Markdown Stock Dashboard Table immediately!
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
