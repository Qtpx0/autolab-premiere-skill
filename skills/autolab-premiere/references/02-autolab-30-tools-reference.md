# 02 — Complete AutoLab MCP Tool Reference Manual (38 Tools · 41 with aliases)
# คู่มืออ้างอิงเครื่องมือ AutoLab MCP ครบทั้ง 38 คำสั่ง (พารามิเตอร์และตัวอย่างการใช้งานจริง)

เอกสารนี้คือคู่มืออ้างอิงฉบับสมบูรณ์ของเซิร์ฟเวอร์ **`autolab` MCP (`AutoLab/mcp/autolab-mcp.js`)** ทั้งหมด **38 คำสั่งหลัก (41 คำสั่งรวม Aliases)** แบ่งตาม 7 หมวดหมู่การทำงานของโปรแกรม AutoLab

---

## 📑 สารบัญหมวดหมู่ทั้ง 38 คำสั่ง (Category Index)

1. [**หมวด A: ระบบ นำทาง และจัดการเทมเพลต `.mogrt` (System, Navigation & Templates — 6 Tools)**](#cat-a)
   - `autolab_get_status` · `autolab_navigate` · `autolab_list_templates` · `autolab_sync_company_pack` · `autolab_manage_profiles` · `autolab_manage_transforms`
2. [**หมวด B: ระบบตัดไฮไลท์อัตโนมัติ (Auto Highlights Engine — 6 Tools)**](#cat-b)
   - `autolab_ah_queue_add` · `autolab_ah_queue_manage` · `autolab_ah_configure` · `autolab_ah_run` · `autolab_ah_status` · `autolab_ah_cancel`
3. [**หมวด C: ระบบคิว Auto Frame และการผูกกรอบแยกตาม Bin (Auto Frame Queue & Bin Templates — 4 Tools)**](#cat-c)
   - `autolab_af_queue_add` · `autolab_af_queue_inspect` · `autolab_af_set_bin_template` · `autolab_af_queue_manage`
4. [**หมวด D: ระบบ `🎯 จัดกรอบ` และการตรวจสอบภาพด้วย AI Vision (Live Frame Tuner — 4 Tools)**](#cat-d)
   - `autolab_af_tuner_start` · `autolab_af_tuner_auto_fit` · `autolab_af_tuner_adjust` · `autolab_af_tuner_apply`
5. [**หมวด E: ระบบ `✨ ตั้งชื่อ AI` และ `✂️ ย่อชื่อที่ยาว` พาดหัว 1-2 บรรทัด (AI Naming & Name Refiner — 4 Tools)**](#cat-e)
   - `autolab_af_configure_naming` · `autolab_af_run_autoname` · `autolab_af_run_name_refiner` · `autolab_af_set_clip_title`
6. [**หมวด F: ตั้งค่า Topbar, คำสั่งรวบยอด `af_pipeline` และสั่งรันสร้างคลิปจริง `START` (Topbar, Fast Pipeline & Batch Execution — 5 Tools)**](#cat-f)
   - `autolab_af_configure_topbar` · `autolab_af_pipeline` · `autolab_af_start_queue` · `autolab_af_batch_status` · `autolab_af_cancel_queue`
7. [**หมวด G: คำสั่งจัดการ Bin / ตรวจสอบ / เตรียมตอน / ส่งออก Media Encoder และคำสั่งขั้นสูง (Production Helpers, Bin Management & Escape Hatches — 9 Tools + 3 Aliases)**](#cat-g)
   - `autolab_pr_inspect` · `autolab_pr_prepare_ep` · `autolab_pr_create_bin` · `autolab_pr_delete_bin` · `autolab_pr_move_item` · `autolab_pr_bin_tree` · `autolab_pr_export_ame` · `autolab_call_js` · `autolab_call_jsx`
   - *(Aliases: `autolab_pr_bin_move`, `autolab_pr_bin_clean`, `autolab_pr_find_bin`)*

---

<a id="cat-a"></a>

## 1. หมวด A: ระบบ นำทาง และจัดการเทมเพลต `.mogrt` (6 Tools)

### 1.1 `autolab_get_status`
- **หน้าที่:** ตรวจสอบสถานะปัจจุบันของพาเนล AutoLab, หน้าต่างที่เปิดอยู่ (`activeView`), ข้อมูลผู้ใช้ที่ล็อกอิน, สรุปจำนวนคลิปในคิว Auto Frame และคิว Auto Highlights
- **พารามิเตอร์:** `{} ` _(ไม่มีพารามิเตอร์)_
- **ตัวอย่างการเรียกใช้:**
  ```json
  {}
  ```

### 1.2 `autolab_navigate`
- **หน้าที่:** สลับหน้าจอโมดูลหลักของ AutoLab (`home`, `auto_frame`, `auto_highlights`, `auto_name`) และแท็บย่อยภายในหน้า Auto Frame (`queue`, `batch`, `manual`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `view` | `string` (`"home"` \| `"auto_frame"` \| `"auto_highlights"` \| `"auto_name"`) | optional | หน้าจอโมดูลเป้าหมายที่ต้องการเปิด |
  | `tab` | `string` (`"queue"` \| `"batch"` \| `"manual"`) | optional | แท็บย่อยเมื่ออยู่ในหน้า `auto_frame` |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "view": "auto_frame",
    "tab": "queue"
  }
  ```

### 1.3 `autolab_list_templates`
- **หน้าที่:** ดึงรายชื่อไฟล์กรอบ `.mogrt` (Frames) และป้ายโปรโมท `.mogrt` (Promo Banners) ทั้งหมดที่มีในเครื่อง (รวมทั้ง Company Pack, Internal Presets, Starter Pack และ Custom Folders) พร้อมรายชื่อ Master Profiles และ Transform Presets
- **พารามิเตอร์:** `{}` _(ไม่มีพารามิเตอร์)_

### 1.4 `autolab_sync_company_pack`
- **หน้าที่:** ตรวจสอบอัปเดตและดาวน์โหลด/ซิงค์ไฟล์กรอบ `.mogrt` และป้ายโปรโมทจากคลัง Company Pack บน Cloud Storage ลงเครื่องอัตโนมัติ
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `force` | `boolean` | optional | บังคับดาวน์โหลดใหม่ทั้งหมดแม้เวอร์ชันในเครื่องจะตรงกัน (`default: false`) |

### 1.5 `autolab_manage_profiles`
- **หน้าที่:** ดูรายการ (`list`), บันทึก (`save`), ลบ (`delete`), เลือกใช้งาน (`set_active`), แก้ไขเฉพาะโปรโมทของ Profile เดียว (`update_promo`), หรือเปลี่ยนแบนเนอร์โปรโมทพร้อมกันหลาย Profile (`batch_update_promo`) โดย **คงค่า Frame MOGRT และ Transform (Scale, PosX, PosY) เดิมไว้ 100% ปลอดภัย ไม่ถูกรีเซ็ต**
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `action` | `string` (`"list"` \| `"save"` \| `"delete"` \| `"set_active"` \| `"update_promo"` \| `"batch_update_promo"`) | optional | คำสั่งที่ต้องการทำกับ `MasterProfileManager` |
  | `id` | `string` | optional | รหัสโปรไฟล์ (ใช้เมื่อ `action` เป็น `"delete"`, `"set_active"`, หรือ `"update_promo"`) |
  | `name` | `string` | optional | ชื่อโปรไฟล์ (ใช้เมื่อ `action` เป็น `"save"` หรือระบุเป้าหมายใน `"update_promo"`) |
  | `promoName` | `string` | optional | ชื่อแบนเนอร์โปรโมทใหม่ที่ต้องการใส่ เช่น `"Promo_BrandA.mogrt"` (ระบบจะค้นหาและ resolve path ให้อัตโนมัติ) |
  | `promo` | `object` (`{ name, path }`) | optional | ข้อมูลป้ายโปรโมท `.mogrt` แบบระบุ path ตรง |
  | `oldPromoName` | `string` | optional | ใช้ใน `batch_update_promo`: กรองเปลี่ยนเฉพาะ Profile ที่กำลังใช้โปรโมทเก่านี้อยู่ เช่น `"ZEED"` |
  | `filterQuery` | `string` | optional | ใช้ใน `batch_update_promo`: กรอง Profile ตามคำค้นหาในชื่อ Profile |
  | `profiles` / `profileNames` | `string[]` | optional | ใช้ใน `batch_update_promo`: ระบุรายการ ID หรือชื่อ Profile ที่ต้องการเปลี่ยนเจาะจง |
  | `all` | `boolean` | optional | ใช้ใน `batch_update_promo`: หากเป็น `true` จะสลับโปรโมทให้ทุก Profile ในเครื่อง |
  | `clearPromo` | `boolean` | optional | หากเป็น `true` จะล้างโปรโมทออกจาก Profile ที่เลือก (กลายเป็น None) |
  | `frame` | `object` (`{ name, path }`) | optional | ข้อมูลกรอบ `.mogrt` ที่ต้องการบันทึกในโปรไฟล์ (ใช้กับ `save`) |
  | `transform` | `object` (`{ scale, posX, posY }`) | optional | ค่าขนาดและตำแหน่งภาพที่ต้องการบันทึกในโปรไฟล์ (ใช้กับ `save`) |
- **ตัวอย่างการเรียกใช้ (สลับโปรโมท ZEED เป็น IF ในทุกพรีเซ็ตหนัง):**
  ```json
  {
    "action": "batch_update_promo",
    "oldPromoName": "ZEED",
    "promoName": "Promo_BrandA.mogrt"
  }
  ```
- **ตัวอย่างการเรียกใช้ (เปลี่ยนเจาะจงเฉพาะบาง Profile):**
  ```json
  {
    "action": "batch_update_promo",
    "profiles": ["Series_A", "Movie_B"],
    "promoName": "Promo_BrandA.mogrt"
  }
  ```

### 1.6 `autolab_manage_transforms`
- **หน้าที่:** ดูรายการ (`list`), บันทึก (`save`), ลบ (`delete`), หรือเลือกใช้งาน (`set_active`) **Transform Preset** (ค่า Scale, PosX, PosY ที่ตั้งเก็บไว้ใช้ซ้ำ)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `action` | `string` (`"list"` \| `"save"` \| `"delete"` \| `"set_active"`) | optional | คำสั่งจัดการ Transform Preset |
  | `id` | `string` | optional | รหัส Preset |
  | `name` | `string` | optional | ชื่อ Preset (สำหรับการบันทึกใหม่) |
  | `scale` | `number \| string` | optional | ค่าความซูมภาพ เช่น `145` |
  | `posX` | `number \| string` | optional | ตำแหน่งแนวนอน เช่น `540` |
  | `posY` | `number \| string` | optional | ตำแหน่งแนวตั้ง เช่น `960` |

---

<a id="cat-b"></a>

## 2. หมวด B: ระบบตัดไฮไลท์อัตโนมัติ — Auto Highlights Engine (6 Tools)

### 2.1 `autolab_ah_queue_add`
- **หน้าที่:** ดึงไฟล์หนังหรือคลิปต้นฉบับเข้าสู่ **Auto Highlights Queue** โดยระบุชื่อโฟลเดอร์ Bin (`binName`), พาธเต็ม (`binPath`), หลาย Bin พร้อมกัน (`binNames`), รหัส `nodeIds`, คำค้นหา (`searchQuery`), หรือดึงจากรายการที่กำลังคลิกเลือกอยู่ใน Project Panel (`fromSelection`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binName` | `string` | optional | ชื่อโฟลเดอร์ Bin ใน Premiere Pro Project Panel |
  | `binPath` | `string` | optional | พาธเต็มของ Bin เช่น `"Movies/Action/JohnWick"` |
  | `binNames` | `string[]` | optional | รายชื่อหลาย Bin ที่ต้องการโหลดพร้อมกัน |
  | `nodeIds` | `string[]` | optional | ระบุ `nodeId` ของคลิปโดยตรง |
  | `searchQuery` | `string` | optional | กรองเฉพาะคลิปหรือ Bin ที่มีคำนี้ในชื่อ |
  | `fromSelection` | `boolean` | optional | ดึงจากรายการที่ผู้ใช้คลิกเลือกไว้ใน Project Panel |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "binName": "เป็นต่อ"
  }
  ```

### 2.2 `autolab_ah_queue_manage`
- **หน้าที่:** ตรวจสอบรายการ (`inspect`), ล้างคิวทั้งหมด (`clear`), ลบเฉพาะคลิป (`remove_clip`), หรือรีเซ็ตสถานะคิว Auto Highlights ทั้งหมด (`reset_all`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `action` | `string` (`"inspect"` \| `"clear"` \| `"remove_clip"` \| `"reset_all"`) | optional | คำสั่งจัดการคิว Auto Highlights |
  | `nodeId` | `string` | optional | รหัสคลิปเมื่อต้องการลบด้วย `remove_clip` |

### 2.3 `autolab_ah_configure`
- **หน้าที่:** ตั้งค่าพารามิเตอร์ของระบบ Auto Highlights ทั้งหมด (พรีเซ็ตลัด `preset: "movie"` หรือ `"show"`, โหมดวิเคราะห์ `engineMode: "gemini_audio"` Cloud AI Direct Audio, จำนวนคลิปไฮไลท์ `targetCount: 100`, ความยาว `duration: "0.5-1.5"`, ความเร็ว Speed Assist `1.15x`, Pitch `tone -2 / cents 3` และความละเอียด `1920x1080`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `preset` | `string` (`"movie"` \| `"show"`) | optional | พรีเซ็ตลัด: `"movie"` (เปิด Speed `1.15x`, `tone -2`, `cents 3`, `100 shots`, `60-90s`) หรือ `"show"` (ปิด Speed, `100 shots`, `60-90s`) |
  | `engineMode` | `string` (`"gemini_audio"`) | optional | โหมดวิเคราะห์เสียงตรงด้วย Cloud AI Direct Audio (**ใช้ `"gemini_audio"` เสมอ — ห้ามใช้ `whisper`, `hybrid`, หรือ `transcript`**) |
  | `targetCount` / `shotCount` | `number` | optional | จำนวนคลิปไฮไลท์เป้าหมาย (`default: 100`) |
  | `duration` | `string` | optional | ช่วงความยาวคลิป เช่น `"0.5-1.5"` (`60-90s`) |
  | `minDuration` | `number` | optional | ความยาวคลิปไฮไลท์ขั้นต่ำ (วินาที) เช่น `60` |
  | `maxDuration` | `number` | optional | ความยาวคลิปไฮไลท์สูงสุด (วินาที) เช่น `90` |
  | `style` | `string` | optional | สไตล์การตัด เช่น `"mixed"` |
  | `aggressiveness` | `number` | optional | ความดุดันของการคัดช็อต (`default: 3`) |
  | `resolution` | `string` | optional | ความละเอียด Sequence เช่น `"1920x1080"` |
  | `enableSpeed` | `boolean` | optional | เปิด/ปิดการเร่งความเร็วคลิปอัตโนมัติ (หนัง=`true`, รายการ=`false`) |
  | `speedPercent` | `number` | optional | เปอร์เซ็นต์ความเร็ว เช่น `115` (`1.15x`) |
  | `pitchSemitones` | `number` | optional | ปรับระดับเสียง Semitones เช่น `-2` |
  | `pitchCents` | `number` | optional | ปรับระดับเสียงละเอียด Cents เช่น `3` |
  | `maintainPitch` | `boolean` | optional | รักษาระดับเสียงพูดเมื่อเร่งสปีด (`default: true`) |
- **ตัวอย่างการเรียกใช้:**
  ```json
  // งานหนัง/ซีรีส์ (เปิด Speed 1.15x อัตโนมัติ):
  { "preset": "movie" }

  // งานรายการทีวี (ปิด Speed อัตโนมัติ):
  { "preset": "show" }
  ```

### 2.4 `autolab_ah_run`
- **หน้าที่:** กดเริ่มสแกนไฟล์หนัง ถอดเสียง คัดเลือกซีนเด็ดด้วย AI และตัดสร้าง Sub-Sequence ไฮไลท์ใน Premiere Pro จนเสร็จ พร้อมคืนค่าสรุป QA (`completed`, `totalClipsProcessed`, `totalShotsCreated`, `successCount`, `errorCount`, `outputBinPath`, `deliveryConfirmed`, `sampleShots`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `wait` | `boolean` | optional | รอจนกว่าจะตัดไฮไลท์เสร็จทั้งหมดค่อยคืนค่า (`default: true`) |
  | `verbose` | `boolean` | optional | คืนรายการ `shots` ทั้งหมดครบทุกตัว (`default: false` เพื่อความกระชับ) |

### 2.5 `autolab_ah_status`
- **หน้าที่:** ดูความคืบหน้าแบบสดๆ (Live Progress) และสถานะของแต่ละคลิปในคิว Auto Highlights
- **พารามิเตอร์:** `{}` _(ไม่มีพารามิเตอร์)_

### 2.6 `autolab_ah_cancel`
- **หน้าที่:** สั่งหยุดหรือยกเลิกงานสแกน Auto Highlights ที่กำลังรันอยู่
- **พารามิเตอร์:** `{}` _(ไม่มีพารามิเตอร์)_

---

<a id="cat-c"></a>

## 3. หมวด C: ระบบคิว Auto Frame และการผูกกรอบแยกตาม Bin (4 Tools)

### 3.1 `autolab_af_queue_add`
- **หน้าที่:** ดึง Sequence ไฮไลท์หรือคลิปวิดีโอจากโฟลเดอร์ Bin ใน Premiere Pro เข้าสู่ **Auto Frame Queue** พร้อมจัดกลุ่มแยกตาม Bin ให้อัตโนมัติ
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binName` | `string` | optional | ชื่อโฟลเดอร์ Bin ใน Premiere Pro |
  | `binPath` | `string` | optional | พาธเต็มของโฟลเดอร์ Bin |
  | `binNames` | `string[]` | optional | ดึงหลาย Bin เข้าคิวพร้อมกันในคำสั่งเดียว |
  | `nodeIds` | `string[]` | optional | ดึงเฉพาะรายการที่มี `nodeId` ตามที่ระบุ |
  | `onlySequences` | `boolean` | optional | ดึงเฉพาะ Sequence (เช่น ซีเควนซ์ที่ตัดมาจาก Auto Highlights) |
  | `onlyMediaClips` | `boolean` | optional | ดึงเฉพาะไฟล์วิดีโอฟุตเทจดิบ |
  | `searchQuery` | `string` | optional | กรองตามคำค้นหาในชื่อคลิปหรือชื่อ Bin |
  | `fromSelection` | `boolean` | optional | ดึงจากรายการที่คลิกเลือกไว้ใน Project Panel |
  | `clearFirst` | `boolean` | optional | ล้างคิวเก่าทิ้งก่อนเพิ่่มรายการใหม่ (`default: false`) |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "binNames": ["เป็นต่อ", "สุภาพบุรุษสุดซอย", "ชิงร้อย"],
    "onlyMediaClips": true,
    "clearFirst": true
  }
  ```

### 3.2 `autolab_af_queue_inspect`
- **หน้าที่:** ตรวจสอบข้อมูลใน **Auto Frame Queue** ทั้งหมดแบบละเอียด แยกตามกลุ่ม Bin: แสดงกรอบ `.mogrt` ที่ผูกไว้, ขนาดฟอนต์ตั้งต้นของกรอบ `.mogrt` (`defaultFontSizeL1`, `defaultFontSizeL2` ที่อ่านสดจาก `definition.json`), ป้ายโปรโมท `.mogrt`, ค่า Transform (`scale`, `posX`, `posY`), รายชื่อคลิปทุกตัวพร้อมข้อความพาดหัว (`line1`, `line2`) และขนาดฟอนต์ที่ตั้งเฉพาะ (`fontSizeL1`, `fontSizeL2`), ความยาวตัวอักษรไทย (ไม่นับสระบน/ล่างและวรรณยุกต์), และจำนวนคลิปที่ชื่อยาวเกิน 17 ตัวอักษร (`longClipsOver17Chars`)
- **พารามิเตอร์:** `{}` _(ไม่มีพารามิเตอร์)_

### 3.3 `autolab_af_set_bin_template`
- **หน้าที่:** กำหนดกรอบ `.mogrt` (`frame`), ป้ายโปรโมท `.mogrt` (`promo`), Master Profile (`profileId`/`profileName`), หรือค่า Transform (`scale`, `posX`, `posY`) ให้กับ Bin ที่ระบุ (หรือใส่ `binKey: "*"` เพื่อใช้กับทุก Bin ในคิว)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binKey` | `string` | optional | ชื่อหรือรหัส Bin เป้าหมาย (ใช้ `"*"` เพื่อตั้งให้ทุก Bin พร้อมกัน) |
  | `applyToAllBins` | `boolean` | optional | ตั้งเป็น `true` เพื่อใช้กับทุก Bin ในคิว |
  | `frame` | `string` | optional | ชื่อไฟล์กรอบ `.mogrt` (ใส่แค่บางส่วนของชื่อหรือพาธเต็มก็ได้, ส่ง `""` เพื่อเอาออก) |
  | `promo` | `string` | optional | ชื่อไฟล์ป้ายโปรโมท `.mogrt` (ใส่บางส่วนของชื่อหรือพาธเต็ม, ส่ง `""` เพื่อเอาออก) |
  | `profileId` | `string` | optional | รหัส Master Profile ที่ต้องการนำมาใช้ |
  | `profileName` | `string` | optional | ชื่อ Master Profile ที่ต้องการนำมาใช้ |
  | `transform` | `object` (`{ scale, posX, posY }`) | optional | กำหนดค่าขนาดและตำแหน่งภาพให้ Bin โดยตรง |
  | `transformPresetId` | `string` | optional | รหัส Transform Preset |
  | `transformPresetName` | `string` | optional | ชื่อ Transform Preset |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "binKey": "เป็นต่อ",
    "frame": "Frame_Variety_2Line.mogrt",
    "promo": "Promo_Banner.mogrt"
  }
  ```

### 3.4 `autolab_af_queue_manage`
- **หน้าที่:** ลบคลิป (`remove_clip`), ลบทั้ง Bin (`remove_bin`), รีเซ็ตสถานะคลิป (`reset_clip`), รีเซ็ตทั้ง Bin (`reset_bin`), รีเซ็ตทั้งคิว (`reset_all`), หรือล้างคิวทั้งหมด (`clear`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `action` | `string` (`"remove_clip"` \| `"remove_bin"` \| `"reset_clip"` \| `"reset_bin"` \| `"reset_all"` \| `"clear"`) | **required** | คำสั่งจัดการคิว |
  | `nodeId` | `string` | optional | รหัสคลิป (สำหรับ `remove_clip` / `reset_clip`) |
  | `binKey` | `string` | optional | ชื่อหรือรหัส Bin (สำหรับ `remove_bin` / `reset_bin`) |

---

<a id="cat-d"></a>

## 4. หมวด D: ระบบ `🎯 จัดกรอบ` และการตรวจสอบภาพด้วย AI Vision — Live Frame Tuner (4 Tools)

### 4.1 `autolab_af_tuner_start`
- **หน้าที่:** เปิดโหมด **`🎯 จัดกรอบ` (Live Frame Tuner)** สำหรับ Bin ที่ระบุ โดยระบบจะสร้างซีเควนซ์จำลอง `_AutoLab_Preview_` ใน Premiere Pro ที่วางทั้งคลิปจริง + กรอบ `.mogrt` + ป้ายโปรโมท `.mogrt` ซ้อนกันครบ แล้วส่งออกไฟล์ภาพ `.png` (`previewImage.path`) ออกมาให้ AI Vision เปิดดูด้วยตาเปล่า
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binKey` | `string` | optional | ชื่อหรือรหัส Bin เป้าหมาย (ค่าเริ่มต้นคือ Bin แรกในคิว) |
  | `clipIndexInBin` | `number` | optional | ลำดับคลิปใน Bin ที่ต้องการใช้เป็นตัวอย่างจัดกรอบ (`default: 0`) |
  | `seqW` | `number` | optional | ความกว้างซีเควนซ์ (`default: 1080`) |
  | `seqH` | `number` | optional | ความสูงซีเควนซ์ (`default: 1920`) |
  | `outputPreviewPath` | `string` | optional | พาธไฟล์ `.png` ที่ต้องการบันทึกภาพตัวอย่าง |

### 4.2 `autolab_af_tuner_auto_fit`
- **หน้าที่:** คำนวณขนาดกรอบอัตโนมัติระดับพิกเซล (**Millimeter Smart Auto-Fit · ~0.2–0.4s · Zero-Dependency**):
  1. แกะ `thumb.png` ในไฟล์กรอบ `.mogrt` ด้วย Pure Node.js (`fs` + `zlib`) เพื่อวัดพิกัดช่องโปร่งใสจริง (`topY`, `bottomY`, `apertureW`, `apertureH`, `centerX`, `centerY`)
  2. รัน FFmpeg `cropdetect=24:2:0` แบบขนาน 3 ช่วงเวลา (`120s`, `360s`, `720s` ช่วงละ 6 เฟรม) แล้วหา **Bounding Union** เพื่อตรวจจับขอบดำที่ฝังในเนื้อวิดีโอ (`hasBlackBars: true/false`, `cropW`, `cropH`, `cropX`, `cropY`) โดยไม่โดนฉากมืดหลอก
  3. คำนวณและบันทึก `scale`, `posX`, `posY` ที่พอดีกับช่องกรอบพร้อมระยะเผื่อทับขอบ (`safeBleedPx: 12`) ลงใน Bin ทันทีโดยไม่ต้องเปิด Preview Sequence ช้าๆ (ยกเว้นส่ง `preview: true`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binKey` | `string` | optional | ชื่อหรือรหัส Bin เป้าหมาย (`default: "*"` สำหรับ Bin แรก/ทุก Bin) |
  | `frame` | `string` | optional | ชื่อหรือพาธไฟล์กรอบ `.mogrt` (หากไม่ระบุจะใช้กรอบที่ผูกไว้ใน Bin) |
  | `targetWindowWidth` | `number` | optional | กำหนดความกว้างช่องใสเอง (หากไม่ระบุจะวัดจาก `.mogrt` อัตโนมัติ) |
  | `targetWindowHeight` | `number` | optional | กำหนดความสูงช่องใสเอง (หากไม่ระบุจะวัดจาก `.mogrt` อัตโนมัติ) |
  | `safeBleedPx` | `number` | optional | ระยะเผื่อทับขอบบน+ล่างเพื่อกันรอยต่อ sub-pixel (`default: 12` = บน 6px + ล่าง 6px) |
  | `extraZoomPercent` | `number` | optional | ซูมเผื่อเพิ่มอีกกี่เปอร์เซ็นต์ เช่น `5` (+5%) |
  | `posX` | `number` | optional | กำหนดตำแหน่งแนวนอนเอง (หากไม่ระบุจะคำนวณจากจุดกึ่งกลางช่องใส `.mogrt` + ชดเชยขอบดำ) |
  | `posY` | `number` | optional | กำหนดตำแหน่งแนวตั้งเอง (หากไม่ระบุจะคำนวณจากจุดกึ่งกลางช่องใส `.mogrt` + ชดเชยขอบดำ) |
  | `apply` | `boolean` | optional | บันทึกค่าที่คำนวณได้ลง Bin ทันที (`default: true`) |
  | `preview` | `boolean` | optional | เรนเดอร์ไฟล์ภาพ `.png` จากซีเควนซ์ `_AutoLab_Preview_` ใน Premiere Pro (`default: false` เพื่อความเร็ว ~0.2s) |
  | `outputPreviewPath` | `string` | optional | พาธไฟล์ `.png` สำหรับบันทึกภาพตัวอย่างเมื่อ `preview: true` |
- **ตัวอย่างการเรียกใช้ (ไม่ต้องใส่ตัวเลข Hardcode):**
  ```json
  {
    "binKey": "*"
  }
  ```

### 4.3 `autolab_af_tuner_adjust`
- **หน้าที่:** ปรับจูนค่า `scale`, `posX`, `posY` ในหน้าต่าง `_AutoLab_Preview_` (ระบุเป็นค่าตัวเลขตรงๆ หรือบวกลบด้วย `deltaScale`, `deltaX`, `deltaY`) พร้อมแคปภาพ `.png` ใบใหม่จาก Premiere Pro ออกมาให้ AI Vision ดูผลลัพธ์ทันที
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `scale` | `number` | optional | ค่า Scale ใหม่ (`10..400`) |
  | `posX` | `number` | optional | ค่า Position X ใหม่ |
  | `posY` | `number` | optional | ค่า Position Y ใหม่ |
  | `deltaScale` | `number` | optional | ปรับเพิ่ม/ลด Scale จากค่าปัจจุบัน เช่น `+5` หรือ `-3` |
  | `deltaX` | `number` | optional | ขยับซ้าย/ขวาจากค่าปัจจุบัน (พิกเซล) |
  | `deltaY` | `number` | optional | ขยับขึ้น/ลงจากค่าปัจจุบัน (พิกเซล) |
  | `timeSeconds` | `number` | optional | เลื่อนเวลา Playhead (วินาที) เพื่อดูเฟรมอื่นของคลิป |
  | `outputPreviewPath` | `string` | optional | พาธไฟล์ `.png` สำหรับบันทึกภาพตัวอย่าง |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "scale": 148,
    "posX": 540,
    "posY": 985
  }
  ```

### 4.4 `autolab_af_tuner_apply`
- **หน้าที่:** กดยืนยันและบันทึกค่า `scale`, `posX`, `posY` ที่จูนเสร็จแล้วเข้าสู่ Bin (หรือทุก Bin), เลือกบันทึกเก็บเป็น Transform Preset ได้ และลบซีเควนซ์ชั่วคราว `_AutoLab_Preview_` ออกจากโปรเจกต์ Premiere Pro ให้อัตโนมัติ
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binKey` | `string` | optional | ชื่อหรือรหัส Bin เป้าหมาย |
  | `scale` | `number` | optional | ค่า Scale สุดท้าย (หากไม่ระบุจะใช้ค่าล่าสุดจาก Tuner) |
  | `posX` | `number` | optional | ค่า PosX สุดท้าย |
  | `posY` | `number` | optional | ค่า PosY สุดท้าย |
  | `applyToAllBins` | `boolean` | optional | นำค่านี้ไปใช้กับทุก Bin ในคิวหรือไม่ (`default: false`) |
  | `saveAsPresetName` | `string` | optional | ตั้งชื่อเพื่อบันทึกเก็บไว้ใน `TransformPresetManager` |

---

<a id="cat-e"></a>

## 5. หมวด E: ระบบ `✨ ตั้งชื่อ AI` และ `✂️ ย่อชื่อที่ยาว` พาดหัว 1-2 บรรทัด (4 Tools)

### 5.1 `autolab_af_configure_naming`
- **หน้าที่:** ตั้งค่าโหมดการตั้งชื่อ AI (`mode: "variety"` สำหรับงานหนัง/ละคร/รายการบันเทิง — **ห้ามใช้ `"news"` ยกเว้นตัดข่าวจริง**), เปิด/ปิด Batch Context Mode, และเลือก AI Provider / Model
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `mode` | `string` (`"variety"` \| `"content"` \| `"news"`) | optional | โหมดตั้งชื่อ (**ใช้ `"variety"` เสมอสำหรับงานหนัง/ละคร/ไฮไลท์**) |
  | `batchMode` | `boolean` | optional | เปิดโหมดส่งบริบทรวมทั้ง Bin เพื่อไม่ให้ชื่อคลิปซ้ำกัน |
  | `provider` | `string` | optional | ชื่อผู้ให้บริการ AI |
  | `model` | `string` | optional | ชื่อโมเดล AI |

### 5.2 `autolab_af_run_autoname`
- **หน้าที่:** กดปุ่ม **`✨ AI Auto-Name`** ให้ทุกคลิปใน Auto Frame Queue (ถอดเสียงด้วย Whisper + คิดชื่อพาดหัวภาษาไทยสไตล์ไวรัลด้วยโหมด `variety`) และกดปุ่ม **`✅ Apply All`** ในหน้าต่างตรวจสอบให้อัตโนมัติ
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `mode` | `string` (`"variety"` \| `"content"` \| `"news"`) | optional | ค่าเริ่มต้นคือ `"variety"` |
  | `autoApply` | `boolean` | optional | กด `✅ Apply All` ให้อัตโนมัติเมื่อคิดชื่อเสร็จ (`default: true`) |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "mode": "variety",
    "autoApply": true
  }
  ```

### 5.3 `autolab_af_run_name_refiner`
- **หน้าที่:** เปิดหน้าต่าง **`💬 Name Refiner`** ของคิว, กดปุ่ม **`✂️ ย่อชื่อที่ยาว`** (คัดกรองเฉพาะคลิปที่พาดหัวยาวเกิน **17 ตัวอักษรไทย** `FILTER_CAP = 17` แล้วสั่ง AI ย่อให้กระชับพร้อมระบบลองใหม่อัตโนมัติหากยังเกิน) และกดปุ่ม **`✅ Apply All`** (`#nrc-apply-all`) เพื่ออัปเดตชื่อลงคิวทันที
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `instruction` | `string` | optional | คำสั่งย่อชื่อ (`default: "ย่อชื่อที่ยาวเกินให้สั้น"`) |
  | `autoApply` | `boolean` | optional | กด `✅ Apply All` อัตโนมัติ (`default: true`) |
  | `closeModal` | `boolean` | optional | ปิดหน้าต่าง Name Refiner อัตโนมัติหลังกด Apply (`default: true`) |
  | `timeoutMs` | `number` | optional | เวลารอสูงสุดมิลลิวินาที (`default: 120000`) |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "instruction": "ย่อชื่อที่ยาวเกินให้สั้น",
    "autoApply": true,
    "closeModal": true
  }
  ```

### 5.4 `autolab_af_set_clip_title`
- **หน้าที่:** แก้ไขข้อความพาดหัวรายคลิป, หลายคลิปพร้อมกัน, หรือ **สั่งใส่บรรทัดที่ 2 (ชื่อหนัง/ป้ายรายการ) + ปรับขนาดฟอนต์ยกทั้ง Bin ในคำสั่งเดียว (`binKey`)** รองรับทั้งแบบ **1 บรรทัด (`line1`)** และ **2 บรรทัด (`+ เพิ่มบรรทัดที่ 2` คือส่ง `line2`)** พร้อมกำหนดขนาดฟอนต์ของบรรทัดที่ 1 (`fontSizeL1`) และบรรทัดที่ 2 (`fontSizeL2`) ได้โดยไม่ต้องเปิดแผง Essential Graphics ของ Adobe
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `nodeId` | `string` | optional | รหัส `nodeId` ของคลิปที่ต้องการแก้ |
  | `index` | `number` | optional | ลำดับคลิปในคิว (เริ่มจาก `0`) |
  | `binKey` | `string` | optional | ชื่อหรือรหัส Bin เป้าหมาย (หรือส่ง `"*"` เพื่อตั้งทุก Bin ในคิว) สำหรับใส่ `line2` และ/หรือ `fontSizeL2` ให้ทุกคลิปใน Bin พร้อมกัน |
  | `line1` | `string` | optional | ข้อความพาดหัวบรรทัดที่ 1 |
  | `line2` | `string` | optional | ข้อความพาดหัวบรรทัดที่ 2 เช่น ชื่อหนัง/ชื่อรายการ (ส่ง `""` หากต้องการใช้แค่บรรทัดเดียว) |
  | `fontSizeL1` | `number` | optional | ขนาดฟอนต์ของบรรทัดที่ 1 (ใส่ `0` หรือไม่ระบุ = ใช้ขนาดตั้งต้นของ `.mogrt`) |
  | `fontSizeL2` | `number` | optional | ขนาดฟอนต์ของบรรทัดที่ 2 เช่น `28` หรือ `32` เพื่อให้เล็กกว่าบรรทัดแรก (ใส่ `0` หรือไม่ระบุ = ใช้ขนาดตั้งต้นของ `.mogrt`) |
  | `userText` | `string` | optional | ข้อความเต็ม (คั่นบรรทัดด้วย `\n`) |
  | `updates` | `array` of `{ nodeId, index, binKey, line1, line2, fontSizeL1, fontSizeL2, userText }` | optional | แก้ไขหลายคลิปหรือหลาย Bin พร้อมกันในครั้งเดียว |
- **ตัวอย่างการเรียกใช้ (ใส่ชื่อหนังบรรทัด 2 + ปรับขนาดฟอนต์ยกทั้ง Bin ในคำสั่งเดียว):**
  ```json
  {
    "binKey": "*",
    "line2": "หนังวันนี้",
    "fontSizeL2": 28
  }
  ```
- **ตัวอย่างการเรียกใช้ (แก้ไขรายคลิปหลายรายการ):**
  ```json
  {
    "updates": [
      { "index": 0, "line1": "นึกว่าหมูในอวย", "line2": "ที่ไหนได้โคตรเทพ", "fontSizeL2": 32 },
      { "index": 1, "line1": "เปิดศึกชิงนาง", "line2": "กลางงานเลี้ยง", "fontSizeL2": 32 }
    ]
  }
  ```

---

<a id="cat-f"></a>

## 6. หมวด F: ตั้งค่า Topbar, คำสั่งรวบยอด `af_pipeline` และสั่งรันสร้างคลิปจริง `START` (5 Tools)

### 6.1 `autolab_af_configure_topbar`
- **หน้าที่:** ตั้งค่าแถบด้านบนของหน้า Auto Frame: ขนาดความละเอียด (`1080x1920`), วินาทีเริ่มแสดงป้ายโปรโมท (`promoStart`), ระยะเวลาวนซ้ำป้ายโปรโมท (`promoInterval`), สวิตช์ใส่ข้อความพาดหัวลงกรอบ (`injectHeadline`), และสถานะ `AutoCut` (**ต้องตั้ง `autoCutState: 0` (OFF) เสมอสำหรับงานหนัง/ละคร**)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `resMode` | `string` (`"custom"` \| `"hd"` \| `"4k"`) | optional | โหมดความละเอียด |
  | `width` | `number` | optional | ความกว้างซีเควนซ์ (`default: 1080`) |
  | `height` | `number` | optional | ความสูงซีเควนซ์ (`default: 1920`) |
  | `promoStart` | `number` | optional | วินาทีที่ป้ายโปรโมทเริ่มแสดง (`default: 5`) |
  | `promoInterval` | `number` | optional | ระยะเวลาวนซ้ำป้ายโปรโมท (`default: 0` = ลากจนจบคลิป) |
  | `injectHeadline` | `boolean` | optional | เปิด/ปิดการยัดข้อความพาดหัวเข้ากรอบ `.mogrt` (`default: true`) |
  | `autoCutState` | `number` (`0` \| `1` \| `2`) | optional | สถานะ AutoCut (**ต้องเป็น `0` เสมอสำหรับงานหนัง/คลิปไฮไลท์**) |
- **ตัวอย่างการเรียกใช้:**
  ```json
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

### 6.2 `autolab_af_pipeline`
- **หน้าที่:** คำสั่งรวบยอดความเร็วสูงสุด (Single-Call Fast Pipeline) สำหรับเรื่องที่มี Master Profile หรือทราบค่ากรอบ/สเกลอยู่แล้ว โดยจะทำงานต่อเนื่องใน 1 คำสั่งโดยไม่เสียเวลารอ LLM Turn:
  1. ดึงเฉพาะ Sequences จาก `binPath`/`binName` เข้าคิว (`af_queue_add` พร้อมบล็อก Sub-bin ย่อย เช่น `ไฟล์ต้นฉบับ` อัตโนมัติ)
  2. ผูก Master Profile (`profileName`) หรือกรอบ (`frame`), ป้ายโปรโมท (`promo`), และสเกล (`scale`, `posX`, `posY`)
  3. ตั้งค่า Topbar (`1080x1920`, `promoStart: 5`, `promoInterval: 0`, `autoCutState: 0`)
  4. รัน `✨ AI Auto-Name` (โหมด `variety`) และกด Apply All อัตโนมัติ
  5. เชื่อมต่อ `💬 Name Refiner` (`✂️ ย่อชื่อที่ยาว` ≤ 17 ตัวอักษรไทย) ต่อทันทีใน `0ms`
  6. กดปุ่ม `START` เพื่อสร้างซีเควนซ์ทั้งหมดทันที (เมื่อตั้ง `startQueue: true`)
  - **Stage-Aware Error Reporting:** หากขั้นตอนใดเกิดข้อผิดพลาด (เช่น API Timeout ตอนตั้งชื่อ AI) ระบบจะหยุดทันทีโดยไม่เผลอกด START และแจ้งกลับอย่างชัดเจนว่าขั้นตอนใดสำเร็จไปแล้วและค้างอยู่ที่ขั้นตอนไหน (เช่น `Pipeline completed [queue_add (46 clips) -> set_bin_template -> configure_topbar (5-0)] successfully, but failed at [af_run_autoname]`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binPath` | `string` | optional | พาธของ Bin เป้าหมายใน Premiere Pro (เช่น `"Movies/SeriesA/ep1/HIGHLIGHTS_ep1"`) |
  | `binName` | `string` | optional | ชื่อ Bin เป้าหมาย (เช่น `"HIGHLIGHTS_ep1"`) |
  | `binNames` / `binPaths` | `string[]` | optional | รายชื่อหรือพาธของหลาย Bin พร้อมกัน |
  | `binKey` | `string` | optional | คีย์ของ Bin ที่ต้องการผูกเทมเพลต (`default: "*"` ทุก Bin) |
  | `clearFirst` | `boolean` | optional | ล้างคิวเก่าก่อนดึงเข้าคิวใหม่ (`default: true`) |
  | `onlySequences` / `sequencesOnly` | `boolean` | optional | ดึงเฉพาะ Sequences และไม่มุดลง Sub-bin ย่อย (`default: true`) |
  | `profileName` / `masterProfile` | `string` | optional | ชื่อ Master Profile ที่ต้องการผูก |
  | `profileId` | `string` | optional | รหัส ID ของ Master Profile |
  | `frame` / `frameMogrt` | `string` | optional | ชื่อหรือพาธไฟล์กรอบ `.mogrt` |
  | `promo` / `promoMogrt` | `string` | optional | ชื่อหรือพาธไฟล์ป้ายโปรโมท `.mogrt` |
  | `scale` / `posX` / `posY` | `number` | optional | ค่าสเกลและตำแหน่งวิดีโอ (หากไม่ระบุเมื่อตั้ง `frame` โดยไม่มี `profileName` ระบบจะรัน `af_tuner_auto_fit` วัดกรอบ+ตัดขอบดำให้อัตโนมัติ) |
  | `autoFit` | `boolean` | optional | สั่งรัน `af_tuner_auto_fit` วัดช่องใส `.mogrt` + ตัดขอบดำวิดีโอใน Pipeline อัตโนมัติ (`default: true` เมื่อมี `frame` แต่ไม่มี `profileName`/`scale`) |
  | `safeBleedPx` | `number` | optional | ระยะเผื่อทับขอบพิกเซลสำหรับ `autoFit` (`default: 12`) |
  | `extraZoomPercent` | `number` | optional | ซูมเผื่อเพิ่มกี่เปอร์เซ็นต์สำหรับ `autoFit` |
  | `promoStart` | `number` | optional | วินาทีที่ป้ายโปรโมทเริ่มแสดง (`default: 5`) |
  | `promoInterval` | `number` | optional | ระยะเวลาวนซ้ำป้ายโปรโมท (`default: 0` = ลากจนจบคลิป) |
  | `mode` / `namingMode` | `string` (`"variety"` \| `"news"`) | optional | โหมดตั้งชื่อ AI (`default: "variety"`) |
  | `runAutoName` | `boolean` | optional | รัน `✨ AI Auto-Name` อัตโนมัติ (`default: true`) |
  | `runNameRefiner` | `boolean` | optional | รัน `💬 Name Refiner` ต่อทันทีหากมีชื่อยาวเกิน 17 ตัวอักษร (`default: true`) |
  | `line2` | `string` | optional | ข้อความบรรทัดที่ 2 (เช่น ชื่อหนัง/ป้ายรายการ) ที่ต้องการใส่ให้ทุกคลิปหลังตั้งชื่อ AI เสร็จ |
  | `fontSizeL2` | `number` | optional | ขนาดฟอนต์ของบรรทัดที่ 2 (เช่น `28` หรือ `32`) |
  | `fontSizeL1` | `number` | optional | ขนาดฟอนต์ของบรรทัดที่ 1 |
  | `titleUpdates` | `array` | optional | รายการอัปเดตข้อความ/ขนาดฟอนต์แยกตาม Bin หรือคลิปหลังตั้งชื่อ AI เสร็จ |
  | `startQueue` | `boolean` | optional | กดปุ่ม `START` สร้างซีเควนซ์ต่อทันทีเมื่อตั้งชื่อเสร็จ (`default: false`) |
  | `wait` | `boolean` | optional | รอจนกว่าการสร้างซีเควนซ์ทั้งหมดจะเสร็จสมบูรณ์ (`default: true`) |
- **ตัวอย่างการเรียกใช้:**
  ```json
  {
    "binPath": "Movies/SeriesA/ep1/HIGHLIGHTS_ep1",
    "profileName": "MySeriesProfile",
    "promoStart": 5,
    "promoInterval": 0,
    "startQueue": true
  }
  ```

### 6.3 `autolab_af_start_queue`
- **หน้าที่:** กดปุ่ม **`START`** (`#btnRun` ➔ `BatchManager.processQueue`) เพื่อเริ่มสร้างซีเควนซ์จริงใน Premiere Pro ครบทุกคลิปในคิว: สร้างซีเควนซ์ `1080x1920`, ปรับ Scale/PosX/PosY ตามค่าของแต่ละ Bin, วางกรอบ `.mogrt` พร้อมเขียนข้อความพาดหัวบรรทัดที่ 1-2, วางป้ายโปรโมท `.mogrt` ตามจังหวะเวลา และจัดเก็บซีเควนซ์ที่เสร็จแล้วเข้า Bin ปลายทาง
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `wait` | `boolean` | optional | รอจนกว่าทุกคลิปในคิวจะสร้างเสร็จครบ 100% (`default: true`) |
  | `resetDoneFirst` | `boolean` | optional | รีเซ็ตคลิปที่ขึ้นสถานะ Done ให้กลับมาทำใหม่ด้วยหรือไม่ (`default: false`) |
  | `autoDismissModal` | `boolean` | optional | ปิดหน้าต่างแจ้งเตือน DONE อัตโนมัติเมื่อทำเสร็จ (`default: true`) |

### 6.4 `autolab_af_batch_status`
- **หน้าที่:** ดูสถานะความคืบหน้าขณะกำลังรันสร้างซีเควนซ์ใน Auto Frame Queue (จำนวนที่เสร็จแล้ว, กำลังทำ, รอคิว, Error และเปอร์เซ็นต์ของแต่ละคลิป)
- **พารามิเตอร์:** `{}` _(ไม่มีพารามิเตอร์)_

### 6.5 `autolab_af_cancel_queue`
- **หน้าที่:** สั่งหยุด/ยกเลิกการรันคิว Auto Frame หลังจากคลิปที่กำลังทำอยู่เสร็จสิ้น
- **พารามิเตอร์:** `{}` _(ไม่มีพารามิเตอร์)_

---

<a id="cat-g"></a>

## 7. หมวด G: คำสั่งจัดการ Bin / ตรวจสอบ / เตรียมตอน / ส่งออก Media Encoder และคำสั่งขั้นสูง (9 Tools + 3 Aliases)

### 7.1 `autolab_pr_inspect`
- **หน้าที่:** ตรวจสอบโครงสร้างโฟลเดอร์/Bin ใน Premiere Pro แบบเจาะจง (รองรับทั้งเรื่องเดียวหรือหลายเรื่องพร้อมกันผ่าน `queries: [...]`) หรือสแกนสต็อกบน Disk: ดูจำนวนคลิป, ดู Sub-bin ทั้งหมด, แยกแยะไฟล์ฟุตเทจใหม่ใน `รอ` (`binUncut`) ออกจากไฟล์ที่ตัดไปแล้วใน `ไฟล์ต้นฉบับ` (`binRecoverable` / `needsRecovery`), ดึงรายการไฟล์ฟุตเทจที่ยังไม่ได้ตัด (`readyToCut`) พร้อมตรวจจับเลขตอนอัตโนมัติ (`detectedEp: "ep3"`, `"ep4"`) และคืนผลตรวจสอบรายคำค้น (`queryAudit`)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `categoryBin` | `string` | optional | ชื่อหรือคำค้นของ Root Bin ใน Premiere Pro (เช่น `"Movies"`, `"TV_Shows"`, `"Anime"`) เพื่อล็อกเป้าสแกนเฉพาะหมวดนั้น 100% ไม่ปนกับหมวดอื่น และช่วยให้คืนผลลัพธ์เร็วระดับ 0.05 วินาที |
  | `rootBin` | `string` | optional | นามแฝง (Alias) ของ `categoryBin` |
  | `binName` | `string` | optional | ชื่อหรือพาธเต็มของ Bin ใน Premiere Pro ที่ต้องการส่องเจาะจง (เช่น `"Movies/Series_A"`) |
  | `binPath` | `string` | optional | นามแฝง (Alias) ของ `binName` |
  | `query` | `string` | optional | คำค้นหาชื่อหรือพาธของ Bin |
  | `queries` | `array` | optional | รายชื่อเรื่องหลายเรื่องพร้อมกัน เช่น `["Series_A", "Series_B"]` |
  | `diskRoot` / `diskPath` | `string` | optional | โฟลเดอร์บน Disk ที่ต้องการสแกนนับจำนวนไฟล์ `.mp4` และสรุปสต็อก (`totalRemaining` + `lowStockShows`) ควบคู่กัน |
  | `diskFilter` | `string` | optional | คำกรองชื่อโฟลเดอร์บน Disk |
  | `excludeDirs` | `string` | optional | รายชื่อโฟลเดอร์ที่ต้องการยกเว้นคั่นด้วยจุลภาค (ตามที่ตั้งค่าในสกิลประจำเครื่อง เช่น `"ลงแล้ว,จบแล้ว"`) |
  | `lowStockThreshold` | `number` | optional | เกณฑ์สต็อกต่ำสำหรับสรุป `lowStockShows` ใน `diskSummary` (`default: 15`) |
  | `scanPremiere` | `boolean` | optional | บังคับให้สแกนเจาะจงใน Premiere Pro แม้จะไม่ได้ระบุ `query` (`default: false`) |
  | `includeShows` | `boolean` | optional | คืนค่าก้อน `shows` สรุปรายเรื่องแบบละเอียด (`default: false` — ตัดออกเป็นค่าเริ่มต้นเพื่อลดขนาด JSON ให้สั้นกระชับ ไม่เด้งเข้า `output.txt`) |
| `smartScope` | `boolean` | optional | ใน v1.8.3 เมื่อส่ง `diskRoot` พร้อม `categoryBin` โดยไม่ใส่ `queries` ระบบจะสแกนเฉพาะ `lowStockShows` บน Disk อัตโนมัติ (`default: true`) |
- **โครงสร้างข้อมูลที่ได้คืนมา (จัดเรียง Disk ขึ้นก่อนเสมอ และตัด shows ซ้ำซ้อนออก):**
  ```json
  {
    "success": true,
    "diskRoot": "D:\\Clips\\Output\\Movies",
    "diskSummary": {
      "totalShows": 10,
      "lowStockCount": 3,
      "lowStockShows": [
        { "name": "เรื่อง A", "totalRemaining": 0 },
        { "name": "เรื่อง B", "totalRemaining": 10 }
      ]
    },
    "diskFolders": [ ... ],
    "readyToCutCount": 1,
    "readyToCut": [ ... ],
    "queryAudit": [ ... ]
  }
  ```

### 7.2 `autolab_pr_prepare_ep`
- **หน้าที่:** เตรียมความพร้อมก่อนเริ่มตัดในคำสั่งเดียว (รองรับทั้งเรื่องเดียวหรือหลายเรื่องพร้อมกันผ่าน `items: [...]`): เปลี่ยนชื่อโฟลเดอร์บน Disk, สร้างโฟลเดอร์ย่อยสำหรับตอนใหม่ (`ep1`, `ep2`...) บน Disk, ลบ Bin `HIGHLIGHTS_` ของตอนเก่าที่ส่งออกไปแล้วใน Premiere Pro, สร้าง Sub-bin `epX` ใน Premiere Pro และย้ายไฟล์ฟุตเทจ 1 คลิปจาก Sub-bin พักไฟล์ (`รอ`) ออกมาเตรียมตัด (หรือดึงจาก `HIGHLIGHTS_/ไฟล์ต้นฉบับ` เมื่อใน `รอ` ไม่มีคลิปใหม่รออยู่)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binName` | `string` | **required** | ชื่อหรือพาธของ Bin หลักใน Premiere Pro |
  | `epName` | `string` | optional | ชื่อ Sub-bin ตอนย่อยที่ต้องการสร้าง/ใช้ (เช่น `"ep1"`, `"ep2"`) |
  | `sourceSubBin` | `string` | optional | ชื่อ Sub-bin ต้นทางที่เก็บไฟล์ฟุตเทจ (หากไม่ระบุ ระบบจะค้นหา Sub-bin ที่มีไฟล์ฟุตเทจยังไม่ได้ตัดให้อัตโนมัติ) |
  | `clipName` | `string` | optional | ชื่อไฟล์ฟุตเทจที่ต้องการย้าย (หากไม่ระบุจะย้ายไฟล์แรกใน `sourceSubBin`) |
  | `renameDiskFrom` | `string` | optional | พาธโฟลเดอร์เดิมบน Disk ที่ต้องการเปลี่ยนชื่อ |
  | `renameDiskTo` | `string` | optional | พาธโฟลเดอร์ใหม่บน Disk หลังเปลี่ยนชื่อ |
  | `createDiskDir` | `string` | optional | พาธโฟลเดอร์ปลายทางบน Disk ที่ต้องการสร้างไว้รอรับไฟล์ Export |
  | `removeOldHighlights` | `boolean` | optional | ลบ Bin `HIGHLIGHTS_` เก่าในโฟลเดอร์เป้าหมายก่อนเริ่มตัด (`default: true`) |
  | `recoverFromOriginalFirst` | `boolean` | optional | ดึงไฟล์ฟุตเทจตัวเต็มจาก `HIGHLIGHTS_/ไฟล์ต้นฉบับ` กลับออกมาก่อนลบ `HIGHLIGHTS_` เมื่อไม่มีคลิปใหม่ใน `รอ` (`default: true`) |
  | `forceRecoverOriginal` | `boolean` | optional | บังคับกู้ไฟล์จาก `HIGHLIGHTS_/ไฟล์ต้นฉบับ` แม้จะมีคลิปใหม่ใน `รอ` (`default: false` เพื่อป้องกันไม่ให้คลิปเก่าไปปนกับคลิปใหม่) |
  | `items` | `array` | optional | ส่งเตรียมหลายเรื่องพร้อมกันใน 1 คำสั่ง |

### 7.3 `autolab_pr_export_ame`
- **หน้าที่:** ส่งออกทุก Sequence ใน Bin `HIGHLIGHTS_` เข้าคิว **Adobe Media Encoder** แบบยกชุดในคำสั่งเดียว พร้อมสั่งเริ่มเรนเดอร์ทันทีใน 0ms
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `highlightsBinPath` | `string` | **required** | พาธหรือชื่อของ Bin `HIGHLIGHTS_` ใน Premiere Pro |
  | `outputDir` | `string` | **required** | โฟลเดอร์ปลายทางบน Disk สำหรับบันทึกไฟล์ `.mp4` ที่เรนเดอร์เสร็จ |
  | `presetPath` | `string` | optional | พาธเต็มของไฟล์ `.epr` preset (หากไม่ระบุจะค้นหา Preset มาตรฐานให้อัตโนมัติ) |
  | `presetName` | `string` | optional | ชื่อไฟล์ `.epr` preset ที่ต้องการค้นหาในเครื่อง |
| `startQueue` | `boolean` | optional | สั่งให้ Media Encoder เริ่มเรนเดอร์ทันทีใน 0ms ผ่าน `app.encoder.startBatch()` (`default: true` ใน v1.8.3 ไม่ต้องรอปุ่มนับถอยหลัง 2 นาที) |

### 7.4 `autolab_call_js`
- **หน้าที่:** รันโค้ด JavaScript ใดๆ ก็ได้ภายในบริบทหน้าต่าง AutoLab CEP Panel โดยตรง (เข้าถึง `window.FrameQueueManager`, `window.AiManager`, `window.NameRefinerChat`, `window.BatchManager`, `window.AutoHighlightsEngine`, และ DOM ทั้งหมดได้ 100%)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `code` | `string` | **required** | โค้ดเนื้อหาฟังก์ชัน JavaScript ที่ต้องการรัน เช่น `"return window.FrameQueueManager.getCount();"` |
  | `args` | `object` | optional | อาร์กิวเมนต์ที่ส่งเข้าไปในตัวแปร `params` ของโค้ด |

### 7.5 `autolab_call_jsx`
- **หน้าที่:** รันโค้ด ExtendScript (`.jsx`) ใดๆ ก็ได้ภายใน Adobe Premiere Pro ผ่านคิว Single-Flight ของ AutoLab (พร้อม `JSON.stringify` polyfill ในตัว)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `script` | `string` | **required** | โค้ด ExtendScript ที่ต้องการรันและคืนค่ากลับมา |
  | `jsxFile` | `string` | optional | ชื่อไฟล์ใน `AutoLab/jsx/` ที่ต้องการโหลดก่อนรัน เช่น `"auto_frame.jsx"` หรือ `"host.jsx"` |
  | `timeoutMs` | `number` | optional | เวลารอสูงสุดมิลลิวินาที (`default: 60000`) |

### 7.6 `autolab_pr_create_bin`
- **หน้าที่:** สร้าง Bin ใหม่แบบ Recursive `mkdir -p` (รองรับพาธลึก เช่น `"หมวดหมู่/Show/ep1"` หรือ `parentBin` + `name`) ไม่เกิด Error หาก Bin มีอยู่แล้ว
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binPath` | `string` | optional | พาธเต็มหรือสัมพัทธ์ของ Bin ที่ต้องการสร้าง (เช่น `"หมวดหมู่/เรื่อง/ep1"`) |
  | `parentBin` | `string` | optional | พาธของ Bin แม่ (ใช้คู่กับ `name`) |
  | `name` | `string` | optional | ชื่อ Bin ที่ต้องการสร้าง |
- **ตัวอย่างการเรียกใช้:**
  - **Native MCP:**
    ```json
    { "binPath": "<หมวดหมู่>/<ชื่อเรื่อง>/ep1" }
    ```
  - **Universal CLI:**
    ```powershell
    node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --call pr_create_bin --arg binPath="<หมวดหมู่>/<ชื่อเรื่อง>/ep1"
    ```

### 7.7 `autolab_pr_delete_bin` *(นามแฝง: `autolab_pr_bin_clean`)*
- **หน้าที่:** ลบ Bin, คลิป หรือ Sequence ใน Premiere Pro แบบ High-Speed Batch Sweep (<150ms) รูดลงถังขยะใบเดียว ไม่สะดุด และรองรับการกวาดล้างตามเงื่อนไข (Wildcard Pattern / Sequence Sweep)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binPath` / `binName` | `string` | optional | พาธหรือชื่อของ Bin หรือไอเทมที่ต้องการลบ |
  | `nodeId` | `string` | optional | NodeId เฉพาะเจาะจงของไอเทมที่ต้องการลบ |
  | `pattern` | `string` | optional | Wildcard หรือ Glob pattern สำหรับกวาดล้างไอเทมใน Bin เช่น `"S*"`, `"HIGHLIGHTS_*"` |
  | `cleanSequences` | `boolean` | optional | กวาดล้าง Sequence ทั้งหมดใน Bin เป้าหมายทิ้งทันที โดยปลอดภัยไม่แตะต้องฟุตเทจ |
  | `cleanHighlights` | `boolean` | optional | กวาดล้างโฟลเดอร์ `HIGHLIGHTS_` ทั้งหมดใน Bin เป้าหมายทิ้งทันที |
  | `force` | `boolean` | optional | ลบ Bin พร้อมของข้างในทั้งหมดแม้จะไม่ใช่โฟลเดอร์ว่าง (`default: true`) |
  | `onlyEmpty` | `boolean` | optional | ลบเฉพาะเมื่อ Bin ว่างเปล่า (`default: false`) |
  | `items` | `array` | optional | ส่งลบหลายรายการพร้อมกันใน 1 คำสั่ง: `[{ binPath, nodeId, pattern, force }]` |
- **ตัวอย่างการเรียกใช้:**
  - **Native MCP:**
    ```json
    // กวาด Sequence ไฮไลท์ S* ทั้งหมดทิ้ง:
    { "binPath": "<หมวดหมู่>/<ชื่อเรื่อง>", "pattern": "S*" }

    // ลบโฟลเดอร์ Bin พร้อมของข้างใน:
    { "binPath": "<หมวดหมู่>/<ชื่อเรื่อง>/HIGHLIGHTS_<ชื่อเรื่อง>", "force": true }
    ```
  - **Universal CLI:**
    ```powershell
    node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --call pr_delete_bin --arg binPath="<หมวดหมู่>/<ชื่อเรื่อง>" --arg pattern="S*"
    node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --call pr_delete_bin --arg binPath="<หมวดหมู่>/<ชื่อเรื่อง>/HIGHLIGHTS_<ชื่อเรื่อง>" --arg force=true
    ```

### 7.8 `autolab_pr_move_item` *(นามแฝง: `autolab_pr_bin_move`)*
- **หน้าที่:** ย้ายคลิป, Sequence หรือ Sub-bin ไปยัง Bin ปลายทาง มาพร้อม `autoCreateTarget: true` (สร้าง Bin ปลายทางอัตโนมัติหากยังไม่มี)
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `from` | `string` | optional | ชื่อคลิป, Sub-bin หรือคำค้นต้นทาง |
  | `to` | `string` | **required** | พาธหรือชื่อ Bin ปลายทาง |
  | `nodeId` | `string` | optional | NodeId เจาะจงของไอเทมต้นทาง |
  | `fromBin` | `string` | optional | พาธ Bin ต้นทางเพื่อจำกัดวงค้นหา |
  | `autoCreateTarget` | `boolean` | optional | สร้าง Bin ปลายทางอัตโนมัติหากยังไม่มี (`default: true`) |
  | `items` | `array` | optional | ย้ายหลายไอเทมพร้อมกัน: `[{ from, to, fromBin, autoCreateTarget }]` |
- **ตัวอย่างการเรียกใช้:**
  - **Native MCP:**
    ```json
    {
      "from": "<ชื่อไฟล์คลิป>.mp4",
      "to": "<หมวดหมู่>/<ชื่อเรื่อง>/ep1",
      "autoCreateTarget": true
    }
    ```
  - **Universal CLI:**
    ```powershell
    node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --call pr_move_item --arg from="<ชื่อไฟล์คลิป>.mp4" --arg to="<หมวดหมู่>/<ชื่อเรื่อง>/ep1"
    ```

### 7.9 `autolab_pr_bin_tree` *(นามแฝง: `autolab_pr_find_bin`)*
- **หน้าที่:** ส่องดูโครงสร้างผัง Bin และคลิปแบบ Bounded Tree พร้อม `nodeId`, `kind` (`BIN`, `CLIP`, `SEQUENCE`) และ `childCount` ป้องกัน Context Explosion 100%
- **พารามิเตอร์:**
  | ชื่อพารามิเตอร์ | ชนิดข้อมูล | บังคับ | คำอธิบาย |
  | :--- | :--- | :---: | :--- |
  | `binPath` / `binName` | `string` | optional | พาธหรือชื่อ Bin ที่ต้องการส่อง (หากไม่ระบุจะส่องจาก Root โปรเจกต์) |
  | `query` | `string` | optional | คำค้นหาชื่อหรือพาธ Bin (นามแฝงของ `binPath`) |
  | `maxDepth` | `number` | optional | ความลึกสูงสุดในการส่อง (`default: 3`) |
  | `includeClips` | `boolean` | optional | รวมคลิปในผลลัพธ์ (`default: true`) |
  | `includeSequences` | `boolean` | optional | แสดงรายการ Sequence ย่อยใน `HIGHLIGHTS_*` ทั้งหมด (`default: false` — สรุปเป็น `sequenceCount` เพื่อความกระชับ) |
  | `includeSystemBins` | `boolean` | optional | แสดงโฟลเดอร์ระบบภายในของ Premiere/AutoLab (`default: false`) |
  | `verbose` | `boolean` | optional | แสดงรายการทุกไอเทมแบบไม่ย่อ (`default: false`) |
- **ตัวอย่างการเรียกใช้:**
  - **Native MCP:**
    ```json
    { "binPath": "<หมวดหมู่>/<ชื่อเรื่อง>", "includeClips": true, "maxDepth": 3 }
    ```
  - **Universal CLI:**
    ```powershell
    node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --call pr_bin_tree --arg binPath="<หมวดหมู่>/<ชื่อเรื่อง>"
    ```


