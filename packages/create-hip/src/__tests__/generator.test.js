import test from 'node:test';
import assert from 'node:assert/strict';
import { generateHip } from '../generator.js';

const baseAnswers = {
  role: 'Main developer',
  fluency: 'High overall; comfortable with code, Git, terminal, debugging, and deployment',
  intent: 'Ship a feature',
  autonomy: 'Make changes, pause before structural decisions',
  explanation: 'Brief summaries',
  risk: 'Balanced',
  boundaries: [],
  done: ['the change is usable or clearly ready for testing', 'risks are stated'],
};

test('generateHip includes required sections and defaults', () => {
  const output = generateHip(baseAnswers);

  assert.match(output, /<!-- hip-version: 1\.0 -->/);
  assert.match(output, /## Human Operating Mode/);
  assert.match(output, /Decision style: One clear recommendation/);
  assert.match(output, /Feedback style: Direct/);
  assert.match(output, /## Approval Required Before\n\n\(none specified\)/);
});

test('generateHip renders selected boundaries and done items as bullets', () => {
  const output = generateHip({
    ...baseAnswers,
    boundaries: ['deployment configuration', 'public copy'],
    done: ['tests pass', 'next steps are clear'],
  });

  assert.match(output, /## Approval Required Before\n\n- deployment configuration\n- public copy/);
  assert.match(output, /## Definition of Done\n\nWork is not done until:\n\n- tests pass\n- next steps are clear/);
});