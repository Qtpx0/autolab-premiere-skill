## Premiere Pro + AutoLab Tool Routing (MANDATORY)

เมื่อผู้ใช้สั่งงานเกี่ยวกับ Premiere Pro (เช็คสต็อก, ดู bin, ตัดไฮไลท์, ใส่กรอบ, export):

1. **อ่าน SKILL.md ของ `autolab-premiere-automation` (หรือสกิลประจำตัวผู้ใช้) ก่อนทำอะไรทั้งสิ้น**
2. **ห้ามใช้ premiere-pro MCP tools (`get_bin_contents`, `list_project_items`, `search_project_items`, `get_full_project_overview`) สำหรับเช็คสต็อกหรือดู bin เด็ดขาด** — ใช้ `autolab_pr_inspect` เท่านั้น (เร็วกว่า 100 เท่า, output ไม่ล้น)
3. **ห้ามอ่าน `output.txt` ที่ค้างอยู่จากเซสชันเก่า** — มันเป็นขยะ ไม่ใช่ข้อมูลปัจจุบัน
