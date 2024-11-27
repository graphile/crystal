---
"graphile-build-pg": patch
"graphile-build": patch
"postgraphile": patch
---

🚨 **Inflection changes!** V4 preset should be (mostly) unaffected, but Amber
preset will likely have changes between `ID` and `ROW_ID` in various places,
plus missing underscores may reappear/etc. Be sure to diff your schema
before/after this update (as you should with every update... and to be honest,
with everything else that changes your schema).

Normally `camelCase`/`upperCamelCase`/`constantCase`/etc are the final step
before we name a field/type/enumValue/etc; however it turns out that some
inflectors were using the camel-cased output as input to their own inflection -
for example, when calculating the name of a relation it would take the column
names _camel-cased_ and then combine them into a string which was then
camel-cased again. Even worse, when these values are then used in an enum, it
would then be _constant-cased_, so you end up with string 👉 camel-case 👉
concatenate 👉 camel-case 👉 concatenate 👉 constant-case. This lead to certain
edge cases where fields with numbers or underscores may come out in unexpected
ways.

This release creates "raw" backing inflectors for a few things that remove the
final step (camel-casing) so that later usage may choose to use the raw value
rather than the camel-cased value. And due to this, we've also moved the `id` 👉
`rowId` tweaks from the `attribute()` inflector into the `_attributeName()`
inflector - which is where most of the changes have come from. We've undone this
change in the V4 preset, so if you don't use the V5 preset but need to undo this
change, please check out the V4 overrides of:

- [`_attributeName`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/presets/v4.ts#L135-L145)
- [`_joinAttributeNames`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/plugins/PgV4InflectionPlugin.ts#L131-L138)
- [`attribute`](https://github.com/graphile/crystal/blob/ca9c872ff6c95915bd9e2f33c1370d86742ce815/postgraphile/postgraphile/src/presets/v4.ts#L158-L169)

Note: the V4 preset is fairly stable, but the Amber preset is being constantly
iterated to improve the OOTB V5 experience - it will only be stable once V5.0.0
is released.
