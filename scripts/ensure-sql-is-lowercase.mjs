// @ts-check
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const { dirname: __dirname } = import.meta;

const regex = /^```sql\n([\s\S]*?)\n```$/gm;
const keywords = [
  "SELECT",
  "UPDATE",
  "INSERT",
  "DELETE",
  "WITH",
  "FROM",
  "WHERE",
  "ORDER BY",
  "GROUP BY",
  "HAVING",
  "AS",
  "VALUES",
];

const WEBSITE_FOLDERS = [
  `${__dirname}/../postgraphile/website`,
  `${__dirname}/../grafast/website`,
  `${__dirname}/../graphile-build/website`,
  `${__dirname}/../utils/website`,
];

/**
 * @param dir {string} - the directory to walk
 */
async function walkDir(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  /** @type {string[]} */
  let result = [];

  for (let file of files) {
    // Skip over versioned docs
    if (file.name === "versioned_docs") continue;
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      result = result.concat(await walkDir(fullPath));
    } else {
      result.push(fullPath);
    }
  }
  return result;
}

/**
 * @param segment {string} - the segment of text to check
 */
function wrongSQLCheck(segment) {
  return keywords.some((keyword) =>
    segment
      .replace(/\/\*[^*]+\*\//g, "")
      .replace(/--.*$/gm, "")
      .includes(keyword),
  );
}

async function main() {
  let allFiles = [];
  for (const directory of WEBSITE_FOLDERS) {
    const fileStructure = await walkDir(directory);
    const fileStructureFiltered = fileStructure.filter(
      (x) => x.endsWith(".md") || x.endsWith(".mdx"),
    );
    allFiles = allFiles.concat(fileStructureFiltered);
  }

  let wrongSQL = {};
  for (const file of allFiles) {
    const data = await readFile(file, "utf8");
    const matches = [...data.matchAll(regex)];

    /** @type {string[]} */
    let sqlSegments = [];

    matches.forEach((match) => {
      sqlSegments.push(match[1]);
    });
    /** @type {string[]} */
    let localwrongSQL = [];
    for (const segment of sqlSegments) {
      if (wrongSQLCheck(segment)) {
        localwrongSQL.push(segment);
      }
    }
    if (localwrongSQL.length >= 1) {
      wrongSQL[file] = localwrongSQL;
    }
  }

  if (wrongSQL.length === 0) {
    console.log("All files pass checks");
  } else {
    console.log(
      `Found ${
        Object.keys(wrongSQL).length
      } files containing capitalized SQL; the Graphile style guide encourages the use of lower case SQL. Please lowercase the SQL in the following files:`,
    );
    console.dir(wrongSQL);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
