# 03 — Auto Frame Queue, Vision Framing (`🎯 จัดกรอบ`) & AI Naming SOP
# คู่มือปฏิบัติการเชิงลึก: ระบบคิว Auto Frame, การจัดกรอบด้วย AI Vision และการตั้งชื่อคลิปไวรัล

เอกสารนี้อธิบายขั้นตอนมาตรฐานในการควบคุมโมดูล **Auto Frame Studio** ของโปรแกรม AutoLab ตั้งแต่การดึงคลิปเข้าคิวแยกตามโฟลเดอร์ Bin, การเลือกกรอบ `.mogrt` และป้ายโปรโมท, การกด **`🎯 จัดกรอบ`** พร้อมตรวจภาพจริงด้วย AI Vision, การกด **`✨ AI Auto-Name`** (`Variety`), การกด **`💬 Name Refiner` ➔ `✂️ ย่อชื่อที่ยาว`**, ไปจนถึงการกด **`START`** เพื่อสร้างซีเควนซ์ทั้งหมด

---

## 1. แผนผังขั้นตอนการทำงาน (Auto Frame End-to-End Pipeline)

```mermaid
flowchart TD
    A["1. สำรวจ Bin และเทมเพลต<br/>autolab_get_status + autolab_list_templates"]
    B["2. โหลดคลิปจาก Bin เข้าคิว<br/>autolab_af_queue_add"]
    C["3. ผูกกรอบ .mogrt และป้ายโปรโมทแยกตาม Bin<br/>autolab_af_set_bin_template"]
    D["4. กด 🎯 จัดกรอบ + วัดขอบดำอัตโนมัติ<br/>autolab_af_tuner_auto_fit"]
    E{"5. AI Vision เปิดดูภาพ PNG<br/>previewImage.path พอดีกรอบหรือไม่?"}
    F["ปรับจูน Scale / PosX / PosY เพิ่มเติม<br/>autolab_af_tuner_adjust"]
    G["ยืนยันค่าจัดกรอบเข้า Bin<br/>autolab_af_tuner_apply"]
    H["6. ตั้งชื่อคลิปไวรัล (โหมด Variety)<br/>autolab_af_run_autoname"]
    I["7. ย่อชื่อที่ยาวเกิน 17 ตัวอักษรไทย<br/>autolab_af_run_name_refiner"]
    J["8. ตั้งค่า Topbar (ปิด AutoCut) & กด START<br/>autolab_af_configure_topbar + autolab_af_start_queue"]

    A --> B --> C --> D --> E
    E -->|"มีขอบดำ / หัวขาด / ซูมแน่นไป"| F --> E
    E -->|"พอดีกรอบสวยงาม ✅"| G --> H --> I --> J
```

---

## 2. รายละเอียดแต่ละสเต็ปและกฎเหล็กที่ต้องปฏิบัติตาม

### Step 1: สำรวจเทมเพลตกรอบ `.mogrt` และป้ายโปรโมทที่มีในเครื่อง
ก่อนผูกกรอบให้แต่ละ Bin ให้เรียก `autolab_list_templates` เพื่อดูรายชื่อกรอบและป้ายโปรโมททั้งหมดที่มีในเครื่อง:
```json
// Tool: autolab_list_templates
{}
```
- หากต้องการซิงค์กรอบใหม่ล่าสุดของทีมจาก Cloud Storage ให้เรียก `autolab_sync_company_pack({ "force": false })`

### Step 2: ดึงคลิปหรือ Sequence จาก Premiere Pro Bin เข้าคิว
- หากตัดไฮไลท์มาจาก Auto Highlights แล้ว (เป็น Sequence ย่อยใน Bin) ให้ตั้ง `"onlySequences": true`
- หากเป็นไฟล์วิดีโอฟุตเทจใน Bin ให้ตั้ง `"onlyMediaClips": true` (หรือไม่ระบุเพื่อดึงทั้งหมด)
```json
// Tool: autolab_af_queue_add
{
  "binNames": ["เป็นต่อ", "สุภาพบุรุษสุดซอย"],
  "clearFirst": true
}
```
- เรียก `autolab_af_queue_inspect` เพื่อดูรายการ Bin (`binKey`, `binName`) และจำนวนคลิปที่ถูกโหลดเข้ามา

### Step 3: เลือกกรอบ `.mogrt` และป้ายโปรโมทแยกตาม Bin
แต่ละรายการหรือแต่ละเรื่องสามารถใช้กรอบ `.mogrt` และป้ายโปรโมทต่างกันได้ โดยระบุ `binKey`:
```json
// Tool: autolab_af_set_bin_template
{
  "binKey": "เป็นต่อ",
  "frame": "ชื่อไฟล์กรอบ.mogrt",
  "promo": "ชื่อไฟล์ป้ายโปรโมท.mogrt"
}
```
*(หากต้องการใช้กรอบเดียวกันทุก Bin ในคิว ให้ส่ง `"binKey": "*"`)*

### Step 4: กด `🎯 จัดกรอบ` (`autolab_af_tuner_auto_fit`) — วัดช่องใส `.mogrt` + สแกนขอบดำวิดีโออัตโนมัติระดับพิกเซล (`~0.2–0.4s`)
> **🚨 กฎเหล็ก:** ห้ามเดาตัวเลข `scale` หรือ `posY` เอง และไม่ต้อง Hardcode `targetWindowWidth` เพราะคลิปแต่ละเรื่องมีขนาดไฟล์และขอบดำบน/ล่างที่ฝังอยู่ในเนื้อวิดีโอ (Hardcoded Letterbox) ไม่เท่ากัน ต่อให้เป็น `1920x1080` เหมือนกันก็อาจมีขอบดำข้างในไม่เท่ากัน และกรอบ `.mogrt` แต่ละแบบมีช่องใสไม่เท่ากัน!

1. **สั่งวัดขนาดช่องใส `.mogrt` คู่กับสแกนขอบดำวิดีโอและเซ็ตค่าลง Bin ทันที (`~0.2–0.4 วินาที`):**
   ```json
   // Tool: autolab_af_tuner_auto_fit
   {
     "binKey": "*"
   }
   ```
   - **กลไกการทำงานอัตโนมัติ (Zero-Dependency, ไม่ต้องตั้งค่าตัวเลขเอง):**
     1) **แกะช่องใส `.mogrt` (`mogrtAperture`):** ใช้ Pure Node.js (`fs` + `zlib`) อ่าน `thumb.png` ในไฟล์ `.mogrt` ที่เลือกเพื่อวัด `topY`, `bottomY`, `apertureW`, `apertureH`, `centerX`, `centerY` ระดับ 1 พิกเซล (`~15ms`)
     2) **สแกนพิกเซลวิดีโอหาขอบดำ 3 ช่วงเวลา (`cropAnalysis`):** ใช้ `ffmpeg.exe` ในตัว AutoLab ยิง `cropdetect=24:2:0` ที่นาทีที่ 2, 6, 12 (`120s`, `360s`, `720s` ช่วงละ 6 เฟรม) แล้วหา **Bounding Union** เพื่อแยกแยะอัตโนมัติว่าไฟล์มีขอบดำฝังในภาพหรือไม่ (`hasBlackBars: true/false`, `cropW`, `cropH`, `cropX`, `cropY`) โดยไม่โดนฉากมืดหลอก
     3) **คำนวณและบันทึก `updatedTransform` (`scale`, `posX`, `posY`) ลงคิวทันที:** คำนวณจากเนื้อภาพจริงหลังตัดขอบดำเทียบกับช่องใสของ `.mogrt` พร้อมระยะเผื่อทับขอบ (`safeBleedPx: 12`)
2. **กรณีต้องการเรนเดอร์ภาพจริง `.png` จาก Premiere Pro มาตรวจด้วยตา AI Vision เพิ่มเติม (`preview: true`):**
   ```json
   // Tool: autolab_af_tuner_auto_fit
   {
     "binKey": "*",
     "preview": true
   }
   ```
   - ใช้เครื่องมือดูภาพของ AI (เช่น `view_file`) เปิดดูไฟล์ `livePreview.previewImage.path`:
     1) **ขอบดำบน/ล่าง:** ภาพวิดีโอขยายเต็มช่องว่างของกรอบ `.mogrt` โดยไม่มีแถบสีดำโผล่ระหว่างภาพกับขอบกรอบ
     2) **ศีรษะและใบหน้าตัวละคร:** ตำแหน่ง `posY` และ `posX` อยู่กึ่งกลางช่องกรอบพอดี
3. **หากต้องการขยับปรับแต่งเพิ่มเติมในโหมด Preview:**
   ```json
   // Tool: autolab_af_tuner_adjust
   {
     "scale": 145,
     "posX": 540,
     "posY": 990,
     "timeSeconds": 12
   }
   ```
   - แล้วกดยืนยันด้วย `autolab_af_tuner_apply({ "binKey": "*" })` (ระบบจะลบ `_AutoLab_Preview_` ออกจากโปรเจกต์ให้อัตโนมัติ)

### Step 5: กด `✨ AI Auto-Name` (โหมด `🎭 Variety` เสมอสำหรับงานหนัง/ละคร)
> **🚨 กฎเหล็ก:** สำหรับงานตัดไฮไลท์หนัง ละคร ซีรีส์ หรือรายการวาไรตี้ **ต้องใช้ `mode: "variety"` เสมอ** ห้ามใช้ `mode: "news"` เด็ดขาด!

```json
// Tool: autolab_af_run_autoname
{
  "mode": "variety",
  "autoApply": true
}
```
- ระบบจะถอดเสียงพูดในคลิปด้วย Whisper ส่งให้ LLM คิดชื่อพาดหัวสไตล์ไวรัล และกดปุ่ม `✅ Apply All` นำชื่อใส่ลงในคิวให้อัตโนมัติ

### Step 6: กด `💬 Name Refiner` ➔ `✂️ ย่อชื่อที่ยาว` ➔ `✅ Apply All`
- ตัวอักษรภาษาไทยในกรอบ `.mogrt` จะสวยและไม่ล้นกรอบเมื่อความยาวตัวอักษรที่มองเห็นจริง (**Thai Visual Length** คือไม่นับสระบน/ล่างและวรรณยุกต์ `[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]`) **ไม่เกิน 17 ตัวอักษรต่อบรรทัด (`FILTER_CAP = 17`)**
- ให้รัน `autolab_af_run_name_refiner` เสมอหลังจากตั้งชื่อเสร็จ เพื่อคัดกรองคลิปที่ยาวเกิน 17 ตัวอักษรมาสั่งย่อให้กระชับและกด Apply All อัตโนมัติ:
```json
// Tool: autolab_af_run_name_refiner
{
  "instruction": "ย่อชื่อที่ยาวเกินให้สั้น",
  "autoApply": true,
  "closeModal": true
}
```
- **การตั้งชื่อแบบ 1 บรรทัด vs 2 บรรทัด (`+ เพิ่มบรรทัดที่ 2`):**
  - หากกรอบ `.mogrt` ที่ใช้เป็นแบบ **2 บรรทัด** สามารถใช้ `autolab_af_set_clip_title` ส่งทั้ง `line1` และ `line2` (บรรทัดละไม่เกิน 17 ตัวอักษรไทย) ได้ทันที:
    ```json
    // Tool: autolab_af_set_clip_title
    {
      "index": 0,
      "line1": "นึกว่าหมูในอวย",
      "line2": "ที่ไหนได้โคตรเทพ"
    }
    ```

### Step 7: ตั้งค่า Topbar และกดปุ่ม `START`
1. ตั้งค่าแถบด้านบน (`1080x1920`, เปิด `injectHeadline: true`, และ **ปิด AutoCut `autoCutState: 0`**):
   ```json
   // Tool: autolab_af_configure_topbar
   {
     "resMode": "custom",
     "width": 1080,
     "height": 1920,
     "promoStart": 5,
     "promoInterval": 0,
     "injectHeadline": true,
     "autoCutState": 0
   }
   ```
2. ตรวจสอบคิวครั้งสุดท้ายด้วย `autolab_af_queue_inspect` ว่า `allBinsHaveTemplates: true`
3. กดปุ่ม **`START`** เพื่อสร้างซีเควนซ์ทั้งหมดจนเสร็จ:
   ```json
   // Tool: autolab_af_start_queue
   {
     "wait": true,
     "autoDismissModal": true
   }
   ```
