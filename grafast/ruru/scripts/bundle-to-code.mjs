import { readFileSync, writeFileSync } from "fs";

const __dirname = import.meta.dirname

const code = readFileSync(`${__dirname}/../bundle/ruru.min.js`, null)
writeFileSync(`${__dirname}/../src/bundleData.ts`, `\
export const graphiQLContent =
  Buffer.from(
    "${code.toString('base64')}",
    "base64"
  ).toString("utf8");
`);
