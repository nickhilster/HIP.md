export const SPEC_VERSION = '1.0';

export const DEFAULT_TITLE = 'HIP.md — Human Interface Protocol';

export const OPERATING_MODE_FIELDS = [
  'Role in this repo',
  'Technical fluency',
  'Primary intent',
  'Autonomy level',
  'Explanation depth',
  'Risk tolerance',
  'Decision style',
  'Feedback style',
];

export const REQUIRED_OPERATING_MODE_FIELDS = [
  'Role in this repo',
  'Technical fluency',
  'Primary intent',
  'Autonomy level',
  'Explanation depth',
  'Risk tolerance',
];

export const REQUIRED_SECTIONS = [
  'Human Operating Mode',
  'Approval Required Before',
  'Definition of Done',
  'Update Rule',
];

export const VALID_VALUES = {
  'Role in this repo': [
    'Main developer',
    'Technical founder',
    'Non-technical founder',
    'Designer-builder',
    'Product manager',
    'Student / learner',
    'Maintainer',
    'Researcher',
    'Domain expert',
    'Operator directing implementation',
  ],
  'Primary intent': [
    'Ship a feature',
    'Debug a problem',
    'Learn the stack',
    'Prototype quickly',
    'Refactor safely',
    'Document the system',
    'Prepare a demo',
    'Maintain production code',
    'Explore an idea',
  ],
  'Autonomy level': [
    'Ask before every meaningful change',
    'Small safe edits only',
    'Make changes, pause before structural decisions',
    'Act autonomously, summarize afterward',
    'Pair programmer',
    'Delegated implementation partner',
  ],
  'Explanation depth': [
    'Step by step',
    'Brief summaries',
    'Tradeoffs and risks only',
    'Risks only',
    'Only when asked',
    'Teach as we go',
    'Result first, reasoning on request',
  ],
  'Risk tolerance': [
    'Conservative',
    'Balanced',
    'Prototype',
    'Experimental',
    'Production-safe',
  ],
  'Decision style': [
    'One clear recommendation',
    'Tradeoffs then recommendation',
    'Options, human decides',
    'Optimize for speed',
    'Optimize for maintainability',
    'Optimize for simplicity',
    'Optimize for learning',
  ],
  'Feedback style': [
    'Direct',
    'Gentle',
    'Challenge weak assumptions',
    'Warn on serious issues only',
    'Senior reviewer',
    'Patient teacher',
    'Execution partner',
  ],
};

export const TECHNICAL_FLUENCY_LEVELS = ['High', 'Medium', 'Low', 'Not applicable'];

export const DEFAULT_UPDATE_RULE = 'If the human corrects the same collaboration behavior twice, ask whether HIP.md should be updated.';

export const DEFAULT_OPERATING_MODE = {
  'Decision style': 'One clear recommendation',
  'Feedback style': 'Direct',
};

export const DEFAULT_ANSWERS = {
  role: 'Main developer',
  fluency: 'High overall; comfortable with code, Git, terminal, debugging, and deployment',
  intent: 'Ship a feature',
  autonomy: 'Make changes, pause before structural decisions',
  explanation: 'Brief summaries',
  risk: 'Balanced',
  boundaries: [],
  done: [
    'the change is usable or clearly ready for testing',
    'risks are stated',
    'files changed are summarized',
    'next steps are clear',
  ],
  decisionStyle: 'One clear recommendation',
  feedbackStyle: 'Direct',
};

export const PRESET_FILES = {
  'designer-builder': 'designer-builder.md',
  learner: 'learner.md',
  maintainer: 'maintainer.md',
  'non-technical-founder': 'non-technical-founder.md',
  'senior-engineer': 'senior-engineer.md',
};