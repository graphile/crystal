---
sidebar_position: 1
---

# Graphile Export

Graphile Export enables you to export a GraphQL Schema (or other code) as
executable JavaScript code. 

The key reason to export your schema is to move schema introspection of postgres
from runtime to build time. This results in:

- Faster startup time
- Reduced thundering herd on the database in the event of an outage
- Much faster cold starts for Lambda
- And probably more

Previously, in Postgraphile 4, export took the form of encoding the Postgres
schema to JSON. Postgraphile 5 takes this further and generates runtime code,
further cutting startup times.

This feature, however, is in early stages and is to be adopted with care and
caution. For example, not all Postgraphile plugins are compatible with
graphile-export. Most notably, this includes your own plugins.

Please read this documentation and consult the Discord for questions, help and
suggestions.