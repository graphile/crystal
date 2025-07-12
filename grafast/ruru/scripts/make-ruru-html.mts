import { writeFile } from "node:fs/promises";

import { ruruHTML } from "../dist/server.js";

const __dirname = import.meta.dirname;

const html =
  ruruHTML({
    htmlParts: {
      configScript(s) {
        return `${s.replace(/\n}/, ',\n// Replace this with your own endpoint:\n"endpoint": "/graphql",\n}')}

<!-- DELETE THIS once you have the correct 'endpoint' in RURU_CONFIG above -->
<script type="module">
// Extract 'endpoint=...' from the hash params
const { hash } = window.location;
if (hash.startsWith('#')) {
const params = new URLSearchParams(window.location.hash.slice(1));
const endpoint = params.get('endpoint');
if (endpoint) RURU_CONFIG.endpoint = endpoint;
}
</script>
<!-- /DELETE THIS -->
`;
      },
    },
  }).trim() + "\n";
await writeFile(`${__dirname}/../ruru.html`, html);
await writeFile(`${__dirname}/../../website/static/myruru/index.html`, html);
