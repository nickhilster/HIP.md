import { readFileSync } from 'node:fs';
import { PRESET_FILES } from './constants.js';
import { parseHip } from './hip.js';

const PRESET_METADATA = {
  'designer-builder': {
    label: 'Designer-builder',
    description: 'Prototype-focused preset with UX awareness and lighter implementation depth.',
  },
  learner: {
    label: 'Learner',
    description: 'Teaching-oriented preset that slows down and explains each step.',
  },
  maintainer: {
    label: 'Maintainer',
    description: 'Production-conscious preset with strong review and risk gates.',
  },
  'non-technical-founder': {
    label: 'Non-technical founder',
    description: 'Plain-language preset for product and business-led collaboration.',
  },
  'senior-engineer': {
    label: 'Senior engineer',
    description: 'Low-friction preset optimized for autonomous execution and tradeoff clarity.',
  },
};

export function listPresets() {
  return Object.entries(PRESET_FILES).map(([name, file]) => ({
    name,
    file,
    ...PRESET_METADATA[name],
  }));
}

export function getPreset(name) {
  const file = PRESET_FILES[name];
  if (!file) {
    throw new Error(`Unknown preset '${name}'. Run --list-presets to see available options.`);
  }

  const markdown = readFileSync(new URL(`../examples/${file}`, import.meta.url), 'utf8');
  return parseHip(markdown);
}