---
"@graphile/simplify-inflection": major
---

Fix a bug in singular relation inflection (in both directions) that would lead
to frequent naming conflicts - the new behavior better reflects that of the
PostGraphile V4 simplify plugin.

**REMEMBER**: once you've chosen an inflection plugin, you should not do any
semver major updates, since those (like this one) may change naming conventions.
Make sure that you export your schema as SDL both before and after the update,
compare, and if they don't match then consider reverting to the older version of
the plugin.
