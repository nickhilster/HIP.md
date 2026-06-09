#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { DEFAULT_ANSWERS } from './constants.js';
import { formatHelp, formatValidationReport, parseArgs } from './cli.js';
import {
  createBootstrapHipTemplate,
  createHipModelFromAnswers,
  createPrivateHipTemplate,
  mergeHip,
  parseHip,
  renderHip,
  validateHip,
} from './hip.js';
import { patchAgentFile, patchGitignore } from './patcher.js';
import { getPreset, listPresets } from './presets.js';

const cwd = process.cwd();

const AGENT_FILES = ['CLAUDE.md', 'AGENTS.md', '.cursorrules', 'copilot-instructions.md'];

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  console.log(formatHelp());
  process.exit(0);
}

if (options.listPresets) {
  for (const preset of listPresets()) {
    console.log(`${preset.name}\t${preset.description}`);
  }
  process.exit(0);
}

if (options.bootstrap) {
  const hipPath = resolve(cwd, options.output ?? 'HIP.md');
  if (existsSync(hipPath) && !options.force) {
    console.error(`${hipPath} already exists. Re-run with --force to overwrite it.`);
    process.exit(1);
  }
  writeFileSync(hipPath, createBootstrapHipTemplate(), 'utf8');
  console.log('Bootstrap HIP.md written.');
  console.log('Place it at a repo root and ask an AI agent to follow it.');
  console.log('The agent will run calibration, inspect the repo, and replace this file with a finalized HIP.md.');
  process.exit(0);
}

if (options.validate) {
  const report = runValidation(resolve(cwd, options.validate));
  console.log(formatValidationReport(report, { json: options.json }));
  const isValid = report.base.valid && (!report.private || report.private.valid) && (!report.merged || report.merged.valid);
  process.exit(isValid ? 0 : 1);
}

const interactive = !isNonInteractive(options);
const p = interactive ? await import('@clack/prompts') : createConsoleUi();

const hipPath = resolve(cwd, options.output ?? 'HIP.md');
const privateHipPath = resolve(cwd, options.privateOutput ?? 'HIP.private.md');

p.intro('  HIP.md — Human Interface Protocol  ');

const model = await buildModel(options);
const content = renderHip(model);
const validation = validateHip(parseHip(content));

if (!validation.valid) {
  p.cancel(`Generated HIP.md failed validation: ${validation.errors.join('; ')}`);
  process.exit(1);
}

if (existsSync(hipPath)) {
  if (options.force) {
    // Skip prompt when explicitly forced.
  } else if (isNonInteractive(options)) {
    p.cancel(`${hipPath} already exists. Re-run with --force to overwrite it.`);
    process.exit(1);
  } else {
  const overwrite = await p.confirm({
    message: 'HIP.md already exists. Overwrite it?',
    initialValue: false,
  });

  if (p.isCancel(overwrite) || !overwrite) {
    p.outro('No changes made. Edit HIP.md directly to update your settings.');
    process.exit(0);
  }
  }
}

writeFileSync(hipPath, content, 'utf8');
p.log.success('HIP.md written.');

if (options.print) {
  console.log(content);
}

const shouldCreatePrivate = options.private || (!isNonInteractive(options) && await shouldCreatePrivateTemplate(privateHipPath, options.force));

if (shouldCreatePrivate) {
  if (existsSync(privateHipPath) && !options.force) {
    p.log.warn(`${privateHipPath} already exists — skipped private template creation.`);
  } else {
    writeFileSync(privateHipPath, createPrivateHipTemplate(), 'utf8');
    p.log.success('HIP.private.md template written.');
  }

  if (options.patchGitignore || (!isNonInteractive(options) && await shouldPatchGitignore())) {
    const gitignorePath = resolve(cwd, '.gitignore');
    const patched = patchGitignore(gitignorePath);
    if (patched) {
      p.log.success('Patched .gitignore with HIP.private.md.');
    } else {
      p.log.info('.gitignore already ignores HIP.private.md — skipped.');
    }
  }
}

// Offer to patch whichever agent instruction files exist in the repo
const found = AGENT_FILES.filter(f => existsSync(join(cwd, f)));

for (const filename of found) {
  const filePath = join(cwd, filename);
  const patch = options.patchAgentFiles || (!isNonInteractive(options) && await p.confirm({
    message: `Add HIP.md reference to ${filename}?`,
    initialValue: true,
  }));

  if (!p.isCancel(patch) && patch) {
    const patched = patchAgentFile(filePath);
    if (patched) {
      p.log.success(`Patched ${filename}.`);
    } else {
      p.log.info(`${filename} already references HIP.md — skipped.`);
    }
  }
}

p.outro('Done. Review HIP.md and update it as your work evolves.');

function runValidation(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`No HIP.md found at ${filePath}.`);
  }

  const base = parseHip(readFileSync(filePath, 'utf8'));
  const baseResult = validateHip(base);
  const privatePath = resolve(dirname(filePath), 'HIP.private.md');

  if (!existsSync(privatePath)) {
    return { base: baseResult };
  }

  const privateModel = parseHip(readFileSync(privatePath, 'utf8'));
  const privateResult = validateHip(privateModel, { allowPartial: true });
  const mergedResult = validateHip(mergeHip(base, privateModel));

  return {
    base: baseResult,
    private: privateResult,
    merged: mergedResult,
  };
}

async function buildModel(currentOptions) {
  if (currentOptions.preset) {
    return getPreset(currentOptions.preset);
  }

  if (currentOptions.defaults) {
    return createHipModelFromAnswers(DEFAULT_ANSWERS);
  }

  p.note(
    'Answer a few short questions to calibrate your human-agent collaboration settings.\n' +
    'Pick the closest answer — you can edit the file anytime.',
    'Calibration'
  );

  const { runCalibration } = await import('./prompts.js');

  const answers = await runCalibration();

  if (p.isCancel(answers)) {
    p.cancel('Cancelled. No files were written.');
    process.exit(0);
  }

  return createHipModelFromAnswers(answers);
}

function isNonInteractive(currentOptions) {
  return Boolean(currentOptions.preset || currentOptions.defaults);
}

async function shouldCreatePrivateTemplate(filePath, force) {
  if (existsSync(filePath) && !force) {
    return false;
  }

  const createPrivate = await p.confirm({
    message: 'Also create a HIP.private.md template for local-only context?',
    initialValue: false,
  });

  return !p.isCancel(createPrivate) && createPrivate;
}

async function shouldPatchGitignore() {
  const patch = await p.confirm({
    message: 'Add HIP.private.md to .gitignore?',
    initialValue: true,
  });

  return !p.isCancel(patch) && patch;
}

function createConsoleUi() {
  return {
    intro(message) {
      console.log(message.trim());
    },
    note(message, label) {
      console.log(`${label}:\n${message}`);
    },
    log: {
      success(message) {
        console.log(message);
      },
      info(message) {
        console.log(message);
      },
      warn(message) {
        console.warn(message);
      },
    },
    cancel(message) {
      console.error(message);
    },
    outro(message) {
      console.log(message);
    },
    isCancel() {
      return false;
    },
  };
}
