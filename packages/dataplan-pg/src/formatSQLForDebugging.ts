import chalk from "chalk";

// A simplified version of formatSQLForDebugging from graphile-build-pg
export function formatSQLForDebugging(
  sql: string,
  error?: { position?: string | number; message?: string } | null,
): string {
  const pos =
    error?.position != null ? parseInt(String(error.position), 10) : null;

  let colourIndex = 0;
  const allowedColours = [
    chalk.red,
    chalk.green,
    chalk.yellow,
    chalk.blue,
    chalk.magenta,
    chalk.cyan,
    chalk.white,
    chalk.black,
  ];

  function nextColor() {
    colourIndex = (colourIndex + 1) % allowedColours.length;
    return allowedColours[colourIndex];
  }
  const colours = {};

  /* Yep - that's `colour` from English and `ize` from American */
  function colourize(str: string) {
    if (!colours[str]) {
      colours[str] = nextColor();
    }
    return colours[str].bold.call(null, str);
  }
  function comment(str: string) {
    return chalk.inverse(str);
  }

  const lines = sql.split("\n");
  let start = 0;
  const output = [];
  for (const line of lines) {
    const end = start + line.length + 1;
    const colouredSql = line
      .replace(/__[a-z0-9_]+(?:_[0-9]+|__)/g, colourize)
      .replace(/(\/\*.*\*\/|--.*$)/g, comment);
    output.push(colouredSql);
    if (pos != null && pos >= start && pos < end) {
      output.push(
        chalk.red("-".repeat(pos - start - 1) + "^ " + error?.message),
      );
    }
    start = end;
  }

  return output.join("\n");
}
