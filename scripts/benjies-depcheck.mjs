// This is a massively simplified but custom depcheck that catches issues that depcheck itself doesn't.

import { glob } from "glob";
import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import babel from "@babel/core";
import { basename } from "node:path";

const NODE_MODULES = [
  "assert",
  "crypto",
  "events",
  "fs",
  "path",
  "url",
  "util",
];

const __dirname = fileURLToPath(new URL(".", import.meta.url)).replace(
  /\/+$/,
  "",
);

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
  .map((str) => str.slice(3).replace(/\/+$/, ""));

function resolveExternals(externals) {
  if (Array.isArray(externals)) {
    return externals.flatMap(resolveExternals);
  } else if (typeof externals === "object" && externals !== null) {
    return Object.keys(externals);
  } else {
    throw new Error(`Unsupported externals`);
  }
}

const fails = [];
const warnings = [];
const all = {};
for (const packagePath of packages) {
  try {
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

    const webpackConfig = `${dir}/webpack.config.js`;
    try {
      const config = (await import(webpackConfig)).default;
      const externals = resolveExternals(config.externals);
      for (const moduleName of requires) {
        if (
          !externals.includes(moduleName) &&
          !externals.some((e) => e.startsWith(`${moduleName}/`))
        ) {
          requires.delete(moduleName);
        }
      }
    } catch (e) {}

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
        fails.push(`${packageJson.name} should depend on ${moduleName}`);
      }
    }
    all[packageJson.name] = {
      name: packageJson.name,
      packagePath,
      packageJson,
      requires,
    };
  } catch (e) {
    console.error(e);
    console.error(`Above error occurred whilst processing ${packagePath}`);
    process.exit(1);
  }
}

// Now check peerDependencies.
// For each package A that depends or peerDepends on another package B, A must provide B's peerDependencies
for (const module of Object.values(all)) {
  const {
    name,
    packageJson: { dependencies, peerDependencies },
  } = module;
  const check = (dependencies, isPeer) => {
    for (const depModuleName in dependencies) {
      const dep = all[depModuleName];
      if (dep) {
        const depPeerDeps = dep.packageJson.peerDependencies;
        if (depPeerDeps) {
          for (const peerDepName in depPeerDeps) {
            if (
              !dependencies?.[peerDepName] &&
              !peerDependencies?.[peerDepName]
            ) {
              // Check if it's optional
              if (
                !dep.packageJson.peerDependenciesMeta?.[peerDepName]?.optional
              ) {
                fails.push(
                  `${name} should provide "${peerDepName}": "${
                    depPeerDeps[peerDepName]
                  }" because it's peer dependended on by ${
                    isPeer ? "peer " : ""
                  }dependency ${dep.name}.`,
                );
              } else {
                warnings.push(
                  `${name} should provide "${peerDepName}": "${
                    depPeerDeps[peerDepName]
                  }" because it's peer dependend on by ${
                    isPeer ? "peer " : ""
                  }dependency ${dep.name}.`,
                );
              }
            }
          }
        }
      } else {
        // Out of scope
      }
    }
  };
  if (dependencies) {
    check(dependencies);
  }
  if (peerDependencies) {
    check(peerDependencies, true);
  }
}

if (warnings.length) {
  console.log();
  console.log();
  console.log();
  console.log("# WARNINGS");
  for (const message of warnings) {
    console.log(message);
  }
}
if (fails.length) {
  console.log();
  console.log();
  console.log();
  console.log("# MISSING DEPENDENCIES FOUND!");
  for (const message of fails) {
    console.log(message);
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
