import { execFile } from "node:child_process";
import { glob, readFile, writeFile } from "node:fs/promises";
import { promisify, stripVTControlCharacters } from "node:util";

const execFileAsync = promisify(execFile);
const __dirname = import.meta.dirname;

const postgraphileBase = {
  cwd: "postgraphile/postgraphile",
  extraArgs: ["-C", "graphile.config.vanilla.ts"],
};

const OPTIONS = {
  grafserv: {
    cwd: "grafast/grafserv",
    scope: "grafserv",
  },
  grafast: {
    cwd: "grafast/grafast",
    scope: "grafast",
  },
  ruru: {
    cwd: "grafast/ruru",
    scope: "ruru",
    extraArgs: ["-C", "graphile.config.mts"],
  },
  postgraphile_inflection: {
    ...postgraphileBase,
    scope: "inflection",
  },
  postgraphile_gather: {
    ...postgraphileBase,
    scope: "gather",
  },
  postgraphile_schema: {
    ...postgraphileBase,
    scope: "schema",
  },
  postgraphile_grafast: {
    ...postgraphileBase,
    scope: "grafast",
  },
  postgraphile_grafserv: {
    ...postgraphileBase,
    scope: "grafserv",
  },
  postgraphile_ruru: {
    ...postgraphileBase,
    scope: "ruru",
  },
};

const INFLECTION = {
  postgraphile: {
    ...postgraphileBase,
  },
};

const START = "<!-- START:";
const START_END = "-->";
const END = "<!-- END:";

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
      const topic = contents.slice(i + START.length, j).trim();
      const contentStart = j + START_END.length;
      const startTag = contents.slice(i, contentStart);
      const closeTag = startTag.replace(START, END);
      const closeTagPosition = contents.indexOf(closeTag, contentStart);
      if (closeTagPosition < 0) {
        throw new Error(`${startTag} found, but no ${closeTag}!`);
      }
      const newContent = await getContentFor(topic);
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

async function getContentFor(topic) {
  const parts = topic.split(":");
  if (parts[0] === "OPTIONS") {
    return getContentForOptions(parts[1]);
  } else if (parts[0] === "INFLECTION") {
    return getContentForInflection(parts[1]);
  } else {
    throw new Error(`Didn't understand <!-- START:${topic} -->`);
  }
}

async function getContentForOptions(project) {
  const config = OPTIONS[project];
  if (!config) {
    throw new Error(`Unknown options scope ${JSON.stringify(project)}`);
  }
  const { cwd, scope, extraArgs = [] } = config;
  return graphile(cwd, ["config", "options", ...extraArgs, scope]);
}

async function getContentForInflection(project) {
  const config = INFLECTION[project];
  if (!config) {
    throw new Error(`Unknown inflection scope ${JSON.stringify(project)}`);
  }
  const { cwd, extraArgs = [] } = config;
  return graphile(cwd, ["inflection", "list", "--quiet", ...extraArgs]);
}

async function graphile(cwd, flags) {
  const result = await execFileAsync(
    `${__dirname}/../utils/graphile/dist/cli-run.js`,
    flags,
    { cwd, encoding: "utf8" },
  );
  if (result.stderr.trim().length > 0) {
    console.error(result.stderr);
  }
  return stripVTControlCharacters(result.stdout).trim();
}
