# GEMINI.md — Workspace Rule Template for AutoLab + Premiere Pro
# Copy this ENTIRE content into a file called `GEMINI.md` at the ROOT of your production workspace.
# e.g. G:\Dev\my-premiere-workspace\GEMINI.md
# This file is always-on and loaded every session automatically.

## Premiere Pro + AutoLab Tool Routing (MANDATORY)

เมื่อผู้ใช้สั่งงานเกี่ยวกับ Premiere Pro (เช็คสต็อก, ดู bin, ตัดไฮไลท์, ใส่กรอบ, export):

1. **อ่าน SKILL.md ของ `autolab-premiere-automation` (หรือสกิลประจำตัวผู้ใช้) ก่อนทำอะไรทั้งสิ้น**
2. **ห้ามใช้ premiere-pro MCP tools (`get_bin_contents`, `list_project_items`, `search_project_items`, `get_full_project_overview`) สำหรับเช็คสต็อกหรือดู bin เด็ดขาด** — ใช้ `autolab_pr_inspect` เท่านั้น (เร็วกว่า 100 เท่า, output ไม่ล้น)
3. **ห้ามอ่าน `output.txt` ที่ค้างอยู่จากเซสชันเก่า** — มันเป็นขยะ ไม่ใช่ข้อมูลปัจจุบัน
4. **เมื่อมีคำสั่งให้ตัด (เช่น 'ตัดให้เลย', 'ตัดเพิ่ม', 'ถ้ามีก็ตัดให้'):** ถ้าพบว่ามี `HIGHLIGHTS_` เก่า หรือ `pr_inspect` ติดป้าย `needsRecovery: true` (มีฟุตเทจใน `ไฟล์ต้นฉบับ`) — **ห้ามนำ Sequence เก่ามาส่ง Export เด็ดขาด 100%** ต้องรัน `pr_prepare_ep` เพื่อดึงฟุตเทจออกมาและล้างของเก่าทิ้ง แล้วเริ่มตัดใหม่สดๆ ตั้งแต่ Auto Highlights เสมอ!
5. **Live Step-by-Step Reporting (รายงานความคืบหน้าระหว่างทาง):** ในกระบวนการทำงานที่มีขั้นตอนยาวๆ ให้ AI พิมพ์ข้อความสั้นๆ 1 บรรทัดอัปเดตสถานะบนหน้าแชทบอกผู้ใช้ก่อนเริ่มแต่ละขั้นตอนเสมอ (เช่น ก่อนเริ่มกู้ฟุตเทจ, ก่อนเริ่มรัน Auto Highlights, ก่อนเริ่มจัดกรอบ Auto Frame, ก่อนส่ง Export AME) ห้ามปล่อยให้หน้าจอเงียบหายไปเฉยๆ!
