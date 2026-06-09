#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SPEC_VERSION,
  VALID_VALUES,
  TECHNICAL_FLUENCY_LEVELS,
  REQUIRED_SECTIONS,
  REQUIRED_OPERATING_MODE_FIELDS,
  OPERATING_MODE_FIELDS,
  DEFAULT_UPDATE_RULE,
} from '../src/constants.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '../../../hip-spec.json');

const spec = {
  version: SPEC_VERSION,
  requiredSections: REQUIRED_SECTIONS,
  operatingModeFields: OPERATING_MODE_FIELDS,
  requiredOperatingModeFields: REQUIRED_OPERATING_MODE_FIELDS,
  validValues: VALID_VALUES,
  technicalFluencyLevels: TECHNICAL_FLUENCY_LEVELS,
  defaultUpdateRule: DEFAULT_UPDATE_RULE,
};

writeFileSync(outPath, JSON.stringify(spec, null, 2) + '\n', 'utf8');
console.log(`Written: ${outPath}`);
