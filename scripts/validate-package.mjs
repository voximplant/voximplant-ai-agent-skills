import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const pluginRoot = path.join(repoRoot, "plugins", "voximplant-ai-agent-skills");
const skillsRoot = path.join(pluginRoot, "skills");

const requiredJsonFiles = [
  ".cursor-plugin/marketplace.json",
  ".claude-plugin/marketplace.json",
  ".agents/plugins/marketplace.json",
  "plugins/voximplant-ai-agent-skills/.cursor-plugin/plugin.json",
  "plugins/voximplant-ai-agent-skills/.claude-plugin/plugin.json",
  "plugins/voximplant-ai-agent-skills/.codex-plugin/plugin.json",
];

const forbiddenNamePatterns = [
  /\.env$/i,
  /\.env\./i,
  /\.pem$/i,
  /\.key$/i,
  /_private\.json$/i,
  /service-account.*\.json$/i,
  /credentials.*\.json$/i,
  /recordings[\\/]/i,
  /logs[\\/]/i,
];

const forbiddenContentPatterns = [
  /\bMCP\b/,
  /_mcp/i,
  /searchDocs/,
  /Fern MCP/i,
];

const errors = [];

function fail(message) {
  errors.push(message);
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walk(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return [fullPath];
  });
}

function validateJson() {
  for (const file of requiredJsonFiles) {
    const fullPath = path.join(repoRoot, file);
    if (!fs.existsSync(fullPath)) {
      fail(`Missing JSON file: ${file}`);
      continue;
    }

    try {
      JSON.parse(readText(fullPath));
    } catch (error) {
      fail(`Invalid JSON in ${file}: ${error.message}`);
    }
  }
}

function validateManifestPaths() {
  for (const file of requiredJsonFiles) {
    const fullPath = path.join(repoRoot, file);
    if (!fs.existsSync(fullPath)) {
      continue;
    }

    const content = readText(fullPath);
    if (content.includes("../")) {
      fail(`Manifest must not use parent path navigation: ${file}`);
    }

    const json = JSON.parse(content);
    for (const key of ["skills", "rules", "agents", "commands", "hooks", "mcpServers"]) {
      const value = json[key];
      const values = Array.isArray(value) ? value : value ? [value] : [];
      for (const item of values) {
        if (typeof item === "string" && item.includes("/") && !item.startsWith("./")) {
          fail(`Manifest path "${item}" in ${file} should start with ./`);
        }
      }
    }
  }
}

function validateSkills() {
  if (!fs.existsSync(skillsRoot)) {
    fail("Missing plugin skills directory");
    return;
  }

  const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  if (skillDirs.length === 0) {
    fail("No skills found");
  }

  for (const entry of skillDirs) {
    const skillPath = path.join(skillsRoot, entry.name);
    const skillFile = path.join(skillPath, "SKILL.md");
    if (!fs.existsSync(skillFile)) {
      fail(`Missing SKILL.md in ${relative(skillPath)}`);
      continue;
    }

    const content = readText(skillFile);
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) {
      fail(`Missing YAML frontmatter in ${relative(skillFile)}`);
      continue;
    }

    const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();

    if (name !== entry.name) {
      fail(`Skill name "${name}" must match folder "${entry.name}"`);
    }
    if (!description) {
      fail(`Missing description in ${relative(skillFile)}`);
    }
  }
}

function validateNoForbiddenFiles() {
  for (const file of walk(repoRoot)) {
    const rel = relative(file);
    if (rel.startsWith(".git/")) {
      continue;
    }

    if (forbiddenNamePatterns.some((pattern) => pattern.test(rel))) {
      fail(`Forbidden file pattern in package: ${rel}`);
    }
  }
}

function validateNoForbiddenContent() {
  const textFiles = walk(repoRoot).filter((file) => {
    const rel = relative(file);
    return !rel.startsWith(".git/") && /\.(md|json|yaml|yml|mjs|txt)$/.test(rel);
  });

  for (const file of textFiles) {
    const rel = relative(file);
    if (rel === "scripts/validate-package.mjs") {
      continue;
    }

    const content = readText(file);
    for (const pattern of forbiddenContentPatterns) {
      if (pattern.test(content)) {
        fail(`Forbidden docs MCP reference in ${rel}: ${pattern}`);
      }
    }
  }
}

validateJson();
validateManifestPaths();
validateSkills();
validateNoForbiddenFiles();
validateNoForbiddenContent();

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("Package validation passed.");
