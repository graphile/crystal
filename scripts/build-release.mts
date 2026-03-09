/* global $, cd */

import "zx/globals";

import { existsSync } from "node:fs";
import fsp, { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function transformPackageJson(packageJson: any, targetFilePath: string) {
  const newJson = JSON.parse(JSON.stringify(packageJson));
  delete newJson.scripts;
  delete newJson.devDependencies;
  delete newJson.publishConfig.directory;

  for (const key in newJson) {
    if (
      key.endsWith("ependencies") &&
      typeof newJson[key] === "object" &&
      newJson[key] !== null
    ) {
      const deps = { ...newJson[key] };
      newJson[key] = deps;
      // Transform `workspace:` dependencies
      for (const moduleName in deps) {
        const version = deps[moduleName];
        if (typeof version === "string" && version.startsWith("workspace:")) {
          const range = version.substring(10);
          if (range.length > 1) {
            if (key !== "peerDependencies") {
              throw new Error(
                `${key} should typically not use explicit version range, otherwise changes may not be reflected accurately ${newJson.name}[${key}][${moduleName}] = ${version}`,
              );
            }
            deps[moduleName] = `${range}`;
          } else {
            if (key === "peerDependencies") {
              if (newJson.dependencies?.[moduleName]) {
                // This is okay; we're peer-depending _and_ regular depending.
              } else {
                throw new Error(
                  `${key} should use explicit version range, otherwise lots of unnecessary bumping may occur from changesets. ${newJson.name}[${key}][${moduleName}] = ${version}`,
                );
              }
            }
            // Find the package's version
            const packageJson = JSON.parse(
              await fsp.readFile(
                `${__dirname}/../node_modules/${moduleName}/package.json`,
                "utf8",
              ),
            );
            deps[moduleName] = `${range}${packageJson.version}`;
          }
          console.log(
            `packageJson.${key}[${JSON.stringify(moduleName)}] went from ${version} to ${deps[moduleName]}`,
          );
        }
      }
    }
  }

  await fsp.writeFile(targetFilePath, JSON.stringify(newJson, null, 2));
}

export async function esmHack(codePath: string) {
  const pkg = require(codePath);
  const code = await fsp.readFile(codePath, "utf8");

  await fsp.writeFile(
    codePath,
    `\
// Convince Node to allow ESM named imports
${Object.keys(pkg)
  .map(
    (varName) =>
      `${
        varName.match(/^[_a-zA-Z$][_a-zA-Z$0-9]*$/)
          ? `exports.${varName}`
          : `exports[${JSON.stringify(varName)}]`
      } = null /* placeholder */;`,
  )
  .join("\n")}

// Bundled module
${code}
`,
  );
}

export async function build() {
  const packagePath = process.cwd();
  const packageJson = JSON.parse(
    await readFile(`${packagePath}/package.json`, "utf8"),
  );

  const { private: isPrivate, publishConfig, name } = packageJson;
  if (isPrivate) {
    throw new Error(`Can't build private package`);
  }
  if (!publishConfig) {
    throw new Error(
      `Module ${name} not set up for publishing (no \`publishConfig\`)`,
    );
  }
  if (!publishConfig.directory) {
    throw new Error(`Module ${name} not has no release directory configured`);
  }
  if (publishConfig.directory !== "release") {
    throw new Error(
      `Module ${name} must have release directory 'release' (found: ${publishConfig.directory})`,
    );
  }

  await $`rm -Rf tsconfig*.tsbuildinfo dist release`;
  await $`yarn build`;
  await mkdir("release");
  for (const f of packageJson.files) {
    const stats = await stat(f);
    if (stats.isDirectory()) {
      await $`cp -a ${f} ${`release/${f}`}`;
    } else {
      await $`cp ${f} ${`release/${f}`}`;
    }
  }
  if (existsSync(`${packagePath}/.npmignore`)) {
    await $`cp .npmignore release/.npmignore`;
  }
  if (existsSync(`${packagePath}/src/.npmignore`)) {
    await $`cp src/.npmignore release/dist/.npmignore`;
  }
  await $`cp LICENSE.md README.md release/`;

  await transformPackageJson(
    packageJson,
    `${packagePath}/release/package.json`,
  );

  // Force yarn to treat this as it's own project, so `yarn pack` doesn't complain
  await $`touch release/yarn.lock`;

  // TODO: force GRAPHILE_ENV="production" and eliminate all related dead branches
}

if (import.meta.main) {
  await build();
}
