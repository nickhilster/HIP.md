import {
  DEFAULT_ANSWERS,
  DEFAULT_OPERATING_MODE,
  DEFAULT_TITLE,
  DEFAULT_UPDATE_RULE,
  OPERATING_MODE_FIELDS,
  REQUIRED_OPERATING_MODE_FIELDS,
  REQUIRED_SECTIONS,
  SPEC_VERSION,
  TECHNICAL_FLUENCY_LEVELS,
  VALID_VALUES,
} from './constants.js';

export function createHipModelFromAnswers(answers = DEFAULT_ANSWERS, overrides = {}) {
  return {
    version: SPEC_VERSION,
    title: DEFAULT_TITLE,
    humanOperatingMode: {
      'Role in this repo': answers.role,
      'Technical fluency': answers.fluency,
      'Primary intent': answers.intent,
      'Autonomy level': answers.autonomy,
      'Explanation depth': answers.explanation,
      'Risk tolerance': answers.risk,
      'Decision style': overrides.decisionStyle ?? answers.decisionStyle ?? DEFAULT_OPERATING_MODE['Decision style'],
      'Feedback style': overrides.feedbackStyle ?? answers.feedbackStyle ?? DEFAULT_OPERATING_MODE['Feedback style'],
    },
    technicalFluency: overrides.technicalFluency ?? [],
    approvalRequiredBefore: answers.boundaries ?? [],
    reviewWorkflow: overrides.reviewWorkflow ?? [],
    definitionOfDone: answers.done ?? [],
    updateRule: overrides.updateRule ?? DEFAULT_UPDATE_RULE,
    notes: overrides.notes ?? '',
    sectionsPresent: [...REQUIRED_SECTIONS],
  };
}

export function renderHip(model) {
  const normalized = normalizeModel(model);
  const lines = [
    `<!-- hip-version: ${normalized.version} -->`,
    `# ${normalized.title}`,
    '',
    '## Human Operating Mode',
    '',
  ];

  for (const field of OPERATING_MODE_FIELDS) {
    const value = normalized.humanOperatingMode[field];
    if (value) {
      lines.push(`${field}: ${value}`);
    }
  }

  if (normalized.technicalFluency.length > 0) {
    lines.push('', '## Technical Fluency', '', '| Domain | Level |', '|--------|-------|');
    for (const row of normalized.technicalFluency) {
      lines.push(`| ${row.domain} | ${row.level} |`);
    }
  }

  lines.push('', '## Approval Required Before', '');
  if (normalized.approvalRequiredBefore.length > 0) {
    lines.push(...normalized.approvalRequiredBefore.map(item => `- ${item}`));
  } else {
    lines.push('(none specified)');
  }

  if (normalized.reviewWorkflow.length > 0) {
    lines.push('', '## Review Workflow', '', ...normalized.reviewWorkflow.map(item => `- ${item}`));
  }

  lines.push('', '## Definition of Done', '', 'Work is not done until:', '');
  lines.push(...normalized.definitionOfDone.map(item => `- ${item}`));
  lines.push('', '## Update Rule', '', normalized.updateRule);

  if (normalized.notes) {
    lines.push('', '## Notes', '', normalized.notes);
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

export function createPrivateHipTemplate() {
  return [
    `<!-- hip-version: ${SPEC_VERSION} -->`,
    '# HIP.private.md — Human Interface Protocol',
    '',
    'Keep this file local. Do not commit it.',
    '',
    '## Notes',
    '',
    '- Add private repo context here, such as internal system names, private deployment notes, or local-only workflow details.',
    '',
  ].join('\n');
}

export function createBootstrapHipTemplate() {
  return [
    '<!-- hip-bootstrap: 1.0 -->',
    '# HIP.md — Human Interface Protocol Bootstrap',
    '',
    'This is a temporary bootstrap file. It exists to let an AI agent calibrate repo-local collaboration when the human has only dropped `HIP.md` into the repository root.',
    '',
    '## Agent Bootstrap Protocol',
    '',
    'When an agent finds this file at repo root and no finalized HIP.md exists, it must use the browser intake. It must not collect calibration answers in chat, and it must not decide that chat questions are an acceptable substitute for the manual path. The HTML UI is the product experience because it makes selection, review, and confirmation easy for the human.',
    '',
    'The agent must always launch or create the HTML intake before collecting answers:',
    '',
    '1. Inspect the repository enough to identify project type, package manager, run commands, existing agent instruction files, and any visible UI or design-system signals.',
    '2. Create a small repo-local HTML intake experience and run it on localhost.',
    '3. If existing UI signals are present, follow those visual patterns for layout, typography, color, spacing, and controls. If none are present, use a clean accessible default.',
    '4. Ask the human to make structured collaboration choices in the browser. Do not ask for secrets, credentials, or unrelated personal information.',
    '5. On submit, record the answers locally in the workspace and show a clear visual confirmation that the feedback was recorded.',
    '6. Combine the submitted answers with detailed repo context to replace this bootstrap file with a finalized `HIP.md` that conforms to the HIP.md spec.',
    '7. Remove any temporary intake files unless the human asks to keep them.',
    '',
    '## Required Intake Fields',
    '',
    '- Role in this repo',
    '- Technical fluency',
    '- Primary intent',
    '- Autonomy level',
    '- Explanation depth',
    '- Risk tolerance',
    '- Approval required before',
    '- Definition of done',
    '- Decision style',
    '- Feedback style',
    '',
    '## Output Requirement',
    '',
    'The final `HIP.md` must be a repo-specific collaboration contract, not a generic template. It should reflect both the human choices and concrete repository context discovered during inspection.',
    '',
  ].join('\n');
}

export function parseHip(markdown) {
  const content = normalizeLineEndings(markdown);
  const versionMatch = content.match(/<!--\s*hip-version:\s*([^\s]+)\s*-->/i);
  const bootstrapMatch = content.match(/<!--\s*hip-bootstrap:\s*([^\s]+)\s*-->/i);
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const sections = splitSections(content);

  return {
    version: versionMatch?.[1] ?? null,
    bootstrapVersion: bootstrapMatch?.[1] ?? null,
    isBootstrap: Boolean(bootstrapMatch),
    title: titleMatch?.[1]?.trim() ?? null,
    humanOperatingMode: parseKeyValueSection(sections['Human Operating Mode']),
    technicalFluency: parseTechnicalFluencySection(sections['Technical Fluency']),
    approvalRequiredBefore: parseBulletSection(sections['Approval Required Before']),
    reviewWorkflow: parseBulletSection(sections['Review Workflow']),
    definitionOfDone: parseDefinitionOfDoneSection(sections['Definition of Done']),
    updateRule: sections['Update Rule']?.trim() ?? '',
    notes: sections['Notes']?.trim() ?? '',
    sectionsPresent: Object.keys(sections),
    rawSections: sections,
  };
}

export function mergeHip(baseModel, overrideModel) {
  const base = normalizeModel(baseModel);
  const override = normalizeModel(overrideModel, { partial: true });
  const overrideSections = new Set(overrideModel.sectionsPresent ?? []);
  const mergedTechnicalFluency = new Map(base.technicalFluency.map(row => [row.domain.toLowerCase(), row]));

  for (const row of override.technicalFluency) {
    mergedTechnicalFluency.set(row.domain.toLowerCase(), row);
  }

  return {
    version: override.version ?? base.version,
    title: base.title,
    humanOperatingMode: {
      ...base.humanOperatingMode,
      ...override.humanOperatingMode,
    },
    technicalFluency: [...mergedTechnicalFluency.values()],
    approvalRequiredBefore: overrideSections.has('Approval Required Before')
      ? override.approvalRequiredBefore
      : base.approvalRequiredBefore,
    reviewWorkflow: overrideSections.has('Review Workflow')
      ? override.reviewWorkflow
      : base.reviewWorkflow,
    definitionOfDone: overrideSections.has('Definition of Done')
      ? override.definitionOfDone
      : base.definitionOfDone,
    updateRule: overrideSections.has('Update Rule') ? override.updateRule : base.updateRule,
    notes: [base.notes, override.notes].filter(Boolean).join('\n\n'),
    sectionsPresent: [...new Set([...(base.sectionsPresent ?? []), ...(overrideModel.sectionsPresent ?? [])])],
  };
}

export function validateHip(model, options = {}) {
  const { allowPartial = false } = options;
  if (model.isBootstrap) {
    return {
      valid: true,
      errors: [],
      warnings: ['Bootstrap HIP.md detected; run repo-local calibration before treating it as a final HIP.md contract.'],
      model,
    };
  }

  const normalized = normalizeModel(model, { partial: allowPartial });
  const presentSections = new Set(model.sectionsPresent ?? []);
  const errors = [];
  const warnings = [];

  if (!normalized.version) {
    warnings.push('Missing hip-version declaration; parsers should fall back to best-effort parsing.');
  } else if (normalized.version !== SPEC_VERSION) {
    warnings.push(`Unknown hip-version '${normalized.version}'.`);
  }

  if (!normalized.title) {
    warnings.push('Missing document title.');
  }

  if (!allowPartial) {
    for (const section of REQUIRED_SECTIONS) {
      if (!presentSections.has(section)) {
        errors.push(`Missing required section: ${section}.`);
      }
    }
  }

  if (presentSections.has('Human Operating Mode') || !allowPartial) {
    for (const field of REQUIRED_OPERATING_MODE_FIELDS) {
      if (!normalized.humanOperatingMode[field]) {
        errors.push(`Missing required field in Human Operating Mode: ${field}.`);
      }
    }
  }

  for (const [field, allowedValues] of Object.entries(VALID_VALUES)) {
    const value = normalized.humanOperatingMode[field];
    if (value && !allowedValues.includes(value)) {
      errors.push(`Invalid value for ${field}: ${value}.`);
    }
  }

  for (const row of normalized.technicalFluency) {
    if (!TECHNICAL_FLUENCY_LEVELS.includes(row.level)) {
      errors.push(`Invalid technical fluency level for ${row.domain}: ${row.level}.`);
    }
  }

  if ((presentSections.has('Definition of Done') || !allowPartial) && normalized.definitionOfDone.length === 0) {
    errors.push('Definition of Done must contain at least one bullet.');
  }

  if ((presentSections.has('Update Rule') || !allowPartial) && !normalized.updateRule) {
    errors.push('Update Rule must not be empty.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    model: normalized,
  };
}

function normalizeModel(model, options = {}) {
  const { partial = false } = options;
  const normalized = {
    version: model.version ?? SPEC_VERSION,
    title: model.title ?? DEFAULT_TITLE,
    humanOperatingMode: { ...(model.humanOperatingMode ?? {}) },
    technicalFluency: normalizeTechnicalFluency(model.technicalFluency ?? []),
    approvalRequiredBefore: [...(model.approvalRequiredBefore ?? [])],
    reviewWorkflow: [...(model.reviewWorkflow ?? [])],
    definitionOfDone: [...(model.definitionOfDone ?? [])],
    updateRule: model.updateRule ?? (partial ? '' : DEFAULT_UPDATE_RULE),
    notes: model.notes ?? '',
    sectionsPresent: model.sectionsPresent ?? [],
  };

  if (!partial) {
    normalized.humanOperatingMode = {
      ...DEFAULT_OPERATING_MODE,
      ...normalized.humanOperatingMode,
    };
  }

  return normalized;
}

function splitSections(markdown) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  const sections = {};

  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index];
    const next = matches[index + 1];
    const start = current.index + current[0].length;
    const end = next ? next.index : markdown.length;
    sections[current[1].trim()] = markdown.slice(start, end).trim();
  }

  return sections;
}

function parseKeyValueSection(section = '') {
  const fields = {};
  for (const line of section.split('\n')) {
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      fields[match[1].trim()] = match[2].trim();
    }
  }
  return fields;
}

function parseBulletSection(section = '') {
  if (!section || section.trim() === '(none specified)') {
    return [];
  }

  return section
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('- '))
    .map(line => line.slice(2).trim());
}

function parseDefinitionOfDoneSection(section = '') {
  return parseBulletSection(
    section
      .split('\n')
      .filter(line => line.trim() !== 'Work is not done until:')
      .join('\n')
  );
}

function parseTechnicalFluencySection(section = '') {
  const lines = section.split('\n').map(line => line.trim()).filter(Boolean);
  const tableLines = lines.filter(line => line.startsWith('|'));

  if (tableLines.length < 3) {
    return [];
  }

  return tableLines.slice(2).map(line => {
    const [domain, level] = line
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim());

    return { domain, level };
  }).filter(row => row.domain && row.level);
}

function normalizeTechnicalFluency(rows) {
  return rows.map(row => ({
    domain: row.domain,
    level: row.level,
  }));
}

function normalizeLineEndings(value) {
  return value.replace(/\r\n/g, '\n');
}
