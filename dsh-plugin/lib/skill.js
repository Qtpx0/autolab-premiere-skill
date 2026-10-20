/**
 * Bundled skill provider.
 *
 * Contributes the repository's official `autolab-premiere` skill as an in-memory
 * provider on `ctx.skills`, so a machine that never ran `npx skills add` still
 * gets the SOP with the bundle. No frontmatter parsing happens here: the provider
 * declares the catalog entry and reads the body on demand, which keeps startup
 * offline and makes a body edit visible on the next load with no cache to bust.
 *
 * The personal workflow skill (`autolab-premiere-automation` and friends) belongs
 * to DSH's filesystem provider, not to this bundle — duplicating it here would
 * create exactly the drift this bundle exists to remove.
 */

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Bundled skills rank after every filesystem root (project 100/200, custom 300,
 * ~/.dsh 400, ~/.agents 500), so an installed local copy always wins a name
 * collision and this provider acts as the fallback.
 */
const BUNDLED_RANK = 600;

const PROVIDER_NAME = 'autolab-premiere-bundle';

const HERE = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(HERE, '..');

/**
 * Candidate skill directories, in priority order:
 *   1. `../skills/autolab-premiere` — the repository this bundle lives in, so the
 *      skill body stays single-sourced with the published skill.
 *   2. `assets/skills/autolab-premiere` — a bundled copy, for a standalone package
 *      that was published without the surrounding repository.
 */
const CANDIDATE_DIRS = [
  resolve(PACKAGE_ROOT, '..', 'skills', 'autolab-premiere'),
  resolve(PACKAGE_ROOT, 'assets', 'skills', 'autolab-premiere'),
];

const DESCRIPTION =
  'Official control skill for AutoLab CEP Extension and Adobe Premiere Pro MCP: ' +
  'disk/Bin stock inspection (pr_inspect), Auto Highlights, Auto Frame queue and ' +
  '.mogrt banner routing, AI Vision framing (จัดกรอบ), AI Auto-Name and Name Refiner, ' +
  'the single-call af_pipeline, and batch export to Adobe Media Encoder.';

/** Locate the skill body inside the installed package or its repository. */
export function resolveSkillDir() {
  for (const dir of CANDIDATE_DIRS) {
    if (existsSync(join(dir, 'SKILL.md'))) return dir;
  }
  return null;
}

/**
 * Read a Cordis service without tripping the inject gate. `ctx.get` is the safe
 * accessor; a direct `ctx.skills` read throws when the service is not injected.
 */
function safeGet(ctx, serviceName) {
  try {
    return typeof ctx?.get === 'function' ? ctx.get(serviceName) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Register the bundled skill provider. Synchronous by design: the body is read
 * lazily inside `get()`.
 *
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {Object} [config]
 * @returns {{ ok: boolean, reason?: string, dir?: string, name?: string }}
 */
export function registerBundledSkill(ctx, config = {}) {
  const skills = safeGet(ctx, 'skills');
  if (!skills || typeof skills.registerProvider !== 'function') {
    return { ok: false, reason: 'ctx.skills is unavailable in this profile' };
  }

  const dir = resolveSkillDir();
  if (!dir) {
    return {
      ok: false,
      reason:
        'skill body not found (looked for ../skills/autolab-premiere and assets/skills/autolab-premiere next to the package)',
    };
  }

  const name = config.skillName ?? 'autolab-premiere';
  const bodyUrl = pathToFileURL(join(dir, 'SKILL.md'));
  const resourceBase = { kind: 'directory', path: dir };

  const candidate = {
    name,
    description: DESCRIPTION,
    invocation: { modelInvocable: true, userInvocable: true },
    provider: PROVIDER_NAME,
    source: 'bundled',
    resourceBase,
    rank: BUNDLED_RANK,
    locator: bodyUrl,
  };

  const provider = {
    name: PROVIDER_NAME,
    list: () => Promise.resolve([candidate]),
    async get() {
      return {
        name,
        description: DESCRIPTION,
        invocation: candidate.invocation,
        provider: PROVIDER_NAME,
        source: 'bundled',
        resourceBase,
        content: await readFile(bodyUrl, 'utf8'),
      };
    },
  };

  const register = () => {
    const dispose = skills.registerProvider(() => provider);
    return () => {
      try {
        dispose?.();
      } catch {
        /* disposal is best-effort */
      }
    };
  };

  if (typeof ctx.effect === 'function') ctx.effect(register);
  else register();

  return { ok: true, dir, name };
}
