---
"graphile-export": patch
---

Fix omission in Graphile Export where exporting a frozen/sealed object or array
would not result in a frozen/sealed object being restored.
