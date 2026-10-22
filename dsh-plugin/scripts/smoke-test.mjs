/**
 * Zero-dependency smoke test for the dsh-autolab-premiere bundle.
 *
 *   node scripts/smoke-test.mjs
 *
 * Proves the contract the bundle declares: the host plugin loads, every iron rule
 * denies what it claims to deny, legitimate operator calls stay untouched, and the
 * bundled skill body is discoverable next to the package.
 */

import { createGuard, createState, observeResult, rawToolName, describeRules } from '../lib/guards.js';
import { resolveSkillDir } from '../lib/skill.js';

const failures = [];
let checked = 0;

function ok(label, condition, detail = '') {
  checked += 1;
  if (!condition) failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
}

/** Build the guard with a state the test can arm. */
const state = createState();
const guard = createGuard({}, state);

const call = (name, args = {}) => guard({ name, arguments: args, callId: 'test', token: 'test' });

// ── name normalization ────────────────────────────────────────────────────────
ok('rawToolName strips the MCP namespace', rawToolName('mcp__premiere-pro__list_project_items') === 'list_project_items');
ok('rawToolName keeps bare built-ins', rawToolName('pwsh') === 'pwsh');

// ── rule 1: raw inspection is denied, pr_inspect is not ───────────────────────
ok('denies mcp__premiere-pro__list_project_items', Boolean(call('mcp__premiere-pro__list_project_items')));
ok('denies get_bin_contents', Boolean(call('mcp__premiere-pro__get_bin_contents', { binName: 'รอ' })));
ok('allows pr_inspect', call('mcp__autolab__pr_inspect', { queries: ['ทองเนื้อเก้า'] }) === undefined);

// ── rule 2: ad-hoc scripts driving Premiere are denied ────────────────────────
ok(
  'denies node -e against AutoLab',
  Boolean(call('pwsh', { command: 'node -e "const x=require(\'./AutoLab/js/core/mcp_bridge.js\')"' })),
);
ok('allows the documented CLI fallback', call('pwsh', { command: 'node "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions\\AutoLab\\mcp\\autolab-mcp.js" --call pr_inspect' }) === undefined);
ok('allows autolab_call_jsx for state repair', call('mcp__autolab__call_jsx', { script: 'app.project.rootItem' }) === undefined);
ok('allows pr_move_item for pulling from raw pool', call('mcp__autolab__pr_move_item', { fromBin: 'Show/รอ', to: 'Show - Page2' }) === undefined);
ok('allows unrelated shell work', call('pwsh', { command: 'node -e "console.log(1+1)"' }) === undefined);

// ── rule 3: engine must be Gemini Direct Audio ────────────────────────────────
ok('denies whisper engine', Boolean(call('mcp__autolab__ah_configure', { engineMode: 'whisper' })));
ok('allows gemini_audio engine', call('mcp__autolab__ah_configure', { engineMode: 'gemini_audio', preset: 'show' }) === undefined);
ok('allows a preset that sets the engine itself', call('mcp__autolab__ah_configure', { preset: 'show' }) === undefined);

// ── rule 4: AutoCut stays off for movies ──────────────────────────────────────
ok('denies autoCut on a movie preset', Boolean(call('mcp__autolab__ah_configure', { preset: 'movie', autoCutState: 1 })));
ok('allows autoCut 0 on a movie preset', call('mcp__autolab__ah_configure', { preset: 'movie', autoCutState: 0 }) === undefined);

// ── rule 6: a leftover output.txt is never read ───────────────────────────────
ok('denies reading output.txt', Boolean(call('read', { file_path: 'G:\\Dev\\pi\\output.txt' })));
ok('allows reading a normal file', call('read', { file_path: 'G:\\Dev\\pi\\SKILL.md' }) === undefined);

// ── rule 5: the stale-export gate ─────────────────────────────────────────────
ok('export is allowed before any evidence', call('mcp__autolab__pr_export_ame', { highlightsBinPath: 'ก.หนัง/x/HIGHLIGHTS_x' }) === undefined);
observeResult(state, { content: [{ type: 'text', text: '{"readyToCut":[{"show":"x","needsRecovery":true}]}' }] });
ok('result evidence arms the gate', state.needsRecovery === true);
ok(
  'export is denied while footage sits in ไฟล์ต้นฉบับ',
  Boolean(call('mcp__autolab__pr_export_ame', { highlightsBinPath: 'ก.หนัง/x/HIGHLIGHTS_x' })),
);
ok('pr_prepare_ep is allowed', call('mcp__autolab__pr_prepare_ep', { items: [{ show: 'x' }] }) === undefined);
ok('recovery clears the gate', state.recovered === true && state.needsRecovery === false);
ok('export is allowed again after recovery', call('mcp__autolab__pr_export_ame', { highlightsBinPath: 'ก.หนัง/x/HIGHLIGHTS_x' }) === undefined);

// ── fresh state: the gate fails open ──────────────────────────────────────────
const cold = createGuard({}, createState());
ok('gate fails open with no evidence', cold({ name: 'mcp__autolab__pr_export_ame', arguments: {} }) === undefined);

// ── rejections must be actionable ─────────────────────────────────────────────
const message = call('mcp__premiere-pro__list_project_items');
ok('denial carries the guard prefix', typeof message === 'string' && message.startsWith('[AUTOLAB-PREMIERE GUARD]'));
ok('denial names the replacement tool', typeof message === 'string' && message.includes('pr_inspect'));

// ── the bundle ships a readable skill body ───────────────────────────────────
const skillDir = resolveSkillDir();
ok('bundled skill body is discoverable', Boolean(skillDir), 'expected ../skills/autolab-premiere next to the package');

// ── the host plugin loads and declares its gate ──────────────────────────────
const plugin = await import('../index.js');
ok('plugin exports its cordis name', plugin.name === 'autolab-premiere');
ok('plugin injects tools and systemPrompt', Array.isArray(plugin.inject) && plugin.inject.includes('tools') && plugin.inject.includes('systemPrompt'));
ok('plugin exports apply()', typeof plugin.apply === 'function');

// apply() against a fake context must register a guard, a prompt section and a skill.
const registered = { guards: 0, sections: [], providers: 0 };
const fakeCtx = {
  logger: { info() {}, warn() {} },
  tools: { guard() { registered.guards += 1; } },
  systemPrompt: { section(s) { registered.sections.push(s); } },
  on() {},
  get(name) {
    if (name === 'skills') {
      return { registerProvider() { registered.providers += 1; return () => {}; } };
    }
    return undefined;
  },
  effect(cb) { return cb(); },
};
plugin.apply(fakeCtx, {});
ok('apply() registers one guard', registered.guards === 1);
ok('apply() registers one prompt section', registered.sections.length === 1 && registered.sections[0].name === 'autolab-premiere:operator-contract');
ok('apply() registers the bundled skill provider', registered.providers === 1);
ok('default rule set is reported', describeRules({}).length >= 5, describeRules({}).join(','));

// prompt.extra is appended after the shipped contract (profile-specific tool names
// and routing keywords) and never replaces it.
plugin.apply(fakeCtx, { prompt: { extra: 'EXTRA-MARK' } });
const withExtra = registered.sections[1];
ok('prompt.extra is appended', typeof withExtra?.text === 'string' && withExtra.text.includes('EXTRA-MARK'));
ok('prompt.extra keeps the shipped contract', typeof withExtra?.text === 'string' && withExtra.text.includes('Operator Contract'));
ok('shipped contract includes Rule 11 Central Raw Pool routing', typeof withExtra?.text === 'string' && withExtra.text.includes('Central Raw Pool'));

// ── report ───────────────────────────────────────────────────────────────────
if (failures.length > 0) {
  console.error(`FAIL — ${failures.length}/${checked} checks failed:`);
  for (const failure of failures) console.error(`  • ${failure}`);
  process.exit(1);
}
console.log(`PASS — ${checked} checks passed (guards, gate, prompt section, bundled skill, host plugin).`);
