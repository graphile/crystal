import type { SchemaResult } from "../interfaces.js";
import type { HandlerResult } from "./interfaces.js";

function escapeHTMLEntities(str: string): string {
  return str.replace(
    /[&"<>]/g,
    (l) =>
      ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" }[l as any]),
  );
}

// TODO: use a specific version of mermaid
export function makePlanHandler(schemaResult: SchemaResult) {
  return async (graph: string | null): Promise<HandlerResult> => {
    return {
      statusCode: 200,
      type: "html",
      payload: `\
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
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    maxTextSize: 1000000,
  });
  let ticks = 0;
  let found = false;
  const interval = setInterval(() => {
    ticks++;
    const svg = document.getElementsByTagName('svg')[0]
    if (svg) {
      if (!found) {
        found = true;
        svg.removeAttribute('width');
        svg.style.transform = 'scale(0.75)';
      }
      const scrollTarget = document.querySelectorAll('.clusters .cluster')[0];
      if (scrollTarget) {
        const rect = scrollTarget.getBoundingClientRect();
        window.scrollTo(window.scrollX + rect.left, window.scrollY + rect.top)
        clearInterval(interval);
      }
      // const rect = svg.getBoundingClientRect();
      // if (rect.top > 100) {
        // svg.style.marginTop = \`-\${rect.top}px\`;
      // }
    }
    if (ticks > 100) {
      clearInterval(interval);
    }
  }, 50);
</script>
</body>
</html>
`,
    };
  };
}
