export function parseArgs(argv) {
  const options = {
    print: false,
    force: false,
    defaults: false,
    private: false,
    patchAgentFiles: false,
    patchGitignore: false,
    json: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--list-presets':
        options.listPresets = true;
        break;
      case '--preset':
        options.preset = requireValue(argv, ++index, '--preset');
        break;
      case '--defaults':
        options.defaults = true;
        break;
      case '--output':
        options.output = requireValue(argv, ++index, '--output');
        break;
      case '--private-output':
        options.privateOutput = requireValue(argv, ++index, '--private-output');
        break;
      case '--print':
        options.print = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--private':
        options.private = true;
        break;
      case '--patch-agent-files':
        options.patchAgentFiles = true;
        break;
      case '--patch-gitignore':
        options.patchGitignore = true;
        break;
      case '--bootstrap':
        options.bootstrap = true;
        break;
      case '--validate':
        if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
          options.validate = argv[++index];
        } else {
          options.validate = 'HIP.md';
        }
        break;
      case '--json':
        options.json = true;
        break;
      default:
        throw new Error(`Unknown argument '${arg}'. Run --help to see supported options.`);
    }
  }

  if (options.defaults && options.preset) {
    throw new Error('Use either --defaults or --preset, not both.');
  }

  if (options.bootstrap && (options.defaults || options.preset)) {
    throw new Error('--bootstrap cannot be combined with --defaults or --preset.');
  }

  if (options.json && !options.validate) {
    throw new Error('--json can only be used with --validate.');
  }

  return options;
}

export function formatHelp() {
  return `create-hip

Usage:
  create-hip
  create-hip --defaults [--output HIP.md] [--private] [--patch-gitignore] [--patch-agent-files]
  create-hip --preset learner [--output HIP.md] [--private]
  create-hip --bootstrap [--output HIP.md] [--force]
  create-hip --validate [HIP.md] [--json]
  create-hip --list-presets

Options:
  --help                 Show this help message
  --list-presets         List built-in starter presets
  --preset <name>        Generate from a built-in preset
  --defaults             Generate the default minimal HIP.md without prompts
  --bootstrap            Write a bootstrap HIP.md for agent-led calibration
  --output <path>        Write HIP.md to a custom path
  --private              Also generate a HIP.private.md template
  --private-output <p>   Write HIP.private.md to a custom path
  --patch-agent-files    Patch supported agent instruction files without prompting
  --patch-gitignore      Add HIP.private.md to .gitignore without prompting
  --print                Print the generated HIP.md to stdout
  --validate [path]      Validate an existing HIP.md and sibling HIP.private.md if present
  --json                 Emit validation results as JSON
  --force                Overwrite existing output files without prompting`;
}

export function formatValidationReport(report, options = {}) {
  if (options.json) {
    return JSON.stringify(report, null, 2);
  }

  const lines = [];
  lines.push(`HIP.md: ${report.base.valid ? 'valid' : 'invalid'}`);
  appendIssues(lines, report.base);

  if (report.private) {
    lines.push('');
    lines.push(`HIP.private.md: ${report.private.valid ? 'valid' : 'invalid'}`);
    appendIssues(lines, report.private);
  }

  if (report.merged) {
    lines.push('');
    lines.push(`Merged effective HIP: ${report.merged.valid ? 'valid' : 'invalid'}`);
    appendIssues(lines, report.merged);
  }

  return lines.join('\n');
}

function appendIssues(lines, result) {
  if (result.errors.length === 0 && result.warnings.length === 0) {
    lines.push('  No issues found.');
    return;
  }

  for (const warning of result.warnings) {
    lines.push(`  Warning: ${warning}`);
  }
  for (const error of result.errors) {
    lines.push(`  Error: ${error}`);
  }
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value.`);
  }
  return value;
}