# dsh-autolab-premiere

DeepSeek Harness bundle for **AutoLab CEP Extension + Adobe Premiere Pro**.
ต่อ MCP ครบทั้ง **38 AutoLab tools (41 รวม aliases)** และ **434 Premiere Pro tools** เข้า DSH พร้อมแปลง
"กฎเหล็ก" ของสกิลให้เป็น **guard ที่บังคับได้จริง** — skill บอกว่าห้ามทำ X, bundle นี้ทำให้ทำ X ไม่ได้

## มีอะไรในกล่อง

| ส่วน | กลไก | ทำอะไร |
| :--- | :--- | :--- |
| `mcp-autolab` | `@deepseek-ai/dsh-mcp-client` (stdio) | 38 AutoLab tools (41 รวม aliases) ผ่าน HTTP RPC ไปยัง CEP bridge (`1–7 ms`, พอร์ตอ่านสดจาก `autolab-bridge-info.json`) |
| `mcp-premiere-pro` | `@deepseek-ai/dsh-mcp-client` (stdio) | 434 Premiere Pro tools ผ่าน CEP file queue (`%TEMP%\premiere-mcp-bridge`) |
| `autolab-premiere` | host plugin (`index.js`) | guard + operator contract + bundled skill |

เครื่องมือจะโผล่ในชื่อ `mcp__autolab__pr_inspect`, `mcp__premiere-pro__list_project_items` ตามแบบแผนของ DSH

## Guard ที่บังคับจริง (`lib/guards.js`)

| Rule | ค่าเริ่มต้น | บล็อกอะไร |
| :--- | :--- | :--- |
| `banRawPremiereInspection` | on | `list_project_items`, `get_bin_contents`, `search_project_items`, `get_full_project_overview` → ต้องใช้ `pr_inspect` |
| `banAdHocPremiereScripts` | on | `node -e/--eval` ที่แตะ Premiere/AutoLab และการเขียน `.jsx` ad-hoc |
| `requireGeminiAudioEngine` | on | `ah_configure` ที่ตั้ง engine อื่นนอกจาก `gemini_audio` (เช่น Whisper) |
| `autoCutOffForMovies` | on | งานหนัง/ซีรีส์ที่เปิด `autoCutState` (ต้องเป็น `0`) |
| `blockStaleHighlightsExport` | on | `pr_export_ame` ขณะที่หลักฐานล่าสุดบอก `needsRecovery: true` และยังไม่ผ่าน `pr_prepare_ep` |
| `blockHighlightsExportWithoutFreshCut` | **off** | export ออกจาก `HIGHLIGHTS_` เดิมทั้งที่ session นี้ยังไม่ตัดใหม่ (เปิดเมื่ออยากเข้มขึ้น) |
| `blockStaleOutputTxt` | on | อ่าน `output.txt` ที่ค้างจาก session เก่า |
| `banAutolabSourceReading` | **off** | อ่านโค้ด `AutoLab/js/**` (ปิดไว้เพราะยังต้องพัฒนาส่วนขยายอยู่) |

Gate ที่ต้องอาศัย "หลักฐาน" (`needsRecovery`) จะ **fail open** — ถ้าไม่เคยเห็นหลักฐานเลย มันไม่บล็อก
เพราะ guard ที่เดาแล้วบล็อกจะทำร้ายคนทำงานจริง

## ติดตั้ง

**A. โฟลเดอร์ในเครื่อง** (ตรงไปตรงมาที่สุด)

```powershell
# จาก repo นี้ — ติดตั้งโฟลเดอร์ dsh-plugin เข้า profile ปัจจุบัน
dsh plugin --profile $env:DSH_PROFILE add "<repo>\dsh-plugin"
```

หรือ DSH → **Plugins → Add plugin** → วางที่อยู่/พาธของ bundle
จากนั้น **restart DeepSeek Harness** (symptom: toggle off/on ไม่ reload โมดูล)

**B. จาก GitHub** — เมื่อ mirror โฟลเดอร์นี้เป็น repo ของตัวเองแล้ว วาง URL ได้เลย:

```powershell
dsh plugin --profile $env:DSH_PROFILE add https://github.com/<owner>/dsh-autolab-premiere
```

## ตั้งค่า

แก้ใน row ของ bundle นี้ใน `cordis.patch.yml` (หรือ profile patch ของคุณ):

```yaml
- id: autolab-premiere
  name: 'dsh-autolab-premiere'
  config:
    enableGuard: true
    bundledSkill: true
    skillName: autolab-premiere
    rules:
      blockHighlightsExportWithoutFreshCut: true
      banAutolabSourceReading: false
    prompt:
      enabled: true
      order: 655
```

ปิด guard ทั้งชุดชั่วคราว: `enableGuard: false` (จะ log เตือนไว้ ไม่เงียบ)

## สกิล 2 ชั้น

- **สกิลกลาง `autolab-premiere`** — แถมมากับ bundle (อ่านสดจาก `skills/autolab-premiere/SKILL.md` ใน repo นี้
  ไม่มีสำเนา จึงไม่ drift) ใช้กับทุกเครื่อง
- **สกิลเวิร์กโฟลว์ประจำเครื่อง** (เช่น `autolab-premiere-automation`) — ให้ DSH ค้นพบเองจาก
  `<project>/.agents/skills`, `~/.agents/skills` หรือ `~/.dsh/skills` (hot-reload ไม่ต้อง restart)
  bundle นี้จงใจ **ไม่** คัดลอกสกิลส่วนตัวมาไว้ข้างใน

## ถอน / ย้อนกลับ

```powershell
dsh plugin --profile $env:DSH_PROFILE remove dsh-autolab-premiere
```

หรือ DSH → Plugins → ถอน แล้ว restart — ตัวสกิลและ Antigravity ไม่ถูกแตะเลย

## ทดสอบ

```powershell
node scripts/smoke-test.mjs
```

ตรวจ 30 กว่าข้อ: guard ทุกกฎ deny ถูกตัว, คำสั่งที่ถูกต้องผ่าน, gate fail open,
prompt section ลงทะเบียน, และ host plugin โหลดได้โดยไม่ต้องมี DSH
