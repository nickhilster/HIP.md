import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { formatValidationReport, parseArgs } from "../cli.js";
import { getPreset, listPresets } from "../presets.js";
import { validateHip } from "../hip.js";
import { patchGitignore } from "../patcher.js";
import { VALID_VALUES, SPEC_VERSION, REQUIRED_SECTIONS } from "../constants.js";

const cliPath = fileURLToPath(new URL("../index.js", import.meta.url));

test("parseArgs handles non-interactive generation flags", () => {
  const options = parseArgs([
    "--preset",
    "learner",
    "--output",
    "custom.md",
    "--private",
    "--patch-gitignore",
    "--patch-agent-files",
    "--print",
    "--force",
  ]);

  assert.equal(options.preset, "learner");
  assert.equal(options.output, "custom.md");
  assert.equal(options.private, true);
  assert.equal(options.patchGitignore, true);
  assert.equal(options.patchAgentFiles, true);
  assert.equal(options.print, true);
  assert.equal(options.force, true);
});

test("built-in presets load as valid HIP models", () => {
  const presets = listPresets();
  assert.ok(presets.length >= 5);

  for (const preset of presets) {
    const result = validateHip(getPreset(preset.name));
    assert.equal(result.valid, true, `${preset.name} should validate`);
  }
});

test("patchGitignore adds HIP.private.md once", () => {
  const dir = mkdtempSync(join(tmpdir(), "create-hip-"));
  const gitignorePath = join(dir, ".gitignore");

  assert.equal(patchGitignore(gitignorePath), true);
  assert.equal(patchGitignore(gitignorePath), false);
  assert.match(readFileSync(gitignorePath, "utf8"), /^HIP\.private\.md$/m);
});

test("formatValidationReport emits readable text", () => {
  const report = formatValidationReport({
    base: {
      valid: false,
      errors: ["Missing required section: Update Rule."],
      warnings: [],
    },
  });

  assert.match(report, /HIP\.md: invalid/);
  assert.match(report, /Missing required section: Update Rule/);
});

test("parseArgs --bootstrap sets bootstrap flag", () => {
  const options = parseArgs(["--bootstrap"]);
  assert.equal(options.bootstrap, true);
});

test("parseArgs --bootstrap with --output sets output path", () => {
  const options = parseArgs(["--bootstrap", "--output", "custom.md"]);
  assert.equal(options.bootstrap, true);
  assert.equal(options.output, "custom.md");
});

test("parseArgs --serve sets serve flag", () => {
  const options = parseArgs(["--serve"]);
  assert.equal(options.serve, true);
});

test("parseArgs --serve with --port sets port", () => {
  const options = parseArgs(["--serve", "--port", "4000"]);
  assert.equal(options.serve, true);
  assert.equal(options.port, "4000");
});

test("parseArgs rejects --bootstrap combined with --defaults", () => {
  assert.throws(
    () => parseArgs(["--bootstrap", "--defaults"]),
    /cannot be combined/,
  );
});

test("parseArgs rejects --bootstrap combined with --preset", () => {
  assert.throws(
    () => parseArgs(["--bootstrap", "--preset", "learner"]),
    /cannot be combined/,
  );
});

test("CLI --bootstrap --serve writes bootstrap and starts intake server", async () => {
  const dir = mkdtempSync(join(tmpdir(), "create-hip-serve-"));
  const port = await getFreePort();
  const child = spawn(
    process.execPath,
    [cliPath, "--bootstrap", "--serve", "--port", String(port)],
    { cwd: dir },
  );

  try {
    const output = await waitForOutput(
      child,
      /HIP\.md intake server is running/,
    );
    assert.match(output, /Bootstrap HIP\.md written/);
    assert.match(
      readFileSync(join(dir, "HIP.md"), "utf8"),
      /hip-bootstrap: 1\.0/,
    );
  } finally {
    child.kill();
  }
});

test("CLI --serve starts intake server for an existing bootstrap HIP.md", async () => {
  const dir = mkdtempSync(join(tmpdir(), "create-hip-serve-"));
  await runCli(["--bootstrap"], dir);

  const port = await getFreePort();
  const child = spawn(
    process.execPath,
    [cliPath, "--serve", "--port", String(port)],
    { cwd: dir },
  );

  try {
    await waitForOutput(child, /HIP\.md intake server is running/);
  } finally {
    child.kill();
  }
});

test("hip-spec.json is in sync with constants.js", () => {
  const specPath = new URL("../../../../hip-spec.json", import.meta.url);
  const spec = JSON.parse(readFileSync(specPath, "utf8"));

  assert.equal(spec.version, SPEC_VERSION, "version mismatch");
  assert.deepEqual(
    spec.requiredSections,
    REQUIRED_SECTIONS,
    "requiredSections mismatch",
  );

  for (const [field, values] of Object.entries(VALID_VALUES)) {
    assert.deepEqual(
      spec.validValues[field],
      values,
      `validValues["${field}"] out of sync — run npm run generate-spec`,
    );
  }
});

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

function runCli(args, cwd) {
  const child = spawn(process.execPath, [cliPath, ...args], { cwd });
  return new Promise((resolve, reject) => {
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(output || `CLI exited with code ${code}`));
      }
    });
  });
}

function waitForOutput(child, pattern) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Timed out waiting for ${pattern}. Output:\n${output}`));
    }, 5000);

    function cleanup() {
      clearTimeout(timeout);
      child.stdout.off("data", onData);
      child.stderr.off("data", onData);
      child.off("exit", onExit);
      child.off("error", onError);
    }

    function onData(chunk) {
      output += chunk;
      if (pattern.test(output)) {
        cleanup();
        resolve(output);
      }
    }

    function onExit(code) {
      cleanup();
      reject(
        new Error(
          `CLI exited with code ${code} before ${pattern}. Output:\n${output}`,
        ),
      );
    }

    function onError(error) {
      cleanup();
      reject(error);
    }

    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", onExit);
    child.on("error", onError);
  });
}
