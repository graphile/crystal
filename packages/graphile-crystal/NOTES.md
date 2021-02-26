# What to do?

`yarn ts-node examples/example2.ts`

# Current status

Currently trying to make sense of connections and cursors. Current thinking is
that the connection gets a "template" plan, then the
edges/nodes/aggregates/pageInfo/etc can clone this plan and augment it as
necessary. How to construct the cursor though? I'm making this a
PgClassSelectPlan concern via `cursor()` method but this isn't really right
because scalar connections can also have cursors. Cursors have to factor in the
orderBy which could be arbitrary data, even from joins, so has to be complex SQL
probably.

Also plans will probably need to never override the constructor.
