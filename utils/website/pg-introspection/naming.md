---
sidebar_position: 3
---

# Naming

Using the PostgreSQL column names is _by design_, even though some are hard to
read if you're not familiar with the system catalog.

Most collections expose a catalogue object's OID as `_id`. This alias dates back
to PostgreSQL versions where `select *` did not include the `oid` column, so the
library selected it explicitly. Some collections, such as `event_triggers`,
expose `oid` directly.

Not every catalogue row has its own OID. For example, an attribute is identified
by its table's `attrelid` and its `attnum`. Use the fields exposed by that
collection when writing dependency selectors. SQL filters use the underlying
catalogue column names: write `oid`, not `_id`, in a filter expression.
