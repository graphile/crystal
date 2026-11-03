---
"graphile-export": minor
---

Add `dangerouslyDisableConsistencyChecks` option to `exportSchema` (default
`false`). Set it to `true` to skip the sanity check that runs after the file is
written. This check can often take longer than the export itself; however
disabling it is dangerous, if you choose to do so please ensure suitable
alternative protections are in place.
