---
name: autolab-premiere
description: "Official bilingual (TH/EN) control skill for AutoLab CEP Extension (30 AutoLab UI & workflow tools) and Adobe Premiere Pro MCP (432 native timeline/project tools · v1.24.1). Use whenever the user asks to inspect Premiere Pro bins/movies, run Auto Highlights, load clips into Auto Frame Queue, assign .mogrt Frames & Promo banners per bin, tune frame scale/position ('🎯 จัดกรอบ') with AI Vision PNG verification, run AI Auto-Name (Variety mode), run Name Refiner ('✂️ ย่อชื่อที่ยาว' + '✅ Apply All'), edit 1-line/2-line headlines, press START to batch-build sequences, or edit Premiere Pro timelines."
---

# AutoLab & Adobe Premiere Pro Autonomous Control Skill (`autolab-premiere`)
# คู่มือมาตรฐานการควบคุม AutoLab (30 Tools) และ Adobe Premiere Pro (432 Tools) แบบไร้คนคุม 100%

สกิลนี้เป็นคู่มือปฏิบัติการหลักสำหรับเอเจนต์ AI ทุกค่าย (Claude, Cursor, Codex, Antigravity, Windsurf, DeepSeek Harness, OpenClaw) ในการควบคุม **AutoLab CEP Extension** ร่วมกับ **Adobe Premiere Pro** ผ่านสะพานเชื่อมคู่ขนานในเครื่อง (`AutoLab/js/core/mcp_bridge.js` ที่พอร์ต `17890` และ `%TEMP%\premiere-mcp-bridge`):

1. **`autolab` MCP (`30 Tools`)** — ควบคุมทุกหน้าจอ ทุกปุ่ม และทุกคิวงานของโปรแกรม AutoLab โดยตรง (`Auto Highlights`, `Auto Frame Queue`, `🎯 จัดกรอบ Live Frame Tuner`, `✨ AI Auto-Name`, `💬 Name Refiner ✂️ ย่อชื่อที่ยาว`, และ `START Batch`)
2. **`premiere-pro` MCP (`432 Tools · v1.24.1`)** — ควบคุม Adobe Premiere Pro เชิงลึก (สำรวจโปรเจกต์/Bin, จัดการ Sequence/Track, ตัดต่อคลิป, ปรับขนาด/ตำแหน่ง, ใส่เอฟเฟกต์/สี Lumetri, ปรับแต่งเสียง/คีย์เฟรม, มาร์กเกอร์/ซับไตเติล, แคปภาพหน้าจอ Program Monitor และส่งออกไฟล์ผ่าน Media Encoder)

---

## 🚨 1. กฎเหล็กห้ามฝ่าฝืน (Non-Negotiable Operational Rules)

1. **ห้ามใช้เครื่องมือดิบของ Premiere Pro สร้างงานแทนคิว AutoLab (Never Reinvent AutoLab Queue with Raw Premiere Tools):**
   - เมื่อผู้ใช้สั่งตัดไฮไลท์หนัง, นำคลิปเข้าคิวใส่กรอบ `.mogrt`, จัดกรอบ, ตั้งชื่อคลิป หรือสร้างซีเควนซ์คลิปสั้น **ต้องใช้เครื่องมือตระกูล `autolab_*` เสมอ** ห้ามไปเรียก `create_sequence` หรือ `import_mogrt` ของ `premiere-pro` มาต่อเองทีละอันเด็ดขาด
2. **ห้ามเปิด `AutoCut` สำหรับงานตัดไฮไลท์หนัง/ละคร/ซีรีส์เด็ดขาด (`autoCutState: 0`):**
   - `AutoCut` ใช้สำหรับงานตัดข่าวพูดคนเดียวเท่านั้น สำหรับงานหนัง/ละคร/รายการวาไรตี้ ต้องตั้ง `autoCutState: 0` ใน `autolab_af_configure_topbar` เสมอ
3. **โหมดตั้งชื่อ AI ต้องเป็น `🎭 Variety` (`mode: "variety"`) เสมอสำหรับงานบันเทิง:**
   - ห้ามใช้โหมด `📰 News` (`"news"`) กับงานหนัง/ละคร/ซีรีส์เด็ดขาด
4. **หลังกด `✨ AI Auto-Name` ต้องตามด้วย `💬 Name Refiner` ➔ `✂️ ย่อชื่อที่ยาว` ➔ `✅ Apply All` เสมอ:**
   - เรียก `autolab_af_run_name_refiner` เพื่อคัดกรองชื่อพาดหัวที่ยาวเกิน **17 ตัวอักษรไทย (`FILTER_CAP = 17`)** มาสั่งย่อให้กระชับไม่ล้นกรอบ `.mogrt`
5. **การกด `🎯 จัดกรอบ` (Live Frame Tuner) ต้องทำแยกตาม Bin และต้องเปิดดูภาพ PNG จริงด้วยสายตา AI (Closed-Loop Vision Verification):**
   - คลิปแต่ละเรื่องมีสัดส่วนภาพและขอบดำบน/ล่าง (Letterbox) ไม่เท่ากัน ห้ามเดาตัวเลข `scale` / `posY` ตาบอดเด็ดขาด ต้องรัน `autolab_af_tuner_auto_fit` แล้วเปิดดูไฟล์ภาพ `.png` (`previewImage.path`) ที่เรนเดอร์จริงจากหน้าจอ `_AutoLab_Preview_` ก่อนกด `autolab_af_tuner_apply` เสมอ
6. **พาดหัว 1 บรรทัด vs 2 บรรทัด (`+ เพิ่มบรรทัดที่ 2`):**
   - กรอบพาดหัว 1 บรรทัด: ส่งเฉพาะ `line1` (และ `line2: ""`)
   - กรอบพาดหัว 2 บรรทัด: ส่งทั้ง `line1` และ `line2` ผ่าน `autolab_af_set_clip_title` (บรรทัดละไม่เกิน 17 ตัวอักษรไทย)

---

## 🗂️ 2. สารบัญเครื่องมือ AutoLab MCP ทั้ง 30 คำสั่ง (Complete 30-Tool Quick Map)

> 📖 ดูตารางพารามิเตอร์ทุกฟิลด์และตัวอย่าง JSON ครบทั้ง 30 คำสั่งได้ที่: [`references/02-autolab-30-tools-reference.md`](references/02-autolab-30-tools-reference.md)

| หมวดหมู่ (Category) | ชื่อเครื่องมือ (Exact Tool Names) | หน้าที่หลัก (Primary Responsibility) |
| :--- | :--- | :--- |
| **A. System & Templates (6)** | `autolab_get_status`<br>`autolab_navigate`<br>`autolab_list_templates`<br>`autolab_sync_company_pack`<br>`autolab_manage_profiles`<br>`autolab_manage_transforms` | เช็คสถานะพาเนล, สลับหน้าจอ (`home`/`auto_frame`/`auto_highlights`), ดูรายชื่อกรอบ `.mogrt` & ป้ายโปรโมททั้งหมดในเครื่อง, ซิงค์ Company Pack จาก Cloud, และจัดการ Master Profile / Transform Preset |
| **B. Auto Highlights (6)** | `autolab_ah_queue_add`<br>`autolab_ah_queue_manage`<br>`autolab_ah_configure`<br>`autolab_ah_run`<br>`autolab_ah_status`<br>`autolab_ah_cancel` | ดึงไฟล์หนังจาก Bin เข้าคิวไฮไลท์, ตั้งค่าความยาวขั้นต่ำ/สูงสุด (`minDuration`/`maxDuration`), โหมด `hybrid`/`transcript`, `movie`/`podcast`, และสั่งสแกนตัดสร้าง Sub-Sequences อัตโนมัติ |
| **C. Auto Frame Queue (4)** | `autolab_af_queue_add`<br>`autolab_af_queue_inspect`<br>`autolab_af_set_bin_template`<br>`autolab_af_queue_manage` | ดึงคลิป/Sequence จาก Bin เข้าคิวแยกกลุ่มตาม Bin, ตรวจสอบคิวและความยาวชื่อไทย (> 17 ตัวอักษร), ผูกกรอบ `.mogrt` (`frame`) และป้ายโปรโมท (`promo`) แยกตาม `binKey` |
| **D. Live Frame Tuner `🎯 จัดกรอบ` (4)** | `autolab_af_tuner_start`<br>`autolab_af_tuner_auto_fit`<br>`autolab_af_tuner_adjust`<br>`autolab_af_tuner_apply` | สร้างซีเควนซ์ `_AutoLab_Preview_` ใน Premiere Pro, วัดขอบดำด้วย FFmpeg `cropdetect`, ปรับจูน `scale`/`posX`/`posY`, ส่งออกภาพ `.png` ให้ AI Vision ตรวจดู และบันทึกค่าเข้า Bin |
| **E. AI Naming & Refiner `✂️ ย่อชื่อ` (4)** | `autolab_af_configure_naming`<br>`autolab_af_run_autoname`<br>`autolab_af_run_name_refiner`<br>`autolab_af_set_clip_title` | ตั้งโหมด `variety`, กด `✨ AI Auto-Name` ถอดเสียง+คิดชื่อคลิปไวรัล, กด `💬 Name Refiner` ➔ `✂️ ย่อชื่อที่ยาว` (> 17 ตัวอักษร) ➔ `✅ Apply All`, และแก้ไขข้อความพาดหัว 1-2 บรรทัด |
| **F. Topbar & Batch `START` (4)** | `autolab_af_configure_topbar`<br>`autolab_af_start_queue`<br>`autolab_af_batch_status`<br>`autolab_af_cancel_queue` | ตั้งค่าความละเอียด `1080x1920`, เวลาป้ายโปรโมท (`promoStart`/`promoInterval`), ปิด `autoCutState: 0`, และกดปุ่ม `START` เพื่อสร้างซีเควนซ์จริงทั้งหมดในคิว |
| **G. Universal Escape Hatches (2)** | `autolab_call_js`<br>`autolab_call_jsx` | รันโค้ด JavaScript ในหน้าต่าง AutoLab CEP หรือรัน ExtendScript (`.jsx`) ใน Premiere Pro โดยตรงผ่านคิว Single-Flight |

---

## 🔄 3. ลำดับขั้นตอนมาตรฐาน 7 สเต็ป (7-Step End-to-End Autonomous SOP)

### Step 1: ตรวจสอบการเชื่อมต่อและสำรวจ Bin ในโปรเจกต์
1. เรียก `autolab_get_status({})` เพื่อเช็คสถานะพาเนล AutoLab และคิวปัจจุบัน
2. เรียก `get_project_info({})` หรือ `list_project_items({})` (จาก `premiere-pro` MCP) เพื่อดูชื่อโปรเจกต์และโฟลเดอร์ Bin ทั้งหมด

### Step 2: ตัดไฮไลท์อัตโนมัติ (Auto Highlights) *(ข้ามไป Step 3 ได้หากมีคลิป/Sequence ใน Bin พร้อมแล้ว)*
```json
// 1. ตั้งค่า Auto Highlights (Tool: autolab_ah_configure)
{
  "minDuration": 45,
  "maxDuration": 120,
  "targetCount": 10,
  "engineMode": "hybrid",
  "contentMode": "movie"
}

// 2. เพิ่มหนังจาก Bin เข้าคิว (Tool: autolab_ah_queue_add)
{ "binName": "ชื่อโฟลเดอร์หนัง" }

// 3. สั่งรันจนเสร็จ (Tool: autolab_ah_run)
{ "wait": true }
```

### Step 3: ดึงคลิปเข้า Auto Frame Queue และผูกกรอบ `.mogrt` + ป้ายโปรโมทแยกตาม Bin
1. ดูรายชื่อกรอบและป้ายโปรโมทในเครื่องด้วย `autolab_list_templates({})`
2. ดึงคลิปหรือ Sequence จาก Bin เข้าคิว:
   ```json
   // Tool: autolab_af_queue_add
   {
     "binNames": ["เป็นต่อ", "สุภาพบุรุษสุดซอย"],
     "clearFirst": true
   }
   ```
3. ผูกกรอบ `.mogrt` และป้ายโปรโมท `.mogrt` ให้แต่ละ Bin:
   ```json
   // Tool: autolab_af_set_bin_template
   {
     "binKey": "เป็นต่อ",
     "frame": "ชื่อกรอบ.mogrt",
     "promo": "ชื่อป้ายโปรโมท.mogrt"
   }
   ```

### Step 4: กด `🎯 จัดกรอบ` (Live Frame Tuner) + ตรวจสอบภาพจริงด้วย AI Vision
สำหรับ **แต่ละ Bin** ในคิว:
1. สั่งวัดขอบดำด้วย `cropdetect` และสร้างภาพตัวอย่างจริงจาก Premiere Pro:
   ```json
   // Tool: autolab_af_tuner_auto_fit
   {
     "binKey": "เป็นต่อ",
     "targetWindowWidth": 1080
   }
   ```
2. **เปิดดูไฟล์ภาพ PNG ที่ได้จาก `previewImage.path` ด้วยเครื่องมืออ่านไฟล์ภาพของ AI:**
   - ตรวจดูว่าภาพวิดีโอขยายเต็มช่องกรอบโดยไม่มีขอบดำโผล่บน/ล่าง และศีรษะตัวละครไม่ถูกกรอบพาดหัวบัง
3. หากต้องปรับเพิ่ม/ลด `scale` หรือขยับขึ้น/ลง `posY` ให้เรียก `autolab_af_tuner_adjust({ "scale": 148, "posX": 540, "posY": 985 })` แล้วตรวจภาพ PNG ใหม่อีกครั้ง
4. เมื่อพอดีเป๊ะแล้ว กดยืนยันค่าเข้า Bin (ระบบจะลบ `_AutoLab_Preview_` ให้อัตโนมัติ):
   ```json
   // Tool: autolab_af_tuner_apply
   { "binKey": "เป็นต่อ" }
   ```

### Step 5: กด `✨ AI Auto-Name` (โหมด `🎭 Variety`)
```json
// Tool: autolab_af_run_autoname
{
  "mode": "variety",
  "autoApply": true
}
```

### Step 6: กด `💬 Name Refiner` ➔ `✂️ ย่อชื่อที่ยาว` ➔ `✅ Apply All`
```json
// Tool: autolab_af_run_name_refiner
{
  "instruction": "ย่อชื่อที่ยาวเกินให้สั้น",
  "autoApply": true,
  "closeModal": true
}
```
- หากต้องการแก้พาดหัวรายคลิปเป็น **1 บรรทัด** หรือ **2 บรรทัด (`+ เพิ่มบรรทัดที่ 2`)** ให้ใช้ `autolab_af_set_clip_title`:
  ```json
  // Tool: autolab_af_set_clip_title
  {
    "index": 0,
    "line1": "นึกว่าหมูในอวย",
    "line2": "ที่ไหนได้โคตรเทพ"
  }
  ```

### Step 7: ตั้งค่า Topbar และกดปุ่ม `START` สร้างซีเควนซ์ทั้งหมด
```json
// 1. ตั้งค่า Topbar (Tool: autolab_af_configure_topbar)
{
  "resMode": "custom",
  "width": 1080,
  "height": 1920,
  "promoStart": 20,
  "promoInterval": 20,
  "injectHeadline": true,
  "autoCutState": 0
}

// 2. กดปุ่ม START รันคิวจนเสร็จ (Tool: autolab_af_start_queue)
{
  "wait": true,
  "autoDismissModal": true
}
```

---

## 📚 4. คู่มืออ้างอิงเชิงลึกแยกตามโมดูล (Modular Reference Guides)

เมื่อต้องการดูรายละเอียดพารามิเตอร์ของเครื่องมือเฉพาะส่วน ให้เปิดอ่านไฟล์ในโฟลเดอร์ `references/` ตามรายการนี้:

1. **[`references/01-connection-and-bridge.md`](references/01-connection-and-bridge.md)** — สถาปัตยกรรม Dual Bridge (`http://127.0.0.1:17890` & `%TEMP%\premiere-mcp-bridge`), การรันผ่าน CLI โดยตรง (`--status`, `--list-tools`, `--call`), และตารางแก้ปัญหา
2. **[`references/02-autolab-30-tools-reference.md`](references/02-autolab-30-tools-reference.md)** — **คู่มืออ้างอิงครบทั้ง 30 Tools ของ `autolab` MCP** พร้อมตารางพารามิเตอร์ทุกฟิลด์และตัวอย่าง JSON
3. **[`references/03-auto-frame-and-vision-sop.md`](references/03-auto-frame-and-vision-sop.md)** — คู่มือปฏิบัติการเชิงลึกของ Auto Frame Queue, การจัดกรอบด้วย AI Vision (`🎯 จัดกรอบ`), และการตั้ง/ย่อชื่อคลิปไวรัล
4. **[`references/04-auto-highlights-and-jumpcut-sop.md`](references/04-auto-highlights-and-jumpcut-sop.md)** — คู่มือปฏิบัติการเชิงลึกของ Auto Highlights และ Auto Jump Cut
5. **[`references/05-premiere-pro-432-tools-catalog.md`](references/05-premiere-pro-432-tools-catalog.md)** — **สารบัญและแคตตาล็อกครบทั้ง 432 Tools ของ `premiere-pro` MCP (`v1.24.1`)** แยกตาม 8 หมวดหมู่พร้อมพารามิเตอร์ทุกตัว
