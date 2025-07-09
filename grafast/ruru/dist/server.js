"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHTMLParts = void 0;
exports.makeHTMLParts = makeHTMLParts;
exports.ruruHTML = ruruHTML;
const bundleData_js_1 = require("./bundleData.js");
const version_js_1 = require("./version.js");
// Ref: https://v8.dev/features/subsume-json
const escapeJS = (str) => {
    return str
        .replaceAll("<!--", "<\\!--")
        .replaceAll("</script", "<\\/script")
        .replaceAll("<script", "<\\script");
};
const baseMetaTags = `\
<meta charset="utf-8" />`;
const baseTitleTag = `\
<title>Ruru - GraphQL/Grafast IDE</title>
`;
const baseStyleTags = `\
<style>
body {
  margin: 0;
}
#ruru-root {
 height: 100vh;
}
</style>`;
const baseHeaderScripts = `\
<script src="https://unpkg.com/prettier@1.13.0/standalone.js"></script>
<script src="https://unpkg.com/prettier@1.13.0/parser-graphql.js"></script>`;
const baseElements = `\
<div id="ruru-root"></div>`;
const baseBodyScripts = `\
<script type="module"> import merm from 'https://cdn.jsdelivr.net/npm/mermaid@11.6.0/+esm'; window.mermaid = merm </script>
<script>/*! For license information, see https://unpkg.com/ruru@${version_js_1.version}/bundle/ruru.min.js.LICENSE.txt */
${escapeJS(bundleData_js_1.graphiQLContent)}</script>`;
const baseBodyInitScript = `\
<script>
  const { React, createRoot, Ruru } = RuruBundle;
  const tree = React.createElement(Ruru, RURU_CONFIG);
  const container = document.getElementById("ruru-root");
  const root = createRoot(container);
  root.render(tree);
</script>`;
function makeHTMLParts() {
    return {
        metaTags: baseMetaTags,
        titleTag: baseTitleTag,
        styleTags: baseStyleTags,
        headerScripts: baseHeaderScripts,
        bodyContent: baseElements,
        bodyScripts: baseBodyScripts,
        bodyInitScript: baseBodyInitScript,
    };
}
exports.defaultHTMLParts = Object.freeze(makeHTMLParts());
function ruruHTML(config, htmlParts = exports.defaultHTMLParts) {
    const { metaTags, titleTag, styleTags, headerScripts, bodyContent, bodyScripts, bodyInitScript, } = htmlParts;
    return `\
<!DOCTYPE html>
<html lang="en">
<head>
${metaTags}
${titleTag}
${styleTags}
<script>const RURU_CONFIG = ${escapeJS(JSON.stringify(config))};</script>
${headerScripts}
</head>
<body>
${bodyContent}
${bodyScripts}
${bodyInitScript}
</body>
</html>`;
}
//# sourceMappingURL=server.js.map