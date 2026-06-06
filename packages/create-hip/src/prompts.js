import * as p from '@clack/prompts';

export async function runCalibration() {
  while (true) {
    const role = await p.select({
      message: 'What is your relationship to this repo?',
      options: [
        { value: 'Main developer', label: 'Main developer' },
        { value: 'Technical founder', label: 'Technical founder' },
        { value: 'Non-technical founder', label: 'Non-technical founder' },
        { value: 'Designer-builder', label: 'Designer-builder' },
        { value: 'Product manager', label: 'Product manager' },
        { value: 'Student / learner', label: 'Student / learner' },
        { value: 'Maintainer', label: 'Maintainer' },
        { value: 'Researcher', label: 'Researcher' },
        { value: 'Domain expert', label: 'Domain expert' },
        { value: 'Operator directing implementation', label: 'Operator directing implementation' },
      ],
    });
    if (p.isCancel(role)) return role;

    const fluency = await p.select({
      message: 'How would you describe your overall technical fluency here?',
      options: [
        {
          value: 'High overall; comfortable with code, Git, terminal, debugging, and deployment',
          label: 'High — comfortable across most technical areas',
        },
        {
          value: 'Medium overall; strong in some areas (code, architecture), lighter in others (deployment, ops)',
          label: 'Medium — strong in some areas, lighter in others',
        },
        {
          value: 'Lower technical depth; strong domain, product, or design knowledge',
          label: 'Low technical depth — strong domain or product knowledge',
        },
        {
          value: 'Variable; deep in my domain, actively learning the stack',
          label: 'Variable — deep in my domain, learning the stack',
        },
      ],
    });
    if (p.isCancel(fluency)) return fluency;

    const intent = await p.select({
      message: 'What are you primarily trying to do here?',
      options: [
        { value: 'Ship a feature', label: 'Ship a feature' },
        { value: 'Debug a problem', label: 'Debug a problem' },
        { value: 'Learn the stack', label: 'Learn the stack' },
        { value: 'Prototype quickly', label: 'Prototype quickly' },
        { value: 'Refactor safely', label: 'Refactor safely' },
        { value: 'Document the system', label: 'Document the system' },
        { value: 'Prepare a demo', label: 'Prepare a demo' },
        { value: 'Maintain production code', label: 'Maintain production code' },
        { value: 'Explore an idea', label: 'Explore an idea' },
      ],
    });
    if (p.isCancel(intent)) return intent;

    const autonomy = await p.select({
      message: 'How much autonomy should the agent take?',
      options: [
        {
          value: 'Ask before every meaningful change',
          label: 'Ask before every meaningful change',
          hint: 'most cautious',
        },
        {
          value: 'Small safe edits only',
          label: 'Small safe edits only — ask for anything bigger',
        },
        {
          value: 'Make changes, pause before structural decisions',
          label: 'Make changes freely, pause before structural decisions',
          hint: 'recommended',
        },
        {
          value: 'Act autonomously, summarize afterward',
          label: 'Act autonomously, summarize afterward',
        },
        {
          value: 'Pair programmer',
          label: 'Pair programmer — propose and iterate with me',
        },
        {
          value: 'Delegated implementation partner',
          label: 'Delegated implementation — own execution, I set direction',
          hint: 'most autonomous',
        },
      ],
    });
    if (p.isCancel(autonomy)) return autonomy;

    const explanation = await p.select({
      message: 'How much explanation do you want?',
      options: [
        { value: 'Step by step', label: 'Step by step — explain each action and decision' },
        { value: 'Brief summaries', label: 'Brief summaries — what changed and why' },
        { value: 'Tradeoffs and risks only', label: 'Tradeoffs and risks only — skip the obvious' },
        { value: 'Risks only', label: 'Risks only — flag problems, stay quiet otherwise' },
        { value: 'Only when asked', label: 'Only when asked — no unsolicited explanation' },
        { value: 'Teach as we go', label: 'Teach me as we go — explain concepts while executing' },
        { value: 'Result first, reasoning on request', label: 'Result first — explain only when asked' },
      ],
    });
    if (p.isCancel(explanation)) return explanation;

    const risk = await p.select({
      message: 'What risk mode is this project in?',
      options: [
        { value: 'Conservative', label: 'Conservative — preserve what works', hint: 'prefer no-change over uncertain improvement' },
        { value: 'Balanced', label: 'Balanced — improve carefully', hint: 'validate before committing' },
        { value: 'Prototype', label: 'Prototype — move fast, polish later' },
        { value: 'Experimental', label: 'Experimental — try bold changes', hint: 'failure is acceptable' },
        { value: 'Production-safe', label: 'Production-safe — no risky changes without approval' },
      ],
    });
    if (p.isCancel(risk)) return risk;

    const boundaries = await p.multiselect({
      message: 'What should the agent avoid touching without your explicit approval? (select all that apply)',
      options: [
        { value: 'authentication', label: 'Authentication' },
        { value: 'database schema', label: 'Database schema' },
        { value: 'environment variables', label: 'Environment variables' },
        { value: 'deployment configuration', label: 'Deployment configuration' },
        { value: 'payment flows', label: 'Payment flows' },
        { value: 'legal or policy text', label: 'Legal or policy text' },
        { value: 'security rules', label: 'Security rules' },
        { value: 'migrations', label: 'Migrations' },
        { value: 'design system', label: 'Design system' },
        { value: 'public copy', label: 'Public-facing copy' },
        { value: 'generated files', label: 'Generated files' },
      ],
      required: false,
    });
    if (p.isCancel(boundaries)) return boundaries;

    const done = await p.multiselect({
      message: 'What does "done" mean to you? (select all that apply)',
      options: [
        {
          value: 'the change is usable or clearly ready for testing',
          label: 'Change is usable / ready for testing',
          initialValue: true,
        },
        { value: 'tests pass', label: 'Tests pass' },
        { value: 'feature works locally', label: 'Feature works locally' },
        { value: 'UI is previewed', label: 'UI is previewed' },
        { value: 'deployed successfully', label: 'Deployed successfully' },
        { value: 'risks are stated', label: 'Risks are stated', initialValue: true },
        { value: 'files changed are summarized', label: 'Files changed are summarized', initialValue: true },
        { value: 'next steps are clear', label: 'Next steps are clear', initialValue: true },
        { value: 'I can explain the change to someone else', label: 'I can explain the change to someone else' },
      ],
      required: true,
    });
    if (p.isCancel(done)) return done;

    const answers = { role, fluency, intent, autonomy, explanation, risk, boundaries, done };

    p.note(formatReview(answers), 'Review');

    const shouldWrite = await p.confirm({
      message: 'Write HIP.md with these settings?',
      initialValue: true,
    });
    if (p.isCancel(shouldWrite)) return shouldWrite;
    if (shouldWrite) {
      return answers;
    }

    p.log.info('Restarting calibration so you can change your answers.');
  }
}

function formatReview({ role, fluency, intent, autonomy, explanation, risk, boundaries, done }) {
  const boundaryBlock = boundaries.length > 0
    ? boundaries.map(item => `- ${item}`).join('\n')
    : '(none specified)';
  const doneBlock = done.map(item => `- ${item}`).join('\n');

  return [
    `Role in this repo: ${role}`,
    `Technical fluency: ${fluency}`,
    `Primary intent: ${intent}`,
    `Autonomy level: ${autonomy}`,
    `Explanation depth: ${explanation}`,
    `Risk tolerance: ${risk}`,
    '',
    'Approval Required Before',
    boundaryBlock,
    '',
    'Definition of Done',
    doneBlock,
    '',
    'Decision style: One clear recommendation',
    'Feedback style: Direct',
  ].join('\n');
}
