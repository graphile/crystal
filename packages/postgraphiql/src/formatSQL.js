export default function formatSQL(sql) {
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
      handleIndent,
    )
    .replace(/\(\s*([A-Za-z0-9_."' =]{1,50})\s*\)/g, "($1)")
    .replace(/\(\s*(\([A-Za-z0-9_."' =]{1,50}\))\s*\)/g, "($1)")
    .replace(/\n\s*and \(TRUE\)/g, " and (TRUE)");
  return tidySql;
}
