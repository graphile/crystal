import * as fs from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url)).replace(
  /\/+$/,
  "",
);

const todo = {
  postgraphile: {
    "@dataplan/pg": true,
    "@dataplan/pg/adaptors/pg": "./adaptors/pg",
    grafast: true,
    grafserv: true,
  },
};

const jsonCache = Object.create(null);
function loadJSON(path) {
  if (!jsonCache[path]) {
    jsonCache[path] = (async () => {
      const data = await fs.readFile(path, "utf8");
      const json = JSON.parse(data);
      jsonCache[path] = json;
      return json;
    })();
  }
  return jsonCache[path];
}

async function mkdirp(path) {
  const dir = dirname(path);
  if (!dir || dir === path) throw new Error(`Failed to mkdirp`);
  try {
    // See if parent exists
    await fs.stat(dir);
  } catch (e) {
    // Make parent
    await mkdirp(dir);
  }
  try {
    await fs.mkdir(path);
  } catch (e) {
    if (e.code !== "EEXIST") {
      throw e;
    }
  }
}

async function makeFwd(rootPath, target) {
  const fwdDir = `${rootPath}/fwd/${target}`;
  console.log({ fwdDir, path: `${fwdDir}/index.d.ts` });
  await mkdirp(fwdDir);
  const obj = {
    types: `./fwd/${target}/index.d.ts`,
    node: `./fwd/${target}/index.js`,
    default: `./fwd/${target}/index.js`,
  };
  console.log({ obj });
  await fs.writeFile(
    `${fwdDir}/index.d.ts`,
    `\
export * from "${target}";
`,
  );
  await fs.writeFile(
    `${fwdDir}/index.js`,
    `\
module.exports = require("${target}");
`,
  );
  return obj;
}

async function main() {
  for (const packageName in todo) {
    const packageTodo = todo[packageName];
    const rootPath = `${__dirname}/../node_modules/${packageName}`;
    console.log({ packageName, rootPath });
    const packageJson = await loadJSON(`${rootPath}/package.json`);
    for (const target in packageTodo) {
      const spec = packageTodo[target];
      if (spec === true) {
        // Expand
        const targetPackageJson = await loadJSON(
          `${__dirname}/../node_modules/${target}/package.json`,
        );
        console.log({ packageName, rootPath, target, spec });
        for (const targetExportName in targetPackageJson.exports) {
          // Trim the ./
          const subpath = targetExportName.slice(2);
          const exportName = `./${target}${subpath ? "/" + subpath : ""}`;
          const thisTarget = `${target}${subpath ? "/" + subpath : ""}`;
          packageJson.exports[exportName] = await makeFwd(rootPath, thisTarget);
        }
      } else {
        // Direct
        packageJson.exports[spec] = await makeFwd(rootPath, target);
      }
    }
    await fs.writeFile(
      `${rootPath}/package.json`,
      JSON.stringify(packageJson, null, 2) + "\n",
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
