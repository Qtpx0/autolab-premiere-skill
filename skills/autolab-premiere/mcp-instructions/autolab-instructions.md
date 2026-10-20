# AutoLab MCP — Mandatory Instructions
# Copy this file to: <your antigravity MCP dir>/autolab/instructions.md
# e.g. C:\Users\<you>\.gemini\antigravity\mcp\autolab\instructions.md

## BEFORE ANY AUTOLAB OPERATION
Read the `autolab-premiere-automation` SKILL.md (or your personal workflow skill) first. It contains the exact workflow, tool order, and parameter rules. Never guess or improvise.

## TOOL ROUTING (CRITICAL)
- **Stock check / Bin inspection:** ALWAYS use `autolab_pr_inspect`. NEVER use premiere-pro MCP tools (`get_bin_contents`, `list_project_items`, `search_project_items`) for this — they return massive JSON that overflows output.
- **Auto Frame pipeline:** ALWAYS use `autolab_af_pipeline` (one command does everything). NEVER call `af_queue_add` → `af_set_bin_template` → `af_start_queue` separately unless the user explicitly asks to break it up.
- **Framing:** Use `autoFit: true` for movies/series (Auto-Scale). Use Master Profile (`profileName`) only for TV shows that have one set up.

## SPEED RULES
- One tool call should accomplish the task. If you're making more than 3 AutoLab calls for a single user request, you're doing it wrong.
- Never write `node -e` scripts. Use native MCP tools or CLI with the installed path.
