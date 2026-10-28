import { spawnSync } from "node:child_process";
import path from "node:path";

import { globSync } from "glob";

const packages = globSync(
  "{utils,grafast,graphile-build,postgraphile}/*/package.json",
);
let failed = false;
for (const manifest of packages.sort()) {
  const dir = path.dirname(manifest);
  const files = globSync(`${dir}/**/__tests__/**/*.{ts,tsx,mts}`, {
    ignore: [
      "**/node_modules/**",
      "**/dist/**",
      "**/release/**",
      "**/versioned_docs/**",
    ],
  });
  if (!files.length) continue;
  console.log(`Checking tests in ${dir}`);
  const result = spawnSync(
    "yarn",
    [
      "tsc",
      "--noEmit",
      "--strict",
      "--skipLibCheck",
      "--module",
      "nodenext",
      "--moduleResolution",
      "nodenext",
      "--allowImportingTsExtensions",
      "--target",
      "es2022",
      "--erasableSyntaxOnly",
      ...files,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) failed = true;
}
process.exitCode = failed ? 1 : 0;
