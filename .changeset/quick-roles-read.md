---
"graphile-build-pg": patch
---

Don't copy a relation of the root of a relational polymorphic table onto its
implementations when the role cannot read the related table. The relation is
already left off the root in that case, and the copied field could never be
queried.
