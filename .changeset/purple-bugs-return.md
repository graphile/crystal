---
"@dataplan/pg": patch
---

listOfCodec type signature changed: all parameters after the first are now a
single config object:
`listOfCodec(listedCodec, extensions, typeDelim, identifier)` ->
`listOfCodec(listedCodec, { extensions, typeDelim, identifier })`.
