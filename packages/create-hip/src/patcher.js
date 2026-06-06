import { existsSync, readFileSync, writeFileSync } from 'fs';

const HIP_MARKER = '<!-- hip-md-adapter -->';

const ADAPTER_BLOCK = `

${HIP_MARKER}
## Human Interface Protocol

If \`HIP.md\` exists in this repo, read it before beginning any work.
Treat it as the human collaboration contract for this session — it defines autonomy
boundaries, explanation preferences, approval gates, and definition of done.
If \`HIP.private.md\` also exists, read it and let it override conflicting fields in HIP.md.
`;

/**
 * Appends a HIP.md reference block to an agent instruction file.
 * Returns true if the file was modified, false if it was already patched.
 *
 * @param {string} filePath - absolute path to the agent file
 * @returns {boolean}
 */
export function patchAgentFile(filePath) {
  const content = readFileSync(filePath, 'utf8');

  if (content.includes(HIP_MARKER)) {
    return false;
  }

  writeFileSync(filePath, content.trimEnd() + ADAPTER_BLOCK, 'utf8');
  return true;
}

export function patchGitignore(filePath) {
  const entry = 'HIP.private.md';
  const content = existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
  const hasEntry = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .includes(entry);

  if (hasEntry) {
    return false;
  }

  const nextContent = content.trim()
    ? `${content.trimEnd()}\n${entry}\n`
    : `${entry}\n`;

  writeFileSync(filePath, nextContent, 'utf8');
  return true;
}
