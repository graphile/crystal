---
"graphile-build-pg": patch
"postgraphile": patch
---

PostGraphile will only throw an error when it fails to read enum table values
from a table in a published schema (one in the `schemas` list in your
pgServices); enum tables in other schemas will result in a warning instead
(since during the gather phase we don't know whether or not they will be needed
come schema build time).
