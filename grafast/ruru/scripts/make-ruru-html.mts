import { writeFile } from 'node:fs/promises'

import {ruruHTML} from '../dist/server.js'

const __dirname = import.meta.dirname;

const html = ruruHTML({
  htmlParts: {
    configScript(s) {
      return `${s}
<script type="module">
const { hash } = window.location;
if (hash.startsWith('#')) {
const params = new URLSearchParams(window.location.hash.slice(1));
const endpoint = params.get('endpoint');
if (endpoint) RURU_CONFIG.endpoint = endpoint;
}
</script>
`;
    }
  }
})
await writeFile(`${__dirname}/../ruru.html`, html.trim() + "\n");
