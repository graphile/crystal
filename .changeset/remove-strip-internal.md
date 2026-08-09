---
"@dataplan/json": patch
"@dataplan/pg": patch
"@grafserv/persisted": patch
"@graphile/lru": patch
"@graphile/simplify-inflection": patch
"eslint-plugin-graphile-export": patch
"grafast": patch
"grafserv": patch
"graphile": patch
"graphile-build": patch
"graphile-build-pg": patch
"graphile-config": patch
"graphile-export": patch
"graphile-utils": patch
"graphql-codegen-grafast": patch
"jest-serializer-graphql-schema": patch
"jest-serializer-simple": patch
"pg-introspection": patch
"pg-sql2": patch
"pgl": patch
"postgraphile": patch
"ruru": patch
"ruru-components": patch
"ruru-types": patch
"tamedevil": patch
---

Remove `stripInternal` from the shared TypeScript compiler options. Previously,
symbols tagged with `/** @internal */` were stripped from the generated `.d.ts`
declaration files; they will now be included. This makes internal APIs visible
in TypeScript but does not change any runtime behaviour.
