# Warning: complex internals!

The step classes in this module are extremely complex to enable us to utilise
the very best possible optimizations that we can possibly get in our
interactions with PostgreSQL. This is **NOT** a good module to use to assess
writing Gra*fast* step classes - we could have achieved 75% of this
functionality and maybe 50% of the performance in a tiny fraction of this many
lines of code. Further this is not a good demonstration of how to connect
Gra*fast* to other databases (SQL or otherwise) - though the APIs themselves may
be good to mirror, the implementation is highly Postgres specific and incredibly
optimized.
