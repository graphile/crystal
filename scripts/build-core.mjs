import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function transformPackageJson(sourceFilePath, targetFilePath) {
  const packageJson = require(sourceFilePath);
  const newJson = { ...packageJson };
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
          if (range.length !== 1) {
            throw new Error(`Don't understand '${version}'`);
          }
          // Find the package's version
          const packageJson = JSON.parse(
            await fsp.readFile(
              `${__dirname}/../node_modules/${moduleName}/package.json`,
              "utf8",
            ),
          );
          deps[moduleName] = `${range}${packageJson.version}`;
          console.log(moduleName, deps[moduleName]);
        }
      }
    }
  }

  await fsp.writeFile(targetFilePath, JSON.stringify(newJson, null, 2));
}
