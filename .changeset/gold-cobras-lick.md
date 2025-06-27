---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

🚨 Give built-in codecs a concept of "natural sorting" and "natural equality";
disable ordering by default for those without natural sorting, disable filtering
by default for those without natural equality. Those using AmberPreset will have
some order enum options and filter options removed from their schema; V4 preset
users should be unaffected. To restore the previous items, a small plugin can be
introduced, see:
https://github.com/slaskis/crystal/blob/bb940399a3a741c0982b53fffbe4604eebe6ffb0/postgraphile/postgraphile/src/plugins/PgV4BehaviorPlugin.ts#L81-L98
