---
"graphile-build-pg": patch
"postgraphile": patch
"@dataplan/pg": patch
---

🚨 PostgreSQL adaptor is no longer loaded via string value; instead you must
pass the adaptor instance directly. If you have
`adaptor: "@dataplan/pg/adaptors/pg"` then replace it with
`adaptor: await import("@dataplan/pg/adaptors/pg")`. (This shouldn't cause you
issues because you _should_ be using `makePgService` to construct your
`pgServices` rather than building raw objects.)

🚨 If you've implemented a custom PgAdaptor, talk to Benjie about how to port
it. (Should be straightforward, but no point me figuring it out if no-one has
done it yet 🤷)

This change improves bundle-ability by reducing the number of dynamic imports.

Also: `PgAdaptorOptions` has been renamed to `PgAdaptorSettings`, so please do a
global find and replace for that.
