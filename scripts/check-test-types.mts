import { glob, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const workspaces = packageJson.workspaces as string[];
const modulePackageJsons = workspaces.map((w) => w + "/package.json");
for await (const manifest of glob(modulePackageJsons)) {
  const dir = path.dirname(manifest);
  const files: string[] = [];
  for await (const file of glob(`${dir}/**/__tests__/**/*.{ts,tsx,mts}`, {
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/release/**",
      "**/versioned_docs/**",
    ],
  })) {
    files.push(file);
  }
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
  if (result.status !== 0) process.exitCode = 1;
}
