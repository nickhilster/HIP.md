import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { formatValidationReport, parseArgs } from '../cli.js';
import { getPreset, listPresets } from '../presets.js';
import { validateHip } from '../hip.js';
import { patchGitignore } from '../patcher.js';

test('parseArgs handles non-interactive generation flags', () => {
  const options = parseArgs([
    '--preset',
    'learner',
    '--output',
    'custom.md',
    '--private',
    '--patch-gitignore',
    '--patch-agent-files',
    '--print',
    '--force',
  ]);

  assert.equal(options.preset, 'learner');
  assert.equal(options.output, 'custom.md');
  assert.equal(options.private, true);
  assert.equal(options.patchGitignore, true);
  assert.equal(options.patchAgentFiles, true);
  assert.equal(options.print, true);
  assert.equal(options.force, true);
});

test('built-in presets load as valid HIP models', () => {
  const presets = listPresets();
  assert.ok(presets.length >= 5);

  for (const preset of presets) {
    const result = validateHip(getPreset(preset.name));
    assert.equal(result.valid, true, `${preset.name} should validate`);
  }
});

test('patchGitignore adds HIP.private.md once', () => {
  const dir = mkdtempSync(join(tmpdir(), 'create-hip-'));
  const gitignorePath = join(dir, '.gitignore');

  assert.equal(patchGitignore(gitignorePath), true);
  assert.equal(patchGitignore(gitignorePath), false);
  assert.match(readFileSync(gitignorePath, 'utf8'), /^HIP\.private\.md$/m);
});

test('formatValidationReport emits readable text', () => {
  const report = formatValidationReport({
    base: { valid: false, errors: ['Missing required section: Update Rule.'], warnings: [] },
  });

  assert.match(report, /HIP\.md: invalid/);
  assert.match(report, /Missing required section: Update Rule/);
});