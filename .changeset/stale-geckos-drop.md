---
"graphile-build": patch
"graphile-utils": patch
"@dataplan/json": patch
"@dataplan/pg": patch
"grafast": patch
"tamedevil": patch
"pg-sql2": patch
---

🚨 TypeScript is now configured to hide interfaces marked as `@internal`. This
may result in a few errors where you're accessing things you oughtn't be, but
also may hide some interfaces that should be exposed - please file an issue if
an API you were dependent on has been removed from the TypeScript typings. If
that API happens to be `step.dependencies`; you should first read this:
https://benjie.dev/graphql/ancestors
