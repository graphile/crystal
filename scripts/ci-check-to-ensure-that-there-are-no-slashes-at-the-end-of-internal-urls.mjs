import fs from "fs";
import path from "path";

const WEBSITE_FOLDERS = [
  "../postgraphile/website",
  "../grafast/website",
  "../graphile-build/website",
  "../utils/website",
];
const regex = /\[(.*?)\]\((.*?)\)/g;

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

function wrongLinkCheck(link) {
  if (link.includes("#")) {
    link = link.substring(0, link.indexOf("#"));
  }
  if (link.startsWith("http")) {
    return false;
  } else if (link.endsWith("/")) {
    return true;
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

  let wrongLinks = {};
  for (const file of allFiles) {
    const data = await readFileAsync(file);
    const matches = [...data.matchAll(regex)];

    let links = [];

    matches.forEach((match) => {
      links.push(match[2]);
    });
    let localwrongLinks = [];
    for (const link of links) {
      if (wrongLinkCheck(link)) {
        localwrongLinks.push(link);
      }
    }
    if (localwrongLinks.length >= 1) {
      wrongLinks[file] = localwrongLinks;
    }
  }
  console.log(wrongLinks);
  if (wrongLinks.length !== 0) {
    process.exitCode = 1;
  }
})();
