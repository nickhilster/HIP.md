import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import {
  createHipModelFromAnswers,
  createBootstrapHipTemplate,
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

test('bootstrap HIP template gives agents the local intake workflow', () => {
  const template = createBootstrapHipTemplate();

  assert.match(template, /<!-- hip-bootstrap: 1\.0 -->/);
  assert.match(template, /must not collect calibration answers in chat/i);
  assert.match(template, /must always launch or create the HTML intake/i);
  assert.match(template, /run it on localhost/);
  assert.match(template, /show a clear visual confirmation/);
  assert.match(template, /replace this bootstrap file with a finalized `HIP\.md`/);
});

test('bootstrap HIP template validates as a bootstrap, not a final contract', () => {
  const parsed = parseHip(createBootstrapHipTemplate());
  const result = validateHip(parsed);

  assert.equal(parsed.isBootstrap, true);
  assert.equal(parsed.bootstrapVersion, '1.0');
  assert.equal(result.valid, true);
  assert.match(result.warnings.join('\n'), /run repo-local calibration/);
});
