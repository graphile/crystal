# v8.0.0

## 8.0.0-0.1

### Patch Changes

- [`867121cfb`](undefined) - V5 port of @graphile-contrib/pg-simplify-inflector

This is based on V7 of @graphile-contrib/pg-simplify-inflector, rewritten for
PostGraphile V5. The previous versions relate to
@graphile-contrib/pg-simplify-inflector instead.

# v7.0.0

### Simplify primary key to primary key references

If you have two tables that share a primary key value, this version will
simplify the reference. For example with the following database schema:

```sql
create table animals (
  id serial primary key,
  name text
);

create table dogs (
  animal_id int primary key references animals,
  wags_tail bool
);
```

This will create `Animal.dog` (rather than `Animal.dogById`) and `Dog.animal`
(rather than `Dog.animalById`).

# v6.1.0

### Add `@listSuffix` smart tag

Previously there was no easy way to override `pgOmitListSuffix` on a per-entity
basis. With the `@listSuffix` tag you can selectively control naming of both
collection types:

```sql
create table companies (id serial primary key);
comment on table companies is E'@listSuffix omit';
```

By default (`pgOmitListSuffix = null` and `simpleCollections = 'both'`) this
produces:

```diff
-  allCompanies(
+  companiesConnection(
```

```diff
-  allCompaniesList(
+  companies(
```

# v6.0.0

#### Pluralization fixes

Previously we fed the entire table/etc name into `pluralize` but this causes
issues for special cases, for example while `pluralize('genus')` correctly gives
`genera`, `pluralize('old_genus')` would give `old_genus` which is not correct.

Now we segment on underscores/capitals and only pluralize the final segment, so
we're more likely to get the correct result.

This affects everywhere in your entire GraphQL schema where
pluralize/singularize is used.

#### Simplify multi-key relationships.

```sql
  foreign key (organization_id, team_id, goal_uuid) references goals
```

Now named better:

```diff
-  goalByOrganizationIdAndTeamIdAndGoalUuid: Goal
+  organizationTeamGoal: Goal
```

#### Unique relations get shorter-named reverse field.

This was a bug (or, really, an omission) in v5.

For this table:

```sql
create table mascots (
    id serial primary key,
    company_id int unique not null references companies,
    name text not null
);
```

Previously we had the plural relationship simplified:

```diff
-  mascotsByCompanyId(
+  mascots(
```

But the singular was not. This update changes the singular too:

```diff
-  mascotByCompanyId: Mascot
+  mascot: Mascot
```

# v5.0.0-beta.1

# v5.0.0-beta.0

More advanced guesses at field names for reverse relations. Ability to omit list
suffix, simplify patch names, turn on/off simplifying of the 'all' from
'allUsers', ability to change the 'ById' primary key fields to not have that
suffix and instead have the node ID fetchers have a suffix.

# v3.0.0

Simplifies naming in more of the schema.

# v2.0.0

Breaking change: single relation names based on a single key are now named after
the key rather than the target table so long as the key is of the form `foo_id`,
`foo_uuid`.

```sql
create table posts (
  id serial primary key,
  author_id int not null references users,
  body text not null
);
```

```diff
 type Post {
   nodeId: ID!
   id: Int!
   authorId: Int!
-  user: User
+  author: User
   body: String!
 }
```

# v1.0.0

Initial release
