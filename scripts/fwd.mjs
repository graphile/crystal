import * as fs from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { rimraf } from "rimraf";

const __dirname = fileURLToPath(new URL(".", import.meta.url)).replace(
  /\/+$/,
  "",
);

const todo = {
  grafast: {
    graphql: true,
  },
  grafserv: {
    ruru: true,
  },
  "graphile-build-pg": {
    "pg-introspection": true,
  },
  postgraphile: {
    "@dataplan/pg/adaptors/pg": "./adaptors/pg",

    "grafast/graphql": "./graphql",
    "@dataplan/json": true,
    "@dataplan/pg": true,
    grafast: true,
    grafserv: true,
    "graphile-build": true,
    "graphile-build-pg": true,
    "pg-sql2": true,
    tamedevil: true,
    "graphile-utils": "./utils",
  },
  pgl: {
    "postgraphile/presets/amber": "./amber",
    "postgraphile/presets/v4": "./v4",
    "postgraphile/presets/relay": "./relay",

    "@dataplan/pg/adaptors/pg": "./adaptors/pg",

    "grafast/graphql": "./graphql",
    "@dataplan/json": true,
    "@dataplan/pg": true,
    grafast: true,
    grafserv: true,
    "graphile-build": true,
    "graphile-build-pg": true,
    "pg-sql2": true,
    tamedevil: true,
    "postgraphile/utils": "./utils",
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
  await mkdirp(fwdDir);
  const obj = {
    types: `./fwd/${target}/index.d.ts`,
    node: `./fwd/${target}/index.js`,
    default: `./fwd/${target}/index.js`,
  };
  const disableEslint = target === "graphile-build";
  await fs.writeFile(
    `${fwdDir}/index.d.ts`,
    `\
${disableEslint ? `// eslint-disable-next-line import/export\n` : ``}\
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
    await rimraf(`${rootPath}/fwd`);
    const packageJson = await loadJSON(`${rootPath}/package.json`);
    if (!packageJson.files.includes("fwd")) {
      packageJson.files.push("fwd");
    }
    if (packageJson.exports) {
      // Delete all the old fwds
      for (const [key, spec] of Object.entries(packageJson.exports)) {
        if (spec.types.startsWith("./fwd/")) {
          delete packageJson.exports[key];
        }
      }
    }
    for (const target in packageTodo) {
      const spec = packageTodo[target];
      if (spec === true) {
        // Expand
        const targetPackageJson = await loadJSON(
          `${__dirname}/../node_modules/${target}/package.json`,
        );
        if (targetPackageJson.exports) {
          for (const targetExportName in targetPackageJson.exports) {
            // Trim the ./
            const subpath = targetExportName.slice(2);
            const exportName = `./${target}${subpath ? "/" + subpath : ""}`;
            const thisTarget = `${target}${subpath ? "/" + subpath : ""}`;
            packageJson.exports[exportName] = await makeFwd(
              rootPath,
              thisTarget,
            );
          }
        } else {
          packageJson.exports[`./${target}`] = await makeFwd(rootPath, target);
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
  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
