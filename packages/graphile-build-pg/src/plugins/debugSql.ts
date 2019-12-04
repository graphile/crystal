import debugFactory from "debug";
import chalk from "chalk";

export function formatSQLForDebugging(sql) {
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
  function colourize(str) {
    if (!colours[str]) {
      colours[str] = nextColor();
    }
    return colours[str].bold.call(null, str);
  }

  let indentLevel = 0;
  function handleIndent(all, rawMatch) {
    const match = rawMatch.replace(/ $/, "");
    if (match === "(") {
      indentLevel++;
      return match + "\n" + "  ".repeat(indentLevel);
    } else if (match === ")") {
      indentLevel--;
      return "\n" + "  ".repeat(indentLevel) + match;
    } else if (match === "),") {
      indentLevel--;
      return (
        "\n" +
        "  ".repeat(indentLevel) +
        match +
        "\n" +
        "  ".repeat(indentLevel)
      );
    } else if (match === ",") {
      return match + "\n" + "  ".repeat(indentLevel);
    } else {
      return "\n" + "  ".repeat(indentLevel) + match.replace(/^\s+/, "");
    }
  }
  const tidySql = sql
    .replace(/\s+/g, " ")
    .replace(/\s+(?=$|\n|\))/g, "")
    .replace(/(\n|^|\()\s+/g, "$1")
    .replace(
      /(\(|\)|\), ?|, ?| (select|insert|update|delete|from|where|and|or|order|limit)(?= ))/g,
      handleIndent
    )
    .replace(/\(\s*([A-Za-z0-9_."' =]{1,50})\s*\)/g, "($1)")
    .replace(/\(\s*(\([A-Za-z0-9_."' =]{1,50}\))\s*\)/g, "($1)")
    .replace(/\n\s*and \(TRUE\)/g, chalk.gray(" and (TRUE)"));
  const colouredSql = tidySql.replace(/__local_[0-9]+__/g, colourize);
  return colouredSql;
}

const rawDebugSql = debugFactory("graphile-build-pg:sql");

function debugSql(sql) {
  if (!rawDebugSql.enabled) {
    return;
  }
  rawDebugSql("%s", "\n" + formatSQLForDebugging(sql));
}
Object.assign(debugSql, rawDebugSql);

export default debugSql as typeof rawDebugSql;
