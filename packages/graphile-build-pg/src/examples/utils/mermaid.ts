/*
 * Utilities for working with mermaid-js
 */

/** Escaping of HTML entities for mermaid */
function escapeHTMLEntities(str: string): string {
  return str.replace(
    /[&"<>]/g,
    (l) =>
      ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" }[l as any]),
  );
}

/** Renders a web page containing the given mermaid plan graph */
export function mermaidTemplate(graph: string | null) {
  return `\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Crystal Example</title>
</head>
<body>
<div class="mermaid">
${escapeHTMLEntities(graph ?? 'graph LR\nA["No query exists yet"]')}
</div>
<script src="/mermaid.js"></script>
<script>
  mermaid.initialize({ startOnLoad: true });
</script>
</body>
</html>
`;
}
