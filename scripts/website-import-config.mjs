import { execFile } from "node:child_process";
import { glob, readFile, writeFile } from "node:fs/promises";
import { promisify, stripVTControlCharacters } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = import.meta.dirname;

const PROJECTS = {
  grafserv: {
    cwd: "grafast/grafserv",
    scope: "grafserv",
  },
  grafast: {
    cwd: "grafast/grafast",
    scope: "grafast",
  },
  postgraphile: {
    cwd: "postgraphile/postgraphile",
    scope: "postgraphile",
    extraArgs: ["-C", "graphile.config.vanilla.ts"],
  },
};

const START = "<!-- START:OPTIONS:";
const START_END = "-->";

const documentationFiles = await Array.fromAsync(
  glob(
    "{grafast,postgraphile,graphile-build,utils}/website/**/*/**/*.{md,mdx}",
    { exclude: ["**/node_modules/**", "**/versioned_docs/**"] },
  ),
);

await Promise.all(
  documentationFiles.map(async (file) => {
    const original = await readFile(file, "utf8");
    let contents = original;
    let i = -1;
    while ((i = contents.indexOf(START, i)) && i >= 0) {
      const j = contents.indexOf(START_END, i);
      if (j < 0) {
        throw new Error(`${START} found but not ${START_END}!`);
      }
      const optionsFor = contents.slice(i + START.length, j).trim();
      const contentStart = j + START_END.length;
      const startTag = contents.slice(i, contentStart);
      const closeTag = startTag.replace(/<!-- START/, "<!-- END");
      const closeTagPosition = contents.indexOf(closeTag, contentStart);
      if (closeTagPosition < 0) {
        throw new Error(`${startTag} found, but no ${closeTag}!`);
      }
      const newContent = await getContentFor(optionsFor);
      contents =
        contents.slice(0, contentStart) +
        "\n\n" +
        newContent +
        "\n\n" +
        contents.slice(closeTagPosition);
      i = closeTagPosition + closeTag.length;
    }
    if (contents !== original) {
      await writeFile(file, contents);
    }
  }),
);

async function getContentFor(project) {
  const config = PROJECTS[project];
  if (!config) throw new Error(`Unknown project ${JSON.stringify(project)}`);
  const { cwd, scope, extraArgs = [] } = config;
  const result = await execFileAsync(
    `${__dirname}/../utils/graphile/dist/cli-run.js`,
    ["config", "options", ...extraArgs, scope],
    { cwd, encoding: "utf8" },
  );
  if (result.stderr.trim().length > 0) {
    console.error(result.stderr);
  }
  return stripVTControlCharacters(result.stdout).trim();
}
