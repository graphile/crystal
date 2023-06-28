---
"graphile-build-pg": patch
"@dataplan/pg": patch
---

Codecs can now (optionally) have executors associated (typically useful for
record codecs); so we've eradicated runtime resource definition for columns that
use composite types (or lists thereof) - all composite types accessible from
attributes are now guaranteed to have a table-like resource generated in the
registry.
