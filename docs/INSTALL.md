# Step-by-Step Installation & Verification Guide · คู่มือการติดตั้งและตรวจสอบทีละขั้นตอน

**English** · [ภาษาไทย](#-ภาษาไทย)

---

## 🇬🇧 English

### 1. Prerequisites
1. **Adobe Premiere Pro** installed on Windows or macOS.
2. **AutoLab Extension** installed (via `AutoLab_Setup.exe` or development symlink).
3. **Node.js 18+** installed (`node -v`).

### 2. Step 1 — Install the `autolab-premiere` Skill
Run the command matching your AI coding agent:

#### Claude Code / Codex / Cursor / Antigravity / Gemini CLI / OpenCode
```bash
npx skills add https://github.com/Qtpx0/autolab-premiere-skill --skill autolab-premiere
```

#### OpenClaw
```bash
npx clawhub@latest install Qtpx0/autolab-premiere-skill --force
```

#### Manual Git Clone (Universal Fallback)
```bash
git clone https://github.com/Qtpx0/autolab-premiere-skill.git
```

### 3. Step 2 — Connect the 2 Bundled MCP Servers (`462 Tools`)
When you open **Adobe Premiere Pro → Window → Extensions → AutoLab**, AutoLab automatically registers both `autolab` (`30 tools`) and `premiere-pro` (`432 tools`) into detected AI client config files on your machine.

You can also click **🔌 API & MCP** in the top header of AutoLab and click **⚡ Auto-Connect AI Clients** (or copy the JSON configuration manually):

```json
{
  "mcpServers": {
    "autolab": {
      "command": "node",
      "args": [
        "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\AutoLab\\mcp\\autolab-mcp.js"
      ]
    },
    "premiere-pro": {
      "command": "node",
      "args": [
        "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\AutoLab\\mcp\\premiere-pro-mcp\\runtime\\index.js"
      ],
      "env": {
        "PREMIERE_TEMP_DIR": "C:\\Users\\<YOUR_WINDOWS_USER>\\AppData\\Local\\Temp\\premiere-mcp-bridge"
      }
    }
  }
}
```

### 4. Step 3 — Verification Checks
Run these two commands in PowerShell / Terminal while Premiere Pro and the AutoLab panel are open:

```powershell
# 1. Verify AutoLab Bridge (Port 17890) & 30 Tools
node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --status

# 2. List all 30 AutoLab Tools
node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --list-tools
```

---

## 🇹🇭 ภาษาไทย

### 1. สิ่งที่ต้องมีในเครื่องก่อนเริ่ม
1. ติดตั้งโปรแกรม **Adobe Premiere Pro**
2. ติดตั้งโปรแกรม **AutoLab** (ผ่านตัวติดตั้ง `AutoLab_Setup.exe` ซึ่งจะวางไฟล์ MCP ทั้งหมดไว้ที่ `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\` ให้อัตโนมัติ)
3. ติดตั้ง **Node.js เวอร์ชัน 18 ขึ้นไป** (เช็คด้วยคำสั่ง `node -v`)

---

### 2. ขั้นตอนที่ 1 — ติดตั้งสกิลคู่มือควบคุม (`autolab-premiere`)
เพื่อให้เอเจนต์ AI รู้จักขั้นตอนการทำงาน 7 สเต็ปและหยิบใช้เครื่องมือทั้ง 462 ตัวได้อย่างถูกต้องโดยไม่มั่ว ให้ติดตั้งสกิลด้วยวิธีใดวิธีหนึ่งต่อไปนี้:

#### วิธีที่ 1: ก๊อปปี้จากหน้าต่าง `🔌 API & MCP` ในโปรแกรม AutoLab (ง่ายที่สุด แนะนำ!)
1. เปิดโปรแกรม **Premiere Pro** ➔ เปิดหน้าต่าง **AutoLab** (`Window > Extensions > AutoLab`)
2. คลิกปุ่ม **`🔌 API & MCP`** บนแถบด้านบนของหน้าแรก
3. ในหัวข้อ **Skill** กดปุ่ม **`📋 สำเนาส่งให้ AI`** แล้วนำไปวางในช่องแชทของ AI ที่ใช้งานอยู่ได้เลย เอเจนต์จะรันติดตั้งสกิลและเริ่มเชื่อมต่อให้เองทันที

#### วิธีที่ 2: รันคำสั่งติดตั้งผ่าน Terminal
สำหรับ **Claude Code / Codex / Cursor / Antigravity / Gemini CLI / OpenCode**:
```bash
npx skills add https://github.com/Qtpx0/autolab-premiere-skill --skill autolab-premiere
```

สำหรับ **OpenClaw**:
```bash
npx clawhub@latest install Qtpx0/autolab-premiere-skill --force
```

สำหรับ **Hermes Agent**:
```bash
hermes skills install https://github.com/Qtpx0/autolab-premiere-skill/blob/main/skills/autolab-premiere --force
```

---

### 3. ขั้นตอนที่ 2 — เชื่อมต่อเซิร์ฟเวอร์ MCP ทั้ง 2 ตัว (`autolab` 30 Tools + `premiere-pro` 432 Tools)

#### แบบอัตโนมัติ (Zero-Config Auto-Registration)
ทันทีที่เปิดหน้าต่าง AutoLab ใน Premiere Pro (หรือกดปุ่ม **`⚡ ผูกเข้า AI ในเครื่องอัตโนมัติ`** ในหน้าต่าง `🔌 API & MCP`) โปรแกรมจะเขียนตั้งค่าผูก MCP เข้ากับไฟล์ตั้งค่าของ AI ในเครื่องให้อัตโนมัติ:
- **Antigravity:** `~/.gemini/antigravity/mcp_config.json`
- **Cursor:** `~/.cursor/mcp.json`
- **Claude Desktop:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Windsurf:** `~/.codeium/windsurf/mcp_config.json`

*(หลังจากกดผูกครั้งแรก ให้ปิดและเปิดโปรแกรม AI ใหม่ 1 รอบเพื่อโหลดเครื่องมือทั้ง 462 ตัว)*

#### แบบตั้งค่าผ่าน CLI (สำหรับ Claude Code และ Codex CLI)
ก๊อปปี้คำสั่งจากแท็บ **`การตั้งค่าแพลตฟอร์ม (CLI)`** ในหน้าต่าง `🔌 API & MCP` ของ AutoLab ไปรันใน Terminal:

```powershell
# สำหรับ Claude Code
claude mcp add autolab -- node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js"
claude mcp add premiere-pro -e PREMIERE_TEMP_DIR="$env:TEMP\premiere-mcp-bridge" -- node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\premiere-pro-mcp\runtime\index.js"

# สำหรับ Codex CLI
codex mcp add autolab -- node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js"
codex mcp add --env PREMIERE_TEMP_DIR="$env:TEMP\premiere-mcp-bridge" premiere-pro -- node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\premiere-pro-mcp\runtime\index.js"
```

---

### 4. ขั้นตอนที่ 3 — วิธีตรวจสอบว่าเชื่อมต่อสำเร็จ 100%

เมื่อเปิด Premiere Pro และเปิดหน้าต่าง AutoLab แล้ว ให้ลองบอกเอเจนต์ AI ของคุณว่า:

> **"เช็คสถานะการเชื่อมต่อ AutoLab และดูข้อมูลโปรเจกต์ Premiere Pro ที่เปิดอยู่ให้หน่อย"**

เอเจนต์ที่ติดตั้งครบสมบูรณ์จะเรียก:
1. `autolab_get_status` ➔ รายงานหน้าจอปัจจุบันของ AutoLab, สถานะผู้ใช้ และจำนวนคลิปในคิว
2. `get_project_info` ➔ รายงานชื่อไฟล์ `.prproj` ที่เปิดอยู่, จำนวน Sequence ทั้งหมด และ Active Sequence ปัจจุบัน

หรือทดสอบด้วยตัวเองผ่าน PowerShell ใน 5 วินาที:
```powershell
node "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\AutoLab\mcp\autolab-mcp.js" --status
```
หากเชื่อมต่อสำเร็จจะแสดง JSON `"success": true` พร้อมรายละเอียดของพาเนล AutoLab ทันที!
