NEXT UP:

- [ ] Add tests for `__proto__`, `constructor`, etc aliases to ensure no issues
      (AND THAT ORDER IS MAINTAINED!)
- [ ] Must remember to add error and non-null tests at the root level in both
      @stream and @defer - should result in `data: null` or equivalent
- [ ] `packages/dataplan-pg/__tests__/mutations/basics/create-relational-post-no-query.mermaid`
      does a join against all tables even though it really only needs items and
      posts. There's an explanation in the description of commit
      `7dab34cc662aac8398157be16069f47ae5f35a0a` but though it's correct, a more
      pragmatic approach may be to assume that the two records exist and still
      optimize this away for the sake of efficiency
- [ ] Deferred relation isn't being deferred?
- [ ] Nested stream seems to trigger "value pushed into iterable after done;
      ignoring"
- [ ] Should stream be batched better? E.g. nested streams can be batched
      together despite being triggered separately?
- [ ] Defers should be batched, so sort out stream batching first and then
      perhaps use that for defer too?
- [ ] Why is `author_id` being unnecessarily selected for
      `queries/connections/pagination-after`?
- [ ] Should be possible to avoid re-planning fields that are both
      deferred/streamed and non-deferred/streamed - just reuse existing data.
- [x] Fix all instances of GraphQLError so the errors come out right
      (particularly connections-blankcursor.test.graphql)
- [ ] When using a constant for `node(id: "...")` we should be able to determine
      what the type is and _only_ plan that type, not all Node types.
- [ ] Support deoptimize / unprepared tests.
- Introspection:
  - Strip @defer/@stream from introspection before handing to GraphQL.js
  - Extract list of variables used, shallow-compare variables to use for cache
- Side effect plans

- polymorphicDeduplicateSteps: need to delete the LayerPlans that aren't needed
  any more (because their plans were shifted up a layer)

- IMPORTANT: when planning polymorphism we MUST call
  polymorphicDeduplicateSteps() correctly!

- Is it safe for layerplan to deduplicate? Do we need to enable de-duplication
  across layers? How do we merge layerPlans? (Is it if they have the same root
  item step id?)
- LayerPlan should take charge of stream options (`planOptionsByPlan`)
- LayerPlan should take charge of deduplication
- LayerPlan should take charge of tree shaking (via OutputPlan too)

- Consider splitting OperationPlan into GraphQLOperationPlan and GrafastCore
  (where core contains the steps/deduplication/etc and GraphQLOperationPlan
  deals with GraphQL selection sets/etc)
  - If we do this, consider renaming OutputPlan to GraphQLOutputPlan

New classes:

- Aether (operation plan)
  - Establish as it does currently
  - Variables/constraints/etc as it does currently
  - Plans query by creating a bucket for the root selection set (using
    `rootValue` as the root value)
  - Plans mutation by creating a _serial_ bucket for the root selection set
    (evaluate each field in its own bucket) (using `rootValue` as the root
    value)
  - Plans subscription by creating a stream from the root field (using
    `rootValue` as the root value), and then creating a bucket for the root
    selection set (using this `__Item` event as the root value)
    - Plan the root field, which results in a bucket that returns a stream (no
      data/errors)
    - Plan the root selection using this stream as the input
- Bucket (layer plan)
  - Has root plan.
  - May be ran parallel or serial.
  - Bucket doesn't necessarily have a selection set
  - If root plan for what would be new bucket is same, it can be merged into
    same bucket (even at different levels)
  - Can reference itself? E.g. `{ query { query { __typename } } }`
  - Stores the "paths" to this bucket, for use in error messages
  - Outputs:
    - data (via output plan)
    - errors (via output plan)
    - streams (via output plan?)
- Output plan
  - Applies to a single "path" in the bucket
  - Output plan for bucket can differ based on the typeName (polymorphic) even
    for the same "path".
  - Handles `__typename`
  - Output plan for bucket can differ based on the concrete selection set that
    made it.
  - Named fragments shouldn't cause issues therefore.
  - Output plan sets root of bucket (e.g. `null`, `object`, `list` or `leaf`)
  - Output plan for parent bucket references output value from inner bucket plan
    (rather than writing up the tree)
  - Output plan handles non-nullability, raises errors, must know path for
    errors.
  - Merges in errors from sub-output plans (from sub-buckets)
  - Aether handles the errors from the root bucket's output plan
  - Merges in streams from sub-output plans (from sub-buckets)
  - Aether handles the streams from the root bucket's output plan
  - Stream/defer may add more streams from within streams, so Aether's
    sub-stream handling must handle these

New Bucket is required for:

- mutation operation field (serial bucket)
- list items
- subscription operation root vs event selection set
- polymorphic type when root plan differs
- stream
- defer (duplicate fields can reference existing resolved plans, if there's no
  real difference then server can merge into payload and not bother to defer)
- "subroutine steps" - steps that have their own internal list of steps, e.g.
  transactions, list transforms, etc

Keep in mind:

- Plans with side effects
- Polymorphic plans resulting in `null`
- "Wrapper" plans, e.g. transactions (try/catch/finally), list transforms (each,
  sort, reduce, etc)
  - What is the output plan for these?
- Introspection fields
  - `__typename` handled internally
  - `__schema` and `__type` can forward to GraphQL.js
    - write a document from the selection, pipe it through GraphQL.js, store the
      result
    - track the variables used, use as part of the introspection LRU cache key
- SHOULD BE POSSIBLE TO INTERRUPT A PLAN!
  - If client terminates, we should stop computation ASAP.
  - Maybe pass a "signal" around
  - Can plans themselves access the signal? Would be good if so - then e.g.
    Postgres queries could be cancelled too.
- List of a list
- Field order matters - even when there's polymorphic fragments "in the middle"
  - EASY TO SOLVE - just create object with 'undefined' for all the fields up
    front

Other notes:

- `finalizeArguments` wasn't needed because `deduplicate` serves same purpose
- stream, list, etc: deduplicate the field plan, then look for or create a new
  layer plan for its result if appropriate (maybe add a new output plan to an
  existing layer plan)
- how are the output plans identified, and how do they maintain their
  associations from parent to child

Polymorphism

- When handling polymorphism (and maybe list/stream/etc items?)
  1. create a new LayerPlan for the thing
  2. create the plans necessary in that LayerPlan for its rootPlanId
  3. deduplicate _across sibling LayerPlans (of same reason.type)_
  4. if replacement plan is a different LayerPlan, discard our LayerPlan and use
     the previous one, pushing this in as an additional compatible typeName

- Could use a multi-layer strategy:
  1. first layer is the "root plan" and we deduplicate each and merge buckets
  2. then we create a sub-layer for each type and plan that type's fields into
     it
  3. when we deduplicate after each field, we allow deduplication with "sibling"
     layerplan's steps (sibling layerplans are layerplans that have the same
     parent layerplan and all relate to the same instance of polymorphism (i.e.
     the same rootPlanId?))
  4. if we successfully deduplicate against another layerplan's step then we
     create a new layerplan between both our and the other layerplan's parent
     (which is shared) and we now inherit from that layerplan
  5. allow deduplicate multiple times when dealing with polymorphism
  6. when a layerplan covers all the same typenames as the parent layerplan,
     merge it up.
