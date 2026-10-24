# 04 — Auto Highlights Engine & Jump Cut Operational Guide
# คู่มือปฏิบัติการเชิงลึก: ระบบตัดไฮไลท์อัตโนมัติ (Auto Highlights) และการตัดช่องว่างเสียงเงียบ (Jump Cut)

เอกสารนี้อธิบายขั้นตอนการควบคุมโมดูล **Auto Highlights** (สำหรับสแกนไฟล์หนังหรือรายการยาวเพื่อคัดแยกซีนเด็ดออกมาเป็น Sub-Sequences อัตโนมัติ) และการควบคุมโมดูล **Auto Jump Cut**

---

## 1. โมดูล Auto Highlights (`view: "auto_highlights"`)

### 1.1 ขั้นตอนการทำงานมาตรฐาน (Standard Workflow)
1. **สลับหน้าจอไปที่ Auto Highlights (ถ้าต้องการให้แสดงผลบนจอ):**
   ```json
   // Tool: autolab_navigate
   { "view": "auto_highlights" }
   ```
2. **ตั้งค่าพารามิเตอร์การตัดไฮไลท์ (`autolab_ah_configure`):**
   - **ใช้พรีเซ็ตลัดตามประเภทงาน (`preset`):**
     - `"movie"` *(สำหรับภาพยนตร์ / ละคร / ซีรีส์)*: ตั้งค่า `engineMode: "gemini_audio"` (`Cloud AI Direct Audio`), `targetCount: 100`, `duration: "0.5-1.5"` (`60-90s`), `resolution: "1920x1080"`, และเปิด **Speed Assist (`1.15×`, `tone -2`, `cents 3`, `maintainPitch: true`)** อัตโนมัติ
     - `"show"` *(สำหรับรายการทีวี / ซิตคอม / วาไรตี้ / พอดแคสต์)*: ตั้งค่า `engineMode: "gemini_audio"`, `targetCount: 100`, `duration: "0.5-1.5"` (`60-90s`), `resolution: "1920x1080"`, และ **ปิด Speed Assist (`enableSpeed: false`)** อัตโนมัติ
   - **กฎเหล็ก:** ต้องใช้ `engineMode: "gemini_audio"` (`⚡ Cloud AI Direct Audio`) เสมอ — ห้ามใช้ `whisper`, `hybrid`, หรือ `transcript` เด็ดขาด!
   ```json
   // Tool: autolab_ah_configure
   // สำหรับงานหนัง/ซีรีส์:
   {
     "preset": "movie"
   }

   // สำหรับงานรายการทีวี:
   {
     "preset": "show"
   }
   ```
3. **ดึงไฟล์หนังต้นฉบับจาก Bin เข้าคิว Auto Highlights (`autolab_ah_queue_add`):**
   ```json
   // Tool: autolab_ah_queue_add
   {
     "binName": "หนังต้นฉบับ"
   }
   ```
   - สามารถตรวจสอบรายการที่อยู่ในคิวได้ด้วย `autolab_ah_queue_manage({ "action": "inspect" })`
4. **สั่งรันสแกนและสร้าง Sub-Sequences ไฮไลท์ (`autolab_ah_run`):**
   ```json
   // Tool: autolab_ah_run
   {
     "wait": true
   }
   ```
   - หากตั้ง `"wait": false` เพื่อรันแบบพื้นหลัง สามารถเช็คความคืบหน้าได้ด้วย `autolab_ah_status({})` และสั่งยกเลิกได้ด้วย `autolab_ah_cancel({})`

### 1.2 การส่งต่อ Sub-Sequences จาก Auto Highlights เข้าสู่ Auto Frame Queue
เมื่อ `autolab_ah_run` ทำงานเสร็จ ระบบจะสร้างโฟลเดอร์ Bin ที่บรรจุ Sub-Sequences ไฮไลท์ไว้ใน Premiere Pro Project Panel ให้ทันที จากนั้นเอเจนต์สามารถดึง Sub-Sequences เหล่านั้นเข้าสู่ **Auto Frame Queue** เพื่อใส่กรอบ `.mogrt` ต่อได้ทันทีด้วยคำสั่ง:
```json
// Tool: autolab_af_queue_add
{
  "binName": "ชื่อโฟลเดอร์ไฮไลท์ที่สร้างเสร็จ",
  "onlySequences": true,
  "clearFirst": true
}
```

---

## 2. การควบคุมโมดูล Auto Jump Cut และ AI Captions ผ่าน `autolab_call_js`

สำหรับฟีเจอร์ตัดช่องว่างเสียงเงียบ (**Auto Jump Cut**) สำหรับงานข่าวหรือคลิปพูดคนเดียว เอเจนต์สามารถควบคุมผ่าน `autolab_call_js` หรือตั้งค่า `autoCutState` ใน Auto Frame Topbar ได้ดังนี้:

1. **กรณีต้องการเปิด AutoCut อัตโนมัติพร้อมกับการรันคิว Auto Frame (เฉพาะงานตัดข่าวเท่านั้น):**
   - ตั้งค่า `autoCutState: 1` (หรือ `2`) ใน `autolab_af_configure_topbar`
   - **หมายเหตุสำคัญ:** สำหรับงานตัดไฮไลท์หนัง/ละคร/รายการวาไรตี้ **ห้ามเปิด `autoCutState` เด็ดขาด (ต้องตั้ง `autoCutState: 0` เสมอ)** เพราะจะทำให้จังหวะดนตรีและอารมณ์ของฉากหนังกระตุกเสียหาย
2. **กรณีต้องการสั่งงานหน้าต่าง Auto Jump Cut แบบเดี่ยว (`view-autocut`):**
   - ใช้ `autolab_call_js` เพื่อสลับหน้าจอและสั่งรันโมดูล Jump Cut บน Active Sequence ปัจจุบัน:
   ```json
   // Tool: autolab_call_js
   {
     "code": "if (window.ViewManager) window.ViewManager.switchView('autocut'); return { activeSeq: window.JumpCutApp ? true : false };"
   }
   ```
