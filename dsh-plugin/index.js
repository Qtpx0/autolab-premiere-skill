/**
 * dsh-autolab-premiere — DeepSeek Harness bundle for AutoLab CEP + Adobe Premiere Pro.
 *
 * The MCP rows in `cordis.patch.yml` put 34 AutoLab tools and 432 Premiere Pro
 * tools in front of the model. This host plugin adds the part a skill cannot:
 *
 *   1. Guards  — the SKILL.md iron rules become denials the model cannot talk
 *                its way out of, plus a stale-export gate fed by tool outcomes.
 *   2. Prompt  — a ~10-line operator contract in every request (static, cacheable).
 *   3. Skill   — the official `autolab-premiere` skill from this repository, so a
 *                machine without the skill installed locally still gets it.
 *
 * A personal workflow skill (for example `autolab-premiere-automation`, the
 * machine-specific one) is discovered by DSH's own filesystem provider from
 * `<project>/.agents/skills`, `~/.agents/skills` or `~/.dsh/skills`; this bundle
 * deliberately does not duplicate it.
 */

import { DEFAULT_CONFIG, createGuard, createState, describeRules, observeResult } from './lib/guards.js';
import { registerBundledSkill } from './lib/skill.js';

/** Cordis plugin name. */
export const name = 'autolab-premiere';

/**
 * Cordis service gate — the complete list of services this plugin reads off `ctx`.
 * Reading a service that is not listed throws `cannot get property "<x>" without
 * inject`, and neither optional chaining nor an outer try/catch can prevent the
 * read itself from throwing.
 */
export const inject = ['tools', 'systemPrompt'];

/** Shallow-merge the row config over the defaults, one level per nested object. */
function mergeConfig(config) {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    rules: { ...DEFAULT_CONFIG.rules, ...(config.rules ?? {}) },
    exportGate: { ...DEFAULT_CONFIG.exportGate, ...(config.exportGate ?? {}) },
    prompt: { ...DEFAULT_CONFIG.prompt, ...(config.prompt ?? {}) },
  };
}

/**
 * Host entry point.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx - Cordis host context
 * @param {Object} [config] - Row config from cordis.patch.yml
 */
export function apply(ctx, config = {}) {
  const merged = mergeConfig(config);
  const state = createState();

  // 1 — Hard rules. A guard is synchronous and can only deny, which is exactly
  // what an iron rule needs; `ctx.tools.guard` fires for every execution, so the
  // guard also records the call sequence the stale-export gate reasons about.
  if (merged.enableGuard && typeof ctx.tools?.guard === 'function') {
    ctx.tools.guard(createGuard(merged, state));
    ctx.logger?.info?.(`[autolab-premiere] guard active: ${describeRules(merged).join(', ')}`);
  } else {
    ctx.logger?.warn?.(
      '[autolab-premiere] ctx.tools.guard is unavailable — the iron rules are advisory only in this profile',
    );
  }

  // 2 — Outcome tracking. The stale-export gate needs evidence that footage is
  // still parked in `ไฟล์ต้นฉบับ` (`needsRecovery: true`), which only exists in a
  // tool result. The payload shape is not part of this plugin's contract, so the
  // handler reads it defensively and the gate fails open when nothing is seen.
  if (merged.exportGate.enabled) {
    try {
      if (typeof ctx.on === 'function') {
        ctx.on('tools/result', (payload) => {
          try {
            observeResult(state, payload);
          } catch {
            /* never let observation break a tool result */
          }
        });
      } else {
        ctx.logger?.warn?.(
          '[autolab-premiere] ctx.on is unavailable — the stale-export gate has no evidence source and stays open',
        );
      }
    } catch (error) {
      ctx.logger?.warn?.(`[autolab-premiere] result tracking skipped: ${error?.message ?? error}`);
    }
  }

  // 3 — Operator contract. A static prefix is cheap and prompt-cacheable; the SOP
  // itself stays in the skill and loads on demand.
  if (merged.prompt.enabled) {
    try {
      const sp = ctx.systemPrompt;
      if (sp && typeof sp.section === 'function') {
        // `prompt.extra` carries machine- or profile-specific additions (the exact
        // DSH tool names, extra routing keywords) without duplicating the contract
        // that ships in this module.
        const text = merged.prompt.extra
          ? `${merged.prompt.text}\n${merged.prompt.extra}`
          : merged.prompt.text;
        sp.section({
          name: 'autolab-premiere:operator-contract',
          order: merged.prompt.order,
          text,
        });
      }
    } catch (error) {
      // Never swallow silently: a failure here means a missing/renamed inject entry
      // or a throwing prompt section, which is a real bug worth seeing in the log.
      ctx.logger?.warn?.(`[autolab-premiere] prompt section skipped: ${error?.message ?? error}`);
    }
  }

  // 4 — Bundled official skill. Registration is synchronous; the body is read on
  // demand by the provider, so startup stays offline.
  if (merged.bundledSkill) {
    try {
      const result = registerBundledSkill(ctx, merged);
      if (result.ok) {
        ctx.logger?.info?.(
          `[autolab-premiere] bundled skill "${merged.skillName}" registered from ${result.dir}`,
        );
      } else {
        ctx.logger?.warn?.(`[autolab-premiere] bundled skill skipped: ${result.reason}`);
      }
    } catch (error) {
      ctx.logger?.warn?.(`[autolab-premiere] bundled skill registration failed: ${error?.message ?? error}`);
    }
  }
}
