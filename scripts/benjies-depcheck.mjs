// This is a massively simplified but custom depcheck that catches issues that depcheck itself doesn't.

import { glob } from "glob";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import babel from "@babel/core";
import { basename } from "node:path";

const NODE_MODULES = ["fs", "path", "url", "util", "crypto", "events"];

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const pack = await fs.readFile(`${__dirname}/../pack.sh`, "utf8");
const packages = pack
  .split("\n")
  .filter(
    (t) =>
      t.startsWith("cd ") &&
      t.includes("/") &&
      !t.includes(".") &&
      !t.startsWith("cd /"),
  )
  .map((str) => str.slice(3));

const fails = [];
for (const packagePath of packages) {
  const dir = `${__dirname}/../${packagePath}`;
  const packageJson = JSON.parse(
    await fs.readFile(`${dir}/package.json`, "utf8"),
  );
  console.log(packageJson.name);
  if (!packageJson.files) {
    throw new Error(`${packageJson.name} has no "files" export!`);
  }
  const positiveMatches = await glob(
    [...packageJson.files, ...packageJson.files.map((f) => `${f}/**`)],
    {
      cwd: dir,
      nodir: true,
    },
  );
  let negativeMatches;
  try {
    const npmIgnore = await fs.readFile(`${dir}/src/.npmignore`, "utf8");
    const ignores = npmIgnore
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.match(/^[a-zA-Z/]/))
      .map((l) => (l.startsWith("/") ? `dist${l}` : `dist/**/${l}`));
    negativeMatches = await glob(
      [...ignores, ...ignores.map((f) => `${f}/**`)],
      {
        cwd: dir,
        nodir: true,
      },
    );
  } catch {}
  const allFiles = negativeMatches
    ? positiveMatches.filter((m) => !negativeMatches.includes(m))
    : positiveMatches;
  const jsFiles = allFiles.filter((f) => f.endsWith(".js"));
  const requires = new Set();
  const walkerPlugin = newWalkerPlugin(requires);
  for (const file of jsFiles) {
    const filePath = `${dir}/${file}`;
    const content = await fs.readFile(filePath, "utf8");
    console.log(`  ${file}`);
    await babel.transformAsync(content, {
      filename: basename(filePath),
      plugins: [walkerPlugin],
    });
  }
  for (const moduleName of requires) {
    if (NODE_MODULES.includes(moduleName)) {
      continue;
    }
    console.log(`  - ${moduleName}`);
    if (
      !packageJson.dependencies?.[moduleName] &&
      !packageJson.peerDependencies?.[moduleName] &&
      !packageJson.optionalDependencies?.[moduleName]
    ) {
      fails.push([packageJson.name, moduleName]);
    }
  }
}

if (fails.length) {
  console.log();
  console.log();
  console.log();
  console.log("# MISSING DEPENDENCIES FOUND!");
  for (const [packageName, moduleName] of fails) {
    console.log(`${packageName} should depend on ${moduleName}`);
  }
  process.exit(1);
}

function newWalkerPlugin(requires) {
  /** @type {import("@babel/core").PluginObj} */
  const walkerPlugin = {
    //name: "walker",
    visitor: {
      CallExpression: {
        enter(n) {
          const node = n.node;
          if (
            node.callee.type === "Identifier" &&
            node.callee.name === "require"
          ) {
            const arg = node.arguments[0];
            if (arg.type === "StringLiteral") {
              if (
                !arg.value.startsWith(".") &&
                !arg.value.startsWith("node:")
              ) {
                const parts = arg.value.split("/");
                if (parts[0].startsWith("@")) {
                  requires.add(`${parts[0]}/${parts[1]}`);
                } else {
                  requires.add(parts[0]);
                }
              }
            } else {
              // Dynamic require? Ignore
            }
          }
        },
      },
    },
  };
  return walkerPlugin;
}
