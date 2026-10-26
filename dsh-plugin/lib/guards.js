/**
 * Ironclad guards for the AutoLab + Premiere Pro operator workflow.
 *
 * Every rule here is taken from the SKILL.md "กฎเหล็ก" section and the workspace
 * GEMINI.md. A guard is synchronous and can only deny, so each rule is a hard
 * precondition rather than advice the model can drift away from:
 *
 *   banRawPremiereInspection              stock/Bin questions go through pr_inspect
 *   banAdHocPremiereScripts               no `node -e` / hand-written ExtendScript
 *   requireGeminiAudioEngine              Auto Highlights never falls back to Whisper
 *   autoCutOffForMovies                   movie/series highlights keep autoCutState 0
 *   blockStaleHighlightsExport            needsRecovery footage is recovered first
 *   blockStaleOutputTxt                   no reading a leftover output.txt
 *   banAutolabSourceReading (opt-in)      the agent is an operator, not a maintainer
 *
 * Rules a guard cannot decide from the call itself (the export gate) read state
 * recorded by `observeCall()` and `observeResult()`. That state is a derived
 * cache: when no evidence was ever observed the gate fails OPEN, because a guard
 * must never brick the operator on a guess.
 */

/** Shell tools whose command line the script rules inspect. */
export const SHELL_TOOLS = new Set(['bash', 'pwsh', 'cmd', 'powershell', 'terminal', 'wsl']);

/** Built-in file-read tool names. */
const READ_TOOLS = new Set(['read', 'read_file', 'readfile']);

/**
 * The operator contract injected into every request. Deliberately ~10 lines: the
 * full SOP lives in the skill and loads on demand, so this stays cheap and
 * prompt-cacheable.
 */
export const DEFAULT_PROMPT = `
### AutoLab + Premiere Pro — Operator Contract (บังคับโดย guard):
1. เช็คสต็อก / ส่อง Bin (One-Call Fast-Path < 1s) → เรียก \`pr_inspect\` (\`autolab_pr_inspect\`) เพียง 1 ครั้งเดียว (\`{ diskRoot, categoryBin, excludeDirs: "จบแล้ว,ลงแล้ว", lowStockThreshold: 25, scanPremiere: true }\`) แล้วสรุปตารางทันที! ห้ามใช้ \`list_project_items\`, \`get_bin_contents\`, \`search_project_items\`, \`get_full_project_overview\`, ห้ามเรียก \`pr_bin_tree\` กวาดทั้งหมวดงานจนล้นลง \`output.txt\`, และห้ามรันคำสั่ง Shell (\`Get-ChildItem\`) นับไฟล์บน Disk ซ้ำซ้อนเด็ดขาด!
2. จัดการ Bin ใน Premiere Pro (สร้าง/ลบ/ย้าย/ส่องผัง): ใช้ \`pr_create_bin\`, \`pr_delete_bin\`, \`pr_move_item\`, \`pr_bin_tree\` ห้ามเขียนสคริปต์ shell (\`node -e\`, สร้างไฟล์ \`.jsx\`) หากจำเป็นต้องซ่อม State นอกเหนือจากนี้ ให้ใช้ \`autolab_call_jsx\` ยิง ExtendScript สั่ง Premiere Pro DOM ตรงตามข้อ 0 ของ SKILL.md
3. Auto Highlights: \`engineMode: "gemini_audio"\` เสมอ (ห้าม Whisper); งานหนัง/ซีรีส์ \`autoCutState: 0\` เสมอ
4. เจอ \`needsRecovery: true\` (ฟุตเทจยังอยู่ใน \`ไฟล์ต้นฉบับ\`) → ห้าม export sequence เก่า ต้องรัน \`pr_prepare_ep\` (\`recoverFromOriginalFirst\`) แล้วตัดใหม่
5. ห้ามอ่าน \`output.txt\` ที่ค้างจาก session เก่า
6. รายงานความคืบหน้า 1 บรรทัดก่อนเริ่มแต่ละ step
7. ขอบเขตคำสั่งเช็คสต็อก: ถ้าสั่ง "เช็ครายการ" ให้ตรวจเฉพาะโฟลเดอร์หมวดรายการตามสกิลประจำเครื่อง (ใส่ excludeDirs ข้ามโฟลเดอร์ที่โพสต์ไปแล้ว/โฟลเดอร์หมวดอื่นตามสกิลประจำเครื่อง) ห้ามไปสแกนโฟลเดอร์หมวดหนังเด็ดขาด! จะสแกนหมวดหนังก็ต่อเมื่อสั่งคำว่า "หนัง" หรือ "ทั้งหมด" เท่านั้น
8. Auto Frame & Auto Scale: เมื่อเรียกใช้ Master Profile หรือใส่ Frame/Promo ให้ส่ง \`autoFit: true\` เสมอเป็นค่าเริ่มต้น เพื่อให้ระบบ Auto Scale วัดช่องใสและสแกนขอบดำจัดขนาดมิลลิเมตรให้อัตโนมัติ (เว้นแต่ผู้ใช้สั่งล็อกสเกลตายตัว ค่อยส่ง \`autoFit: false\`)
9. Inspection Query Audit & Status Interpretation: ตรวจสอบฟิลด์ \`queryAudit\` ในผลลัพธ์ของ \`pr_inspect\` เสมอ; หากเรื่องใดขึ้น \`found: false\` แต่มี \`closestBins\` ให้ถามผู้ใช้สั้นๆ 1 บรรทัดเพื่อยืนยันชื่อเรื่อง ห้ามมโนสรุปว่าไม่มีบินเด็ดขาด! ทั้งนี้ ตอนเช็คสต็อก เฉพาะเรื่องที่ \`waiting > 0\` (\`readyToCut\`) เท่านั้นที่แปลว่ามีฟุตเทจดิบใหม่พร้อมตัดทันที ส่วนเรื่องที่ \`waiting: 0\` (แม้จะขึ้น \`ALL_CUT\` หรือ \`NEEDS_RECOVERY\` ที่มี \`recoverable > 0\`) แปลว่าฟุตเทจถูกตัดผ่าน Auto Highlights และย้ายเก็บเข้า \`ไฟล์ต้นฉบับ\` ไปหมดแล้ว (ไม่มีฟุตดิบใหม่รอตัด) ต้องรายงานว่าตัดครบแล้ว/ต้องโหลดฟุตเทจใหม่มาเติม ห้ามสรุปหลอกว่าพร้อมตัดใหม่เด็ดขาด (กู้ไฟล์จาก \`ไฟล์ต้นฉบับ\` เมื่อผู้ใช้สั่งให้กู้มาตัดซ้ำเท่านั้น)
10. Zero-Delay Disk Creation & Strict Prefix Matching: การจับคู่โฟลเดอร์บน Disk ต้องดู "ชื่อเรื่องหลักส่วนหน้า" (Prefix ก่อนเครื่องหมาย - หรือ - -) เท่านั้น ห้ามนำชื่อเรื่องที่จะตัดไปจับคู่กับข้อความ Note/Memo ด้านหลังเด็ดขาด (โฟลเดอร์ที่มี Note ต่อท้าย ยังคงเป็นของเรื่องหลักส่วนหน้า ห้ามแตะ ห้ามเคลม และห้าม Rename เด็ดขาด); หากบน Disk ยังไม่มีโฟลเดอร์ที่ขึ้นต้นด้วยชื่อเรื่องนั้นตรงๆ ➔ ถือว่าเป็นเรื่องใหม่ที่ยังไม่มีโฟลเดอร์ ให้สร้างโฟลเดอร์ใหม่ชื่อคลีน (<ชื่อเรื่อง>) ทันที แล้วลุยต่อจนจบ ห้ามหยุดถาม และห้ามแย่ง/Rename โฟลเดอร์เรื่องอื่นมาใช้เด็ดขาด! (การ Rename ป้ายสถานะ อนุญาตเฉพาะโฟลเดอร์ของเรื่องตัวเองที่มี "- - จะหมด" ต่อท้ายเท่านั้น)
11. Central Raw Pool ➔ Work Bin Routing: ฟุตดิบรวมอยู่ที่ <เรื่อง>/รอ เสมอ; เมื่อสั่งตัดเพจย่อย (<เรื่อง> - <เพจ/คนตัด>) หรือตอนย่อย (epX) ให้ตรวจสอบใน Work Bin ก่อน หากว่างให้ใช้ pr_move_item ดึงคลิป 1 ตอนจาก <เรื่อง>/รอ มาที่ Work Bin ปลายทาง (หากในคลังกลางหมดให้หยุดรายงานทันที ห้ามเดาหรือสลับไปดึงเรื่องอื่น); ห้ามตัดในคลังกลาง และลบ HIGHLIGHTS_ เฉพาะใน Work Bin ตัวเองเท่านั้น ห้ามแตะต้อง HIGHLIGHTS_ ของเพจหลักหรือเพจอื่นเด็ดขาด!
ก่อนเริ่มงาน Premiere ให้โหลดสกิล \`autolab-premiere\` (กลาง) หรือสกิลเวิร์กโฟลว์ประจำเครื่องก่อนเสมอ
`;

/** Default row config for the whole bundle. */
export const DEFAULT_CONFIG = {
  enableGuard: true,
  rules: {
    banRawPremiereInspection: true,
    banAdHocPremiereScripts: true,
    requireGeminiAudioEngine: true,
    autoCutOffForMovies: true,
    blockStaleHighlightsExport: true,
    blockHighlightsExportWithoutFreshCut: false,
    blockStaleOutputTxt: true,
    banAutolabSourceReading: false,
  },
  exportGate: { enabled: true },
  bundledSkill: true,
  skillName: 'autolab-premiere',
  prompt: { enabled: true, order: 655, text: DEFAULT_PROMPT, extra: '' },
};

/** Per-session derived state. Plain JSON so it could be checkpointed later. */
export function createState() {
  return {
    needsRecovery: false,
    recovered: false,
    freshCut: false,
    preparedEp: false,
    inspectedAt: 0,
    exportedAt: 0,
    observedResults: 0,
  };
}

/**
 * MCP tools reach the model as `mcp__<serverName>__<rawName>`; built-ins keep
 * their bare name. Guards must match the raw name so a rename of the server
 * namespace (or a direct CLI-style call) cannot sidestep a rule.
 *
 * @param {string} name
 * @returns {string}
 */
export function rawToolName(name) {
  const value = String(name ?? '');
  const match = /^mcp__[A-Za-z0-9_-]{1,32}__(.+)$/.exec(value);
  return match ? match[1] : value;
}

/**
 * Build a case-insensitive matcher for raw tool names. The optional prefixes keep
 * one rule working across the names the AutoLab documentation uses
 * (`pr_inspect`, `autolab_pr_inspect`) and the Premiere Pro server uses.
 *
 * @param {...string} bases
 * @returns {RegExp}
 */
function matcher(...bases) {
  return new RegExp(`^(?:autolab_|premiere-?pro_|premiere_)?(?:${bases.join('|')})$`, 'i');
}

const INSPECTION_TOOLS = matcher(
  'list_project_items',
  'list_project_items_by_bin',
  'get_bin_contents',
  'search_project_items',
  'get_full_project_overview',
);
const AH_CONFIGURE = matcher('ah_configure', 'ah_set_config', 'ah_config');
const AH_RUN = matcher('ah_run', 'ah_start');
const AH_BUILD = matcher('ah_build_sequences', 'ah_transcribe', 'ah_analyze');
const INSPECT = matcher('pr_inspect', 'inspect');
const PREPARE_EP = matcher('pr_prepare_ep', 'prepare_ep');
const EXPORT_AME = matcher('pr_export_ame', 'export_ame');
const PIPELINE = matcher('af_pipeline', 'af_start_queue', 'af_queue_add', 'ah_queue_add');

/** Rules whose ban is a plain tool-name match. */
const SOURCE_PATH_HINT = /(?:^|[\\/])AutoLab[\\/]js[\\/]|CEP[\\/]extensions[\\/]AutoLab[\\/]js[\\/]/i;

function deny(text) {
  return `[AUTOLAB-PREMIERE GUARD] ${text}`;
}

/**
 * Build the guard function registered on `ctx.tools.guard`.
 *
 * @param {Object} config - merged bundle config
 * @param {Object} state - per-session state from createState()
 * @returns {(exec: Object) => string | undefined}
 */
export function createGuard(config, state = createState()) {
  const rules = config.rules ?? {};
  const shells = new Set((config.shellTools ?? [...SHELL_TOOLS]).map((s) => s.toLowerCase()));

  return function guard(exec) {
    // Contract of the object DSH hands to a guard: { token, callId, rootCallId,
    // name, signal, agent?, parent?, schema?, arguments }. There is no `tool` and
    // no `args` field — reading `exec.args` silently yields undefined.
    const fullName = String(exec?.name ?? '');
    const raw = rawToolName(fullName);
    const args = isPlainObject(exec?.arguments) ? exec.arguments : {};
    const command = String(args.command ?? args.cmd ?? args.script ?? '');
    const verdict = evaluate({ fullName, raw, args, command, rules, shells, state });
    if (verdict) return verdict;
    observeCall(state, raw, args);
    return undefined;
  };
}

/** Run every enabled rule in order; the first denial wins. */
function evaluate({ fullName, raw, args, command, rules, shells, state }) {
  // 1 — Stock/Bin inspection must use pr_inspect.
  if (rules.banRawPremiereInspection !== false && INSPECTION_TOOLS.test(raw)) {
    return deny(
      `ห้ามใช้ ${raw} สำหรับเช็คสต็อกหรือส่อง Bin — ใช้ pr_inspect (เร็ว ~100 เท่า, output ไม่ล้น): ` +
        `{"queries":["<ชื่อเรื่อง>"],"categoryBin":"<หมวดหมู่>"} ` +
        `(ปิดชั่วคราว: config.rules.banRawPremiereInspection: false)`,
    );
  }

  // 2 — No ad-hoc scripts driving Premiere.
  if (rules.banAdHocPremiereScripts !== false && command && shells.has(fullName.toLowerCase())) {
    const premiereish = /premiere|autolab|cep|extendscript|mcp_bridge|\.prproj|\.jsx/i.test(command);
    const adHocNode = /\bnode\s+(?:-e|--eval|-p|--print)\b/i.test(command);
    const writesJsx = /\.jsx\b/i.test(command) && /\b(set-content|out-file|add-content|new-item)\b/i.test(command);
    if (adhoc(premiereish, adHocNode) || writesJsx) {
      return deny(
        'ห้ามสั่ง Premiere/AutoLab ด้วยสคริปต์ ad-hoc (node -e / ExtendScript) — ใช้ MCP tools (`mcp__autolab__*`) ' +
          'หรือ CLI มาตรฐาน `node "<AutoLab>/mcp/autolab-mcp.js" --call <tool> --arg k=v` เท่านั้น ' +
          '(ปิดชั่วคราว: config.rules.banAdHocPremiereScripts: false)',
      );
    }
  }

  // 3 — Auto Highlights must run the Gemini Direct Audio brain.
  if (rules.requireGeminiAudioEngine !== false && AH_CONFIGURE.test(raw)) {
    const engine = String(args.engineMode ?? args.engine ?? args.brain ?? '');
    if (engine && !/gemini[_-]?audio|direct[_-]?audio/i.test(engine)) {
      return deny(
        `Auto Highlights ต้องใช้ engineMode: "gemini_audio" (ได้รับ "${engine}") — ห้าม Whisper Pipeline เด็ดขาด ` +
          '(ปิดชั่วคราว: config.rules.requireGeminiAudioEngine: false)',
      );
    }
  }

  // 4 — Movie/series highlights must keep AutoCut off.
  if (rules.autoCutOffForMovies !== false && (AH_CONFIGURE.test(raw) || AH_RUN.test(raw))) {
    const content = String(args.contentMode ?? args.preset ?? args.mode ?? args.contentType ?? '');
    const isMovie = /movie|film|series|drama|หนัง|ซีรีส์|ละคร/i.test(content);
    const autoCut = args.autoCutState;
    const autoCutOn = autoCut === 1 || autoCut === true || autoCut === '1' || autoCut === 'true';
    if (isMovie && autoCutOn) {
      return deny(
        'งานหนัง/ซีรีส์ต้องตั้ง autoCutState: 0 เสมอ (AutoCut จะตัดจังหวะดนตรีและอารมณ์ฉากขาด) ' +
          '(ปิดชั่วคราว: config.rules.autoCutOffForMovies: false)',
      );
    }
  }

  // 5 — Never export sequences whose footage is still parked in ไฟล์ต้นฉบับ.
  if (rules.blockStaleHighlightsExport !== false && EXPORT_AME.test(raw) && state.needsRecovery && !state.recovered) {
    return deny(
      'pr_inspect พบ needsRecovery: true (ฟุตเทจยังอยู่ใน `ไฟล์ต้นฉบับ`) — ห้าม export sequence เก่า ' +
        'ให้รัน pr_prepare_ep (recoverFromOriginalFirst) ดึงฟุตเทจออกมา ล้าง HIGHLIGHTS_ เก่า แล้วตัดใหม่ก่อน ' +
        '(ปิดชั่วคราว: config.rules.blockStaleHighlightsExport: false)',
    );
  }

  // 5b — Opt-in: exporting straight out of an old HIGHLIGHTS_ bin in a session that
  // never produced a fresh cut. Off by default because a direct user order
  // ("มีไฟล์อยู่แล้ว export ให้หน่อย") is legitimate and a guard cannot hear it.
  if (rules.blockHighlightsExportWithoutFreshCut === true && EXPORT_AME.test(raw)) {
    const bin = String(args.highlightsBinPath ?? args.binPath ?? args.sequenceName ?? '');
    if (/HIGHLIGHTS_/i.test(bin) && !state.freshCut) {
      return deny(
        'ยังไม่มีการตัดใหม่ใน session นี้ — ยืนยันกับผู้ใช้ว่าต้องการ export ของเดิมจริง หรือรัน Auto Highlights ก่อน',
      );
    }
  }

  // 6 — A leftover output.txt is stale by definition.
  if (rules.blockStaleOutputTxt !== false && READ_TOOLS.has(fullName.toLowerCase())) {
    const path = String(args.file_path ?? args.path ?? args.file ?? '');
    if (/(?:^|[\\/])output\.txt$/i.test(path)) {
      return deny(
        'ห้ามอ่าน output.txt ที่ค้างจาก session เก่า — มันเป็นขยะ ไม่ใช่ข้อมูลปัจจุบัน ' +
          'ใช้ pr_inspect หรือเครื่องมือ AutoLab ที่คืนค่าสด ๆ แทน (ปิดชั่วคราว: config.rules.blockStaleOutputTxt: false)',
      );
    }
  }

  // 7 — Opt-in: the operator must not read the extension source.
  if (rules.banAutolabSourceReading === true) {
    const touched = String(args.file_path ?? args.path ?? args.pattern ?? args.command ?? '');
    if (SOURCE_PATH_HINT.test(touched)) {
      return deny(
        'ห้ามอ่านโค้ดต้นทาง AutoLab/js/** ในบทบาทผู้ปฏิบัติงาน — เรียก MCP tools ตาม SOP แทน',
      );
    }
  }

  return undefined;
}

function adhoc(premiereish, adHocNode) {
  return premiereish && adHocNode;
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Record the call sequence the export gate reasons about. */
function observeCall(state, raw, args) {
  if (INSPECT.test(raw)) state.inspectedAt = Date.now();
  if (PREPARE_EP.test(raw)) {
    state.preparedEp = true;
    state.recovered = true;
    state.needsRecovery = false;
  }
  if (PIPELINE.test(raw) || AH_RUN.test(raw) || AH_BUILD.test(raw)) state.freshCut = true;
  if (EXPORT_AME.test(raw)) state.exportedAt = Date.now();
  if (PREPARE_EP.test(raw) && args.recoverFromOriginalFirst === false) state.recovered = false;
}

/**
 * Read `needsRecovery` evidence out of a tool result.
 *
 * The `tools/result` payload shape is not part of this plugin's contract, so this
 * scans a serialized form instead of a fixed path: any payload mentioning
 * `"needsRecovery":true` arms the export gate, and a recovery marker clears it.
 * When the payload never matches, the gate stays open — never brick the operator.
 *
 * @param {Object} state
 * @param {unknown} payload
 */
export function observeResult(state, payload) {
  let text;
  try {
    text = typeof payload === 'string' ? payload : JSON.stringify(payload ?? {});
  } catch {
    return;
  }
  if (!text) return;
  if (text.length > 2_000_000) text = text.slice(0, 2_000_000);
  state.observedResults += 1;
  // A serialized payload escapes inner quotes, so the marker matches with or
  // without a leading backslash: `"needsRecovery":true` and `\"needsRecovery\":true`.
  if (/\\?"?needsRecovery\\?"?\s*:\s*true/i.test(text)) {
    state.needsRecovery = true;
    state.recovered = false;
  } else if (/\\?"?needsRecovery\\?"?\s*:\s*false/i.test(text)) {
    state.needsRecovery = false;
  }
  if (/recoverFromOriginalFirst|recoveredFromOriginal|removedHighlightsBins|recoveredClips/i.test(text)) {
    state.recovered = true;
    state.needsRecovery = false;
  }
}

/** Rule names that are actually enabled, for the activation log line. */
export function describeRules(config) {
  const rules = config?.rules ?? DEFAULT_CONFIG.rules;
  const enabled = Object.entries(rules)
    .filter(([, value]) => value === true)
    .map(([key]) => key);
  return enabled.length > 0 ? enabled : ['none'];
}
