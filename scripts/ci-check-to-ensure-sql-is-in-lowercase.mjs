import fs from "fs";
import path from "path";

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

async function walkDir(dir) {
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  let result = [];

  for (let file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      result = result.concat(await walkDir(fullPath));
    } else {
      result.push(fullPath);
    }
  }
  return result;
}

async function readFileAsync(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

function wrongSQLCheck(segment) {
  if (keywords.some((keyword) => segment.includes(keyword))) {
    return true;
  } else {
    return false;
  }
}

(async () => {
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
    const data = await readFileAsync(file);
    const matches = [...data.matchAll(regex)];

    let sqlSegments = [];

    matches.forEach((match) => {
      sqlSegments.push(match[1]);
    });
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

  console.log(
    Object.keys(wrongSQL),
    `The above ${Object.keys(wrongSQL).length} files contain capital SQL.`,
  );

  if (wrongSQL.length !== 0) {
    process.exitCode = 1;
  }
})();
