---
sidebar_position: 3
---

# Relations

A relation is a link from a codec to a resource, detailing how to get records
from the related resource given that you already have data for the given codec.

## From codec to resource

The relation starts at a _codec_ rather than a _resource_ because you should be
able to traverse it no matter where the data came from - even if you got the
current user by calling the `current_user()` function you've defined in your
database (rather than selecting from the `users` table), you should still be
able to navigate from the resulting user data to the resources related to
users.

## Uni-directional

Relations are uni-directional; if you want the relationship to go
both ways you must add both forward and backward relations. In a database, a
relationship is normally represented by a "foreign key" constraint which only
exists on one side of the relationship (the "referencing" table), and it
references a remote table (the "referencee" table). In `@dataplan/pg` the
"forward" relation goes from the referencing codec to the referencee table and
is unique; the backward relation goes from the referencee codec to the
referencing table and should be flagged `isReferencee: true`. The forward
relation is always unique, the backward relation may or may not be unique
depending on if the remote attributes have a unique constraint on them or not.

TODO: more documentation on how to use relations
