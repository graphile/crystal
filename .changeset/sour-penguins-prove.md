---
"grafast": patch
---

`mermaid-js` explain type no longer supported, instead use `plan` which produces
a JSON object. You can use the new
`import { planToMermaid } from 'grafast/mermaid'` to convert this object back
into a mermaid definition.
