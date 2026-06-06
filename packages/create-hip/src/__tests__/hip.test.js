import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import {
  createHipModelFromAnswers,
  createPrivateHipTemplate,
  mergeHip,
  parseHip,
  renderHip,
  validateHip,
} from '../hip.js';

const examplesDir = new URL('../../examples/', import.meta.url);

test('rendered generated HIP parses and validates', () => {
  const markdown = renderHip(createHipModelFromAnswers());
  const parsed = parseHip(markdown);
  const result = validateHip(parsed);

  assert.equal(result.valid, true);
  assert.equal(parsed.humanOperatingMode['Role in this repo'], 'Main developer');
});

test('shipped HIP examples validate against the spec core', () => {
  const files = readdirSync(examplesDir).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const markdown = readFileSync(new URL(file, examplesDir), 'utf8');
    const result = validateHip(parseHip(markdown));
    assert.equal(result.valid, true, `${file} failed validation: ${result.errors.join('; ')}`);
  }
});

test('private HIP overrides merge on top of the base model', () => {
  const base = parseHip(renderHip(createHipModelFromAnswers()));
  const override = parseHip(`<!-- hip-version: 1.0 -->
# HIP.private.md — Human Interface Protocol

## Human Operating Mode

Feedback style: Challenge weak assumptions

## Notes

- Internal rollout uses a private staging environment.
`);

  const merged = mergeHip(base, override);
  assert.equal(merged.humanOperatingMode['Feedback style'], 'Challenge weak assumptions');
  assert.match(merged.notes, /private staging environment/);
});

test('private HIP templates validate as partial overrides', () => {
  const template = createPrivateHipTemplate();
  const result = validateHip(parseHip(template), { allowPartial: true });

  assert.equal(result.valid, true);
});