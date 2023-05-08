const child_process = require("child_process");
const { readFileSync } = require("fs");

const output = child_process.execSync(
  "yarn workspaces list --json --recursive --no-private",
  {
    encoding: "utf8",
  },
);

// TODO: handle special characters if any
const mermaidEscape = (str) => str;

const nodeName = (str) => str.replace(/[^a-z0-9]+/g, "_");

/** @type {Array<{location: string, name: string}>} */
const workspaces = JSON.parse(
  "[" + output.replace(/\n/g, ",").replace(/,+$/, "") + "]",
).sort((a, z) => a.location.localeCompare(z.location));

const workspaceModuleNames = workspaces.map((w) => w.name);

/** @type {{[name: string]: string[]}} */
const groups = Object.create(null);
const relations = [];

for (const workspace of workspaces) {
  const i = workspace.location.lastIndexOf("/");
  const groupName = i >= 0 ? `~/${workspace.location.substring(0, i)}` : `~`;
  if (!groups[groupName]) {
    groups[groupName] = [];
  }
  groups[groupName].push(
    nodeName(workspace.name) + `["${mermaidEscape(workspace.name)}"]`,
  );
  const packageJson = JSON.parse(
    readFileSync(`${workspace.location}/package.json`, "utf8"),
  );
  for (const moduleName of Object.keys(packageJson.dependencies ?? {})) {
    if (workspaceModuleNames.includes(moduleName)) {
      relations.push(`${nodeName(moduleName)} --> ${nodeName(workspace.name)}`);
    }
  }
}

/** @type {Array<string>} */
const diagramLines = [`graph TD`];
for (const groupName in groups) {
  const mods = groups[groupName];
  diagramLines.push(
    `    subgraph ${nodeName(groupName)} "${mermaidEscape(groupName)}"`,
  );
  for (const mod of mods) {
    diagramLines.push(`      ${mod}`);
  }
  diagramLines.push(`    end`);
}
for (const relation of relations) {
  diagramLines.push(`    ${relation}`);
}

console.log(diagramLines.join("\n"));
