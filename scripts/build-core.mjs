import fsp from "node:fs/promises";
import { createCipheriv, randomFillSync, scryptSync } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function writePrereleaseLicense(filePath) {
  await fsp.writeFile(
    filePath,
    `\
# Graphile Sponsors-only Software

Copyright © 2022 Benjie Gillam. All rights reserved.

This package is _not_ (yet) open source software, it may only be used by
graphile sponsors. for more information, please see https://grafast.org

This is explicitly pre-release software, it has not yet gone through rigorous
testing and probably includes security and stability issues both known and
unknown. Usage of this software is entirely at your own risk.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

The contents of the \`node_modules\` directory are produced from external
libraries; their license terms will likely differ from the terms above - you
should review them also.

Licenses of bundled dependencies (if any) are detailed in dist/LICENSES.txt
`,
  );
}

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

  // Change license
  newJson.license = "SEE LICENSE IN LICENSE.md";
  await fsp.writeFile(targetFilePath, JSON.stringify(newJson, null, 2));
}

function loadPackageJson(codePath) {
  const pkgPath = path.dirname(codePath) + "/package.json";
  try {
    return require(pkgPath);
  } catch (e) {
    return loadPackageJson(path.dirname(codePath));
  }
}

export async function encryptSourceFile(codePath) {
  const pkg = require(codePath);
  const packageJSON = loadPackageJson(codePath);
  const code = await fsp.readFile(codePath, "utf8");
  // I_SPONSOR_GRAPHILE=and_acknowledge_prerelease_caveats
  const password = "and_acknowledge_prerelease_caveats";
  const salt =
    `We wouldn't be able to do so much OSS without sponsorship. ` +
    String(Math.random()).slice(2);
  const algorithm = "aes-192-cbc";

  const key = scryptSync(password, salt, 24);
  const iv = randomFillSync(new Uint8Array(16));
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted =
    cipher.update(code, "utf8", "base64") + cipher.final("base64");

  await fsp.writeFile(
    codePath,
    `\
const { Buffer } = require('node:buffer');
const { scryptSync, createDecipheriv } = require('node:crypto');
const pkgName = ${JSON.stringify(packageJSON.name)};
const pkgVersion = ${JSON.stringify(packageJSON.version)};

const RESET = '\\x1b[0m';
const BOLD_BLACK_ON_RED = '\\x1b[40;31;1;7m';
const RED = '\\x1b[31m';
const BOLD = '\\x1b[1m';
const BOLD_BLUE = '\\x1b[34;1m';
const BOLD_BLUE_UNDERLINED = '\\x1b[34;1;4m';

const iSponsorGraphile = \`\${RESET}\${BOLD_BLUE}I_SPONSOR_GRAPHILE\${RESET}\${RED}\`;
const website = \`\${RESET}\${BOLD_BLUE_UNDERLINED}https://grafast.org\${RESET}\`;
const errorPrefix = \`\${BOLD_BLACK_ON_RED}[  ERROR  ]\${RESET} \${RED}\`;
const errorSuffix = \`\${RESET}\n\${BOLD_BLACK_ON_RED}[ CONTEXT ]\${RESET} \${RED}You are attempting to run pre-release software that is only available to Graphile sponsors.\${RESET}\n\nPlease refer to the \${website} documentation for the right code to use with this version '\${BOLD}\${pkgName}@\${pkgVersion}\${RESET}'.\${RESET}\n\`;

const password = process.env.I_SPONSOR_GRAPHILE;
if (typeof password !== 'string') {
  console.error(
    \`\${errorPrefix}You must set the \${iSponsorGraphile} environmental variable to the shared secret to use this pre-release software.\${errorSuffix}\`,
  );
  process.exit(42);
}

const algorithm = ${JSON.stringify(algorithm)};
const salt = ${JSON.stringify(salt)};
const key = scryptSync(password, salt, 24);
const ivBuffer = Buffer.from(${JSON.stringify(
      Buffer.from(iv).toString("base64"),
    )}, "base64");
const iv = new Uint8Array(ivBuffer.buffer, ivBuffer.byteOffset, ivBuffer.length);
const decipher = createDecipheriv(algorithm, key, iv);
const encrypted = ${JSON.stringify(encrypted)}
let decrypted;
try {
  decrypted = decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
} catch (e) {
  console.error(
    \`\${errorPrefix}The value for the \${iSponsorGraphile} environmental variable (value: '\${password.slice(
      0,
      2,
    )}...\${password.slice(-2)}') is incorrect.\${errorSuffix}\`,
  );
  process.exit(42);
}

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

// Load our decrypted module
eval(decrypted);
`,
  );
}
