// @ts-check
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const WEBSITE_FOLDERS = [
  `${__dirname}/../postgraphile/website`,
  `${__dirname}/../grafast/website`,
  `${__dirname}/../graphile-build/website`,
  `${__dirname}/../utils/website`,
];
const regex = /\[(.*?)\]\((.*?)\)/g;

/** @param dir {string} */
async function walkDir(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  /** @type {string[]} */
  let result = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      result = result.concat(await walkDir(fullPath));
    } else {
      result.push(fullPath);
    }
  }
  return result;
}

/** @param link {string} */
function wrongLinkCheck(link) {
  const href = link.includes("#") ? link.substring(0, link.indexOf("#")) : link;
  if (href.startsWith("http")) {
    return false;
  } else if (href.endsWith("/")) {
    return true;
  } else {
    return false;
  }
}

async function main() {
  /** @type {string[]} */
  let allFiles = [];
  for (const directory of WEBSITE_FOLDERS) {
    const fileStructure = await walkDir(directory);
    const fileStructureFiltered = fileStructure.filter(
      (x) => x.endsWith(".md") || x.endsWith(".mdx"),
    );
    allFiles = allFiles.concat(fileStructureFiltered);
  }

  /** @type {Record<string, string[]>} */
  const wrongLinks = {};
  for (const file of allFiles) {
    const data = await readFile(file, "utf8");
    const matches = [...data.matchAll(regex)];

    /** @type {string[]} */
    const links = [];

    matches.forEach((match) => {
      links.push(match[2]);
    });
    const localwrongLinks = [];
    for (const link of links) {
      if (wrongLinkCheck(link)) {
        localwrongLinks.push(link);
      }
    }
    if (localwrongLinks.length >= 1) {
      wrongLinks[file] = localwrongLinks;
    }
  }

  if (Object.keys(wrongLinks).length === 0) {
    console.log("All files pass checks");
  } else {
    console.log(
      `Found ${
        Object.keys(wrongLinks).length
      } files containing links ending in a slash; this will likely cause issues with navigation when deployed. Please remove the trailing slash from the following URLs:`,
    );
    for (const [filename, failures] of Object.entries(wrongLinks)) {
      console.log(
        `${path.relative(`${__dirname}/..`, filename)}:\n\n    ${failures
          .join("\n")
          .replace(/\n/g, "\n    ")}\n`,
      );
    }
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
