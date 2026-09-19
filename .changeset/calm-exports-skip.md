---
"graphile-export": patch
---

Add `lint` option to `exportSchema` (default `true`). Set it to `false` to skip
the ESLint sanity check that runs after the file is written; on very large
exports this check can take longer than the export itself.
