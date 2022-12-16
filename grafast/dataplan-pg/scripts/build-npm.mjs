#!/usr/bin/env zx

import "zx/globals";

import fsp from "fs/promises";
import { createCipheriv, randomFillSync, scryptSync } from "node:crypto";

cd(__dirname + "/..");
await $`rm -Rf tsconfig.tsbuildinfo dist release`;
await $`tsc -b`;
await $`webpack --mode=production`;
await $`cp dist/*.d.ts release/dist/`;
await $`cp README.npm.md release/README.md`;

const packageJson = require("../package.json");
const newJson = { ...packageJson };
delete newJson.scripts;
delete newJson.devDependencies;
delete newJson.publishConfig.directory;

// Change license
newJson.license = "SEE LICENSE IN LICENSE.md";
await fsp.writeFile(
  __dirname + "/../release/LICENSE.md",
  `\
# Graphile Sponsors-only Software

Copyright © 2022 Benjie Gillam. All rights reserved.

This package is _NOT_ open source software, it may only be used by Graphile
sponsors. For more information, please see https://grafast.org

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
`,
);

await fsp.writeFile(
  __dirname + "/../release/package.json",
  JSON.stringify(newJson, null, 2),
);

const code = await fsp.readFile(
  __dirname + "/../release/dist/index.js",
  "utf8",
);
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
  __dirname + "/../release/dist/index.js",
  `\
const { Buffer } = require('node:buffer');
const { scryptSync, createDecipheriv } = require('node:crypto');
const pkg = require('../package.json');

const RESET = '\x1b[0m';
const BOLD_BLACK_ON_RED = '\x1b[40;31;1;7m';
const RED = '\x1b[31m';
const BOLD = '\x1b[1m';
const BOLD_BLUE = '\x1b[34;1m';
const BOLD_BLUE_UNDERLINED = '\x1b[34;1;4m';

const iSponsorGraphile = \`\${RESET}\${BOLD_BLUE}I_SPONSOR_GRAPHILE\${RESET}\${RED}\`;
const website = \`\${RESET}\${BOLD_BLUE_UNDERLINED}https://grafast.org\${RESET}\`;
const errorPrefix = \`\${BOLD_BLACK_ON_RED}[  ERROR  ]\${RESET} \${RED}\`;
const errorSuffix = \`\${RESET}\n\${BOLD_BLACK_ON_RED}[ CONTEXT ]\${RESET} \${RED}You are attempting to run pre-release software that is only available to Graphile sponsors.\${RESET}\n\nPlease refer to the \${website} documentation for the right code to use with this version '\${BOLD}\${pkg.name}@\${pkg.version}\${RESET}'.\${RESET}\n\`;

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
eval(decrypted);
`,
);
