# Premiere Pro MCP — AutoLab Routing Patch
# Append this block to the TOP of your existing premiere-pro instructions.md
# Location: <your antigravity MCP dir>/premiere-pro/instructions.md
# e.g. C:\Users\<you>\.gemini\antigravity\mcp\premiere-pro\instructions.md

# Add this line after the first sentence ("Control Adobe Premiere Pro through the tools registered in this MCP session."):
#
# > **IMPORTANT:** If `autolab` MCP tools are also available, use `autolab_pr_inspect`
# > for bin inspection and stock checking instead of `get_bin_contents` /
# > `list_project_items` / `search_project_items`. AutoLab tools return compact
# > summaries; premiere-pro tools return raw JSON that often overflows output limits.
# > Read the `autolab-premiere-automation` SKILL.md before starting any production workflow.
