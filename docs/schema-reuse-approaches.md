# Alternative Approaches: Reusing Graphile Schemas Across Structurally Identical Tenants

## Context

This document evaluates approaches for reducing memory and initialization cost when multiple tenants produce structurally identical Graphile schemas that differ only in naming (physical schema prefixes, generated table/type/field names).

It builds on two prior findings:

1. **Memory layer profiling** (`docs/postgraphile-memory-layer-profiling-results.md`) showed that `makeSchema` (specifically `gather` + `buildSchema`) accounts for ~291 ms init time and ~3 MB retained heap per instance. Everything else is shell.

2. **The POC report** (provided by the Constructive team) showed that after stripping tenant-specific generated prefixes, 10 distinct private tenants collapsed to 1 unique structural fingerprint across schemas, tables, types, and query fields.

The question is: **given that the expensive core (`SchemaResult`) is structurally identical across tenants, what is the best way to avoid paying the full build cost and memory per tenant?**

This document presents and evaluates several candidate approaches, from lightweight to invasive, so that the team can make an informed design decision.

---

## How Names Flow Through Crystal Today

Before evaluating approaches, it helps to understand how tenant-specific names propagate through the build pipeline.

### Build Pipeline Overview

```
resolvePreset(preset)
    |
    v
buildInflection(resolvedPreset)       -- produces Inflection object
    |
    v
gather(resolvedPreset, { inflection })
    |-- PgIntrospectionPlugin          -- runs SQL introspection, emits PgNamespace/PgClass/PgType/etc
    |-- PgCodecsPlugin                 -- converts PgType/PgClass -> PgCodec (calls inflection.classCodecName)
    |-- PgTablesPlugin                 -- converts PgClass -> PgResourceOptions (calls inflection.tableResourceName)
    |-- PgProceduresPlugin             -- converts PgProc -> PgResourceOptions
    |-- PgRelationsPlugin              -- wires up foreign key relations
    |-- PgRegistryPlugin               -- builds final PgRegistry from all resources/codecs/relations
    |
    v
output: BuildInput = { pgRegistry }
    |
    v
buildSchema(resolvedPreset, input, { inflection })
    |-- SchemaBuilder hooks: build -> init -> type construction -> finalize
    |-- inflection.tableType(codec)    -- names GraphQL types
    |-- inflection._schemaPrefix(...)  -- adds schema prefix to names
    |
    v
output: GraphQLSchema (frozen, immutable)
```

### Where Tenant Names Get Baked In

| Layer | What gets named | How |
| --- | --- | --- |
| **Introspection** | `PgNamespace.nspname`, `PgClass.relname`, `PgType.typname` | Raw from PostgreSQL catalog |
| **PgCodecsPlugin** | `PgCodec.name`, `PgCodec.identifier` (SQL literal) | `inflection.classCodecName({ pgClass, serviceName })` which calls `_schemaPrefix` |
| **PgTablesPlugin** | `PgResource.name`, `PgResourceOptions.from` (SQL identifier) | `inflection.tableResourceName({ pgClass, serviceName })` |
| **PgProceduresPlugin** | `PgResource.name` for functions | `inflection.functionResourceName(...)` with `_schemaPrefix` |
| **buildSchema / hooks** | `GraphQLObjectType.name`, `GraphQLField.name`, etc. | `inflection.tableType(codec)`, `inflection.attribute(...)`, etc. |
| **OperationPlan** | Plan steps reference types/fields by identity | Cached per `GraphQLSchema` instance + operation + constraints |
| **SQL generation** | `PgCodec.identifier`, `PgResource.from` | SQL identifiers like `"tenant_abc_users"."id"` |

The key observation: **names enter at introspection, propagate through inflection into codecs/resources, and become frozen into the GraphQLSchema and SQL generation layers.** There is no late-binding or indirection today.

---

## Approach 1: Structural Fingerprint + Full SchemaResult Cache

### Idea

Before building a schema, compute a **structural fingerprint** of the tenant's database shape (after normalizing away tenant-specific name prefixes). Use this fingerprint as a cache key. If a matching SchemaResult already exists, reuse it directly.

### How It Would Work

1. During the `gather` phase (or just before), introspect the database and compute a normalized fingerprint:
   - Strip known tenant prefixes from schema names
   - Hash the sorted list of: table shapes (column names, types, constraints), function signatures, relation graph
2. Check a global `Map<fingerprint, SchemaResult>` cache
3. On cache hit: skip `gather` + `buildSchema` entirely, return the cached `SchemaResult`
4. On cache miss: build normally, store in cache

### Implications for SQL

This is the critical problem. If two tenants share a `SchemaResult`, the SQL identifiers baked into `PgCodec.identifier` and `PgResource.from` will reference **Tenant A's physical schema names**, not Tenant B's.

This means queries executed against Tenant B's database would reference wrong schema names.

### Resolution Options for SQL

- **Option A**: Require all structurally identical tenants to use the same physical schema names. This defeats the purpose if the naming is generated.
- **Option B**: Use PostgreSQL `search_path` at connection time so that unqualified table names resolve correctly. This only works if schemas are on the `search_path` and table names (without schema prefix) are unique.
- **Option C**: Intercept SQL generation to rewrite schema-qualified identifiers at execution time. This requires a new abstraction in `@dataplan/pg`.

### Pros

- Maximum reuse: one `SchemaResult` (~3 MB) serves all structurally identical tenants
- No changes to `graphile-build` core needed for the fingerprinting itself
- `OperationPlan` cache is also shared (since same `GraphQLSchema` instance)

### Cons

- SQL identifier mismatch is a hard blocker without one of the resolution options above
- Option B (search_path) is fragile and may not work for multi-schema tenants
- Option C (SQL rewriting) is a significant new feature in `@dataplan/pg`
- Smart tags, grants, or per-tenant plugin behavior differences break fingerprint equality

### Verdict

**High reward, high difficulty.** This is the ideal end state but requires solving the SQL identifier problem. Best suited as a long-term target.

---

## Approach 2: Template + Name Map (The POC Proposal)

### Idea

Build and cache a **normalized template** from the gather output. For each new tenant, apply a small **naming map** to produce a tenant-specific `SchemaResult` without re-running the expensive introspection and type construction.

### How It Would Work

1. Build the first tenant's schema normally
2. Extract a **structural template** from the `BuildInput` (PgRegistry):
   - Normalize codec names, resource names, SQL identifiers
   - Store the structural graph (tables, columns, types, relations, constraints, behaviors)
3. Store a **naming map** per tenant:
   - `{ normalizedName -> tenantSpecificName }` for codecs, resources, SQL identifiers
4. For subsequent tenants with the same structural fingerprint:
   - Clone the template `BuildInput`
   - Apply the naming map to produce tenant-specific codecs/resources
   - Run `buildSchema` with the remapped input (still ~84 ms but avoids the ~62 ms gather)
   - Or, if the GraphQL schema naming also follows a predictable pattern, cache the `GraphQLSchema` too

### Where the Seam Would Be

The most natural seam is **between gather and buildSchema**:

```
gather (expensive, ~62 ms)  -->  BuildInput (PgRegistry)  -->  buildSchema (~84 ms)
                                       ^
                                       |
                              template + name map applied here
```

### Pros

- Avoids the most expensive phase (introspection/gather) for cache-hit tenants
- Each tenant still gets its own valid `GraphQLSchema` with correct SQL identifiers
- No changes needed to `@dataplan/pg` SQL generation
- Name map is small (likely < 10 KB per tenant)

### Cons

- Still pays ~84 ms for `buildSchema` per tenant (though this could be parallelized or warmed)
- Cloning and remapping `PgRegistry` is non-trivial: codecs, resources, and relations form a deeply cross-referenced graph
- `PgCodec.identifier` and `PgResource.from` are SQL AST fragments (`sql.identifier(...)`), not plain strings. Remapping requires understanding `pg-sql2` internals.
- If any plugin stores tenant-specific state in the registry (smart tags, custom behaviors), the template may not generalize

### Key Implementation Challenge

`PgRegistry` is built by `PgRegistryPlugin` via `makeRegistryBuilder()` which calls `.build()` to freeze the registry. The resulting object has interlinked references:

```
registry.pgCodecs     -- Map of codec name -> PgCodec
registry.pgResources  -- Map of resource name -> PgResource (references codecs)
registry.pgRelations  -- Nested map of relations (references resources and codecs)
```

Deep-cloning and remapping this graph while preserving reference integrity is the main engineering challenge.

### Verdict

**Medium reward, medium difficulty.** This is a practical intermediate step. It solves the gather cost and can be extended later.

---

## Approach 3: Parameterized Inflection with Late-Bound Names

### Idea

Instead of baking physical names into the schema at build time, make inflection produce **parameterized names** that resolve to tenant-specific values at execution time.

### How It Would Work

1. Modify key inflectors (`_schemaPrefix`, `classCodecName`, `tableResourceName`) to return a **name token** instead of a literal string
2. The token encodes the structural identity plus a resolution rule (e.g., "this is schema prefix for the 'users-public' module")
3. At schema build time, tokens are stored in codecs/resources/types
4. At execution time, a tenant-specific **name resolver** converts tokens to physical names
5. SQL generation resolves tokens to SQL identifiers using the resolver

### Pros

- One `SchemaResult` serves all tenants (like Approach 1)
- No SQL identifier mismatch because resolution happens at execution time
- `OperationPlan` can potentially be shared if tokens resolve consistently

### Cons

- **Deeply invasive change to Crystal.** Every layer that uses names would need to handle tokens:
  - `pg-sql2` SQL fragments
  - `PgCodec.name`, `PgResource.name`
  - `GraphQLObjectType.name`, field names, etc.
  - Plan steps that reference types
- GraphQL spec requires concrete type names at schema construction time (not execution time). A `GraphQLSchema` with token names is not a valid GraphQL schema.
- Breaks all existing plugins that compare names as strings
- Performance overhead of token resolution on every request

### Verdict

**High reward, very high difficulty and risk.** This is architecturally elegant but requires fundamental changes to Crystal, graphql-js interop, and the plugin ecosystem. Not recommended as a near-term approach.

---

## Approach 4: Schema Pool with Warm Cache

### Idea

Pre-build a **pool of `SchemaResult` objects** for known structural fingerprints. When a tenant request arrives, look up its fingerprint and assign a pre-built schema from the pool.

### How It Would Work

1. On application startup (or lazily on first access), build one `SchemaResult` per unique structural fingerprint
2. Maintain a `Map<structuralFingerprint, SchemaResult>` as a warm cache
3. For each incoming request, compute the tenant's fingerprint and look up the pool
4. If the tenant's physical names match the cached schema's names: use directly
5. If not: this approach alone doesn't solve the naming problem

### The SQL Problem Again

This approach has the same SQL identifier mismatch as Approach 1 unless all tenants sharing a fingerprint also share physical names. In the Constructive case, they don't (each tenant has unique generated prefixes).

### Enhancement: Pool + search_path

If tenants are designed such that their schemas can be accessed via PostgreSQL `search_path` manipulation:

1. Build the schema using **canonical/placeholder schema names**
2. At connection time, set `search_path` to the tenant's actual schemas
3. SQL uses unqualified identifiers that resolve via `search_path`

This requires:
- `PgCodec.identifier` and `PgResource.from` to use unqualified names
- No cross-schema name collisions within a tenant
- A way to set `search_path` per-request in the executor

### Pros

- Extremely efficient for cache hits: zero build cost, zero memory overhead per tenant
- Natural fit for PostgreSQL multi-tenancy patterns
- `search_path` is a standard PostgreSQL feature

### Cons

- Requires the application to control `search_path` per connection (Constructive may already do this)
- Doesn't work if tenants have cross-schema name collisions (e.g., two schemas both have a `users` table exposed)
- Requires `PgCodec.identifier` to be built without schema qualification, which is a change to `PgCodecsPlugin` and `PgTablesPlugin`
- Multi-schema tenants (e.g., `app-public` + `auth-public` + ...) need careful `search_path` ordering

### Verdict

**High reward if `search_path` is viable for the Constructive architecture.** This is the most operationally simple approach and should be evaluated first. If it works, it avoids almost all complexity.

---

## Approach 5: Gather Cache with Registry Normalization

### Idea

Cache the `gather` output (`BuildInput` / `PgRegistry`) at a normalized level. When a structurally identical tenant is encountered, reuse the cached gather output and only re-run `buildSchema`.

### How It Would Work

1. After `gather` completes, compute a structural fingerprint of the `PgRegistry`
2. Normalize the registry:
   - Strip tenant-specific prefixes from all names
   - Normalize SQL identifiers
   - Hash the result
3. Cache: `Map<gatherFingerprint, { normalizedBuildInput, exampleResolvedPreset }>`
4. For a new tenant with matching fingerprint:
   - Clone `normalizedBuildInput`
   - Re-apply tenant-specific names via the naming map
   - Run `buildSchema` with the remapped input

### Difference from Approach 2

Approach 2 proposes the template + name map conceptually. This approach specifies the exact seam: **between PgRegistryPlugin.build() and buildSchema()**.

The key insight is that `PgRegistry` has a well-defined structure:

```typescript
interface PgRegistry {
  pgCodecs: Record<string, PgCodec>;
  pgResources: Record<string, PgResource>;
  pgRelations: Record<string, Record<string, PgCodecRelation>>;
}
```

Each `PgCodec` carries:
- `name` (string)
- `identifier` (SQL fragment from `pg-sql2`)
- `attributes` (map of attribute name -> codec + metadata)
- `extensions` (includes `pg.schemaName`, `pg.name`)

Each `PgResource` carries:
- `name` (string)
- `from` (SQL fragment or function)
- `codec` (reference to a PgCodec)
- `uniques`, `parameters`, `extensions`

### Implementation Path

1. After `registryBuilder.build()` in `PgRegistryPlugin`:
   - Walk all codecs and resources
   - For each, extract the "structural signature" (column types, constraints, relation graph) and the "naming payload" (codec.name, codec.identifier, resource.name, resource.from, extensions.pg.*)
   - Hash the structural signature -> fingerprint
2. Store template + naming map
3. For subsequent tenants:
   - Check fingerprint match
   - Deep-clone the template registry
   - Apply new naming map
   - Skip introspection and registry building entirely

### Pros

- Saves the full gather cost (~62 ms) and database round-trip for cache-hit tenants
- Each tenant still gets a fresh `buildSchema` pass with correct names
- Registry structure is well-defined and documented

### Cons

- Deep-cloning `PgRegistry` with correct cross-references is the main challenge
- `sql.identifier()` fragments are opaque AST nodes; remapping requires `pg-sql2` support or wrapper
- Still pays ~84 ms for `buildSchema` per tenant

### Verdict

**Practical and well-scoped.** This is the recommended POC target if `search_path` (Approach 4) is not viable.

---

## Approach 6: GraphQL Schema Cloning via graphile-export

### Idea

Use `graphile-export` to serialize a built `GraphQLSchema` to executable JavaScript code. Then modify the exported code to parameterize tenant-specific names, and re-instantiate per tenant without running the full build pipeline.

### How It Would Work

1. Build one tenant's schema normally
2. Export it via `graphile-export`:
   ```
   exportSchema(schema) -> JavaScript source code
   ```
3. Analyze the exported code to identify tenant-specific name literals
4. Replace those literals with parameterized tokens
5. For each new tenant, evaluate the parameterized code with tenant-specific values

### Pros

- `graphile-export` already exists and produces working code
- Avoids both `gather` and `buildSchema` for subsequent tenants
- The exported code is a complete, standalone schema definition

### Cons

- `graphile-export` produces code with baked-in names, SQL identifiers, and plan resolvers. Parameterizing these automatically is extremely fragile.
- Plan resolvers contain closures that reference specific `PgCodec` and `PgResource` instances. Replacing names inside these closures is not straightforward.
- The exported code is meant for deployment optimization, not runtime parameterization
- Evaluating JavaScript source per tenant adds latency and security surface

### Verdict

**Creative but fragile.** The export format is not designed for parameterization. This is not recommended unless `graphile-export` is extended to support it natively.

---

## Approach 7: Shared GraphQLSchema with SQL Rewrite Layer

### Idea

Build one `GraphQLSchema` using canonical/placeholder names. At SQL execution time, intercept the generated SQL and rewrite schema-qualified identifiers to the tenant's actual names.

### How It Would Work

1. Build the schema using a canonical tenant (e.g., the first one encountered, or a synthetic "template" tenant)
2. Share this `GraphQLSchema` across all structurally identical tenants
3. At execution time, intercept `PgExecutor.execute()`:
   - The executor receives a SQL query string (or `pg-sql2` compiled query)
   - Apply a simple find-and-replace for schema-qualified identifiers:
     ```
     "template_prefix_users"."id"  ->  "tenant_abc_users"."id"
     ```
   - Execute against the tenant's database connection

### Where the Rewrite Happens

In `@dataplan/pg`, `PgExecutor` compiles `pg-sql2` fragments into SQL strings. The rewrite could happen:

- **At the `pg-sql2` compilation level**: Add a "schema name resolver" callback that `sql.identifier()` calls at compile time
- **At the executor level**: Post-process the compiled SQL string before sending to PostgreSQL
- **At the PostgreSQL level**: Use `search_path` (same as Approach 4 enhancement)

### Pros

- One `GraphQLSchema` + one set of `OperationPlan` caches for all tenants
- Memory savings are maximal: one ~3 MB schema instead of N copies
- SQL rewriting is conceptually simple for schema-qualified identifiers

### Cons

- String-based SQL rewriting is error-prone (false positives in string literals, dynamic SQL, etc.)
- `pg-sql2` compilation happens at plan finalization time, not execution time. The compiled SQL is cached in the `OperationPlan`. Rewriting would need to happen after this cache.
- Identifiers may appear in non-obvious places: `COMMENT ON`, custom SQL fragments, smart tag SQL, etc.
- Would need careful handling of multi-schema tenants where the same base table name appears in different schemas

### Verdict

**Promising for a controlled environment.** If the naming pattern is simple (uniform prefix replacement), SQL rewriting is feasible. The `pg-sql2` level is the cleanest interception point. Worth prototyping.

---

## Approach 8: Codec/Resource Identity Indirection

### Idea

Introduce an **indirection layer** in `PgCodec` and `PgResource` where the physical SQL identifiers are resolved via a context-provided mapping rather than being stored as fixed values.

### How It Would Work

1. Modify `PgCodec` to store a **logical identifier** instead of a physical SQL fragment:
   ```typescript
   interface PgCodec {
     name: string;                    // logical name (shared)
     logicalIdentifier: string;       // e.g., "users_public.accounts"
     // identifier removed, resolved at execution time
   }
   ```
2. At execution time, the `PgExecutor` receives a tenant-specific **identifier resolver**:
   ```typescript
   identifierResolver.resolve("users_public.accounts") 
   // -> sql.identifier("tenant_abc_users_public", "accounts")
   ```
3. SQL generation in `PgSelectStep` and related steps calls the resolver instead of using a fixed `codec.identifier`

### Pros

- Clean separation of structural identity and physical naming
- One `PgRegistry` + one `GraphQLSchema` for all structurally identical tenants
- SQL identifiers are always correct because they're resolved per-tenant at execution time

### Cons

- Requires changes to `@dataplan/pg` core: `PgSelectStep`, `PgInsertSingleStep`, `PgUpdateSingleStep`, `PgDeleteSingleStep` all use `codec.identifier` directly
- `pg-sql2` fragments are constructed at plan finalization time, which happens once per `OperationPlan`. Moving identifier resolution to execution time means SQL cannot be fully compiled at finalization.
- This conflicts with the performance optimization of pre-compiling SQL during plan finalization
- Alternatively, `OperationPlan` could be made per-tenant (defeating the purpose of sharing the schema)

### Verdict

**Architecturally clean but conflicts with Crystal's performance model.** The pre-compilation of SQL during plan finalization is a core performance feature. Making identifiers late-bound would either degrade performance or require rearchitecting the plan execution model.

---

## Comparison Matrix

| Approach | Gather Saved | buildSchema Saved | Memory Saved | SQL Correctness | Invasiveness | Recommended Phase |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Full SchemaResult Cache | Yes | Yes | ~3 MB/tenant | Requires SQL fix | Medium | Long-term |
| 2. Template + Name Map | Yes | No | ~1.9 MB/tenant | Correct | Medium | POC |
| 3. Parameterized Inflection | Yes | Yes | ~3 MB/tenant | Correct (by design) | Very High | Not recommended |
| 4. Schema Pool + search_path | Yes | Yes | ~3 MB/tenant | Correct (via PG) | Low | **Evaluate first** |
| 5. Gather Cache + Registry Norm. | Yes | No | ~1.9 MB/tenant | Correct | Medium | POC (if #4 fails) |
| 6. graphile-export Cloning | Yes | Yes | ~3 MB/tenant | Fragile | High | Not recommended |
| 7. Shared Schema + SQL Rewrite | Yes | Yes | ~3 MB/tenant | Risky | Medium-High | Prototype |
| 8. Codec/Resource Indirection | Yes | Yes | ~3 MB/tenant | Correct (by design) | Very High | Long-term research |

---

## Recommended Path

### Phase 0: Validate the search_path Option (Approach 4)

**Before doing anything else**, determine whether the Constructive architecture can use PostgreSQL `search_path` to avoid schema-qualified identifiers.

Questions to answer:
- Do tenants have cross-schema table name collisions?
- Can Constructive set `search_path` per-connection to include all of a tenant's schemas?
- Can `PgCodecsPlugin` and `PgTablesPlugin` be configured to emit unqualified identifiers?

If yes: this is by far the simplest path. One schema, zero name mapping, zero cloning.

### Phase 1: Structural Fingerprinting POC (Approach 5)

If `search_path` is not viable, proceed with the gather-level caching POC:

1. Add fingerprinting instrumentation to `PgRegistryPlugin` (after `registryBuilder.build()`)
2. Run against real Constructive private traffic
3. Measure:
   - How many distinct structural fingerprints exist
   - What the naming payload looks like
   - Whether any non-naming differences exist (smart tags, behaviors, etc.)

This is exactly the POC proposed in the original report, with a specific implementation location.

### Phase 2: Registry Clone + Remap (Approach 5 continued)

If Phase 1 confirms high structural duplication:

1. Implement `PgRegistry` deep-clone with name remapping
2. Add a `gather` bypass that returns a cloned + remapped registry for cache-hit tenants
3. Measure the resulting per-tenant cost (should be close to just `buildSchema` at ~84 ms)

### Phase 3: Full Schema Sharing (Approach 1 or 7)

If Phase 2 works and further memory reduction is needed:

1. Evaluate SQL rewriting (Approach 7) as a way to share `GraphQLSchema` across tenants
2. Or explore `pg-sql2` level support for runtime identifier resolution
3. This gets us to one `SchemaResult` per structural fingerprint

---

## Appendix: Key Source Locations in Crystal

| Component | Path | Relevance |
| --- | --- | --- |
| `makeSchema` | `graphile-build/graphile-build/src/index.ts:606` | Entry point for full schema build |
| `gather` | `graphile-build/graphile-build/src/index.ts:445` | Gather phase orchestration |
| `buildSchema` | `graphile-build/graphile-build/src/index.ts:521` | Schema construction from BuildInput |
| `buildInflection` | `graphile-build/graphile-build/src/index.ts:113` | Inflection setup |
| `SchemaBuilder` | `graphile-build/graphile-build/src/SchemaBuilder.ts` | Hook orchestration and type construction |
| `makeNewBuild` | `graphile-build/graphile-build/src/makeNewBuild.ts` | Build object with type registry |
| `PgIntrospectionPlugin` | `graphile-build/graphile-build-pg/src/plugins/PgIntrospectionPlugin.ts` | Database introspection |
| `PgCodecsPlugin` | `graphile-build/graphile-build-pg/src/plugins/PgCodecsPlugin.ts` | Type -> Codec mapping (uses inflection) |
| `PgTablesPlugin` | `graphile-build/graphile-build-pg/src/plugins/PgTablesPlugin.ts` | Class -> Resource mapping (uses inflection) |
| `PgRegistryPlugin` | `graphile-build/graphile-build-pg/src/plugins/PgRegistryPlugin.ts` | Registry builder orchestration |
| `_schemaPrefix` inflector | `graphile-build/graphile-build-pg/src/plugins/PgTablesPlugin.ts:261` | Schema name prefix logic |
| `establishOperationPlan` | `grafast/grafast/src/establishOperationPlan.ts` | OperationPlan (Aether) caching |
| `postgraphile()` | `postgraphile/postgraphile/src/index.ts` | Top-level instance + createServ |
| `grafserv base` | `grafast/grafserv/src/core/base.ts` | HTTP handler setup |
| `graphile-export` | `utils/graphile-export/src/exportSchema.ts` | Schema serialization |

---

## Appendix: Naming Flow Example

For a tenant with schema prefix `abc123_`:

```
PostgreSQL catalog:
  namespace: abc123_users_public
  class:     accounts
  column:    id (int4), email (text)

PgIntrospectionPlugin:
  PgNamespace { nspname: "abc123_users_public" }
  PgClass { relname: "accounts", relnamespace: <nsp_id> }

Inflection:
  _schemaPrefix({ pgNamespace, serviceName })
    -> "abc123UsersPublic_"  (if not first schema in pgServices)
  classCodecName({ pgClass, serviceName })
    -> camelCase("abc123UsersPublic_accounts")
    -> "abc123UsersPublicAccounts"

PgCodecsPlugin:
  PgCodec {
    name: "abc123UsersPublicAccounts",
    identifier: sql.identifier("abc123_users_public", "accounts"),
    attributes: { id: { codec: int4Codec }, email: { codec: textCodec } }
  }

PgTablesPlugin:
  PgResource {
    name: "abc123UsersPublicAccounts",
    from: sql.identifier("abc123_users_public", "accounts"),
    codec: <above codec>
  }

buildSchema:
  GraphQLObjectType { name: "Abc123UsersPublicAccount" }
  Query.abc123UsersPublicAccounts -> PgSelectStep(resource)

SQL generation:
  select "abc123_users_public"."accounts"."id", ... from "abc123_users_public"."accounts"
```

A second tenant with prefix `def456_` would produce an identical structure but with `def456_` everywhere that `abc123_` appears. The structural fingerprint (column types, constraints, relations) would be identical.
