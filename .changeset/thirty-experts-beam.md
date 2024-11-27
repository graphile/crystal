---
"graphile-build-pg": patch
---

🚨 `orderByAttributeEnum` inflector no longer requires/provides attribute - it
can be trivially fetched from `codec` and `attributeName` via
`const attribute = codec.attributes[attributeName]`
