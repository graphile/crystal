---
"graphile-build-pg": patch
---

Stop registering an (unused) enum of the types of a relational polymorphic
table. Its name, `<Root>Type`, collided with the GraphQL type of a `<root>_type`
table (for example `item` and `item_type`), and the table's type was silently
left out of the schema.
