-- The schema behind graphile-build/graphile-build-pg/__tests__/PgViewConstraintsPlugin.fixture.json.
--
-- One relation per case the reader of a plan has to get right, positive and
-- negative alike. The fixture is PostgreSQL's answer for this schema, not a
-- transcription of it: apply this file to an empty database and read the plans back
-- through the plugin's own catalog queries (readCatalogRelations, readTypeCoercions,
-- explainStatement), keeping the plan fields plan-origins.ts reads.

create schema lab;
set search_path = lab;

create table currency (code text primary key, title text not null);
create table bank (id bigint primary key, title text not null);
create table wallet (id bigint primary key, cur_code text not null references currency(code));

create table tx (
  id bigint primary key,
  cur_code text not null references currency(code),
  bank_id bigint references bank(id),
  amount numeric not null
);
create table tx2 (
  id bigint primary key,
  cur_code varchar(8) not null references currency(code)
);
create domain cur_code_dom as text;
create table tx3 (
  id bigint primary key,
  cur_code cur_code_dom not null references currency(code)
);
create table refund (id bigint primary key, cur_code text not null references currency(code));

-- unique index as the only key a view can carry
create table asset (id bigint primary key, code text not null, label text);
create unique index asset_code_key on asset (code) include (id);

-- nullable unique: a key that identifies nothing where it is null
create table slot (id bigint primary key, tag text);
create unique index slot_tag_key on slot (tag);

-- POSITIVE
create view v_bare as select id, cur_code from tx;
create view v_left_join as
  select t.id, b.id as bank_id, t.cur_code from tx t left join bank b on b.id = t.bank_id;
create view v_group as select cur_code, count(*) as n from tx group by cur_code;
create view v_window as
  select id, cur_code, row_number() over (partition by cur_code order by id) as rn from tx;
create view v_distinct_src as select distinct id, cur_code from tx;
create view v_over_view as select id, cur_code from v_distinct_src;
create view v_cast_varchar_to_text as select id, cur_code::text as cur_code from tx2;
create view v_cast_domain_to_base as select id, cur_code::text as cur_code from tx3;
create view v_union_same_column as
  select id, cur_code from tx where amount > 0
  union all
  select id, cur_code from tx where amount < 0;
create view v_union_same_target as
  select id, cur_code from tx union all select id, cur_code from wallet;
create view v_union_null_branch as
  select id, bank_id from tx union all select id, NULL::bigint from refund;
create view v_cte as
  with live as (select t.id, t.cur_code, t.amount from tx t)
  select live.id, live.cur_code, max(paired.amount) as top_amount
  from live join live paired on paired.cur_code = live.cur_code
  group by live.id, live.cur_code;
create view v_unique_key as select code from asset;
create materialized view m_tx as select id, cur_code, amount from tx;

create view v_union_unreadable_branch as
  select id, cur_code from tx union all select id, upper(cur_code) from wallet;

-- POSITIVE, non-nullness: the planner folds the outer join into an inner one because
-- the qualifier is strict, so a column nullable by the view's text is not nullable
-- in fact — and the plan is the only place that shows it.
create view v_collapsed_left_join as
  select t.id, b.title from tx t left join bank b on b.id = t.bank_id where b.title > '';

-- NEGATIVE, non-nullness: which side an outer join nulls, one view per kind. The
-- preserved side of each is the positive half of the same case.
create view v_right_join as
  select t.id as t_id, b.title from tx t right join bank b on b.id = t.bank_id;
create view v_full_join as
  select t.id as t_id, b.title from tx t full join bank b on b.id = t.bank_id;
create view v_nested_outer_join as
  select r.id, paired.title
  from refund r
  left join (select b.id, b.title from bank b join currency c on c.code = b.title) paired
    on paired.id = r.id;
create view v_union_null_over_not_null as
  select id, cur_code from tx union all select id, NULL::text from refund;
create view v_grouping_sets as select id, count(*) as n from tx group by rollup (id);
create view v_not_null_predicate as select id, bank_id from tx where bank_id is not null;
create view v_cte_nulled_scan as
  with live as (select t.cur_code from tx t)
  select r.id, a.cur_code as a_code, b.cur_code as b_code
  from refund r
  left join live a on a.cur_code = r.id::text
  join live b on b.cur_code = 'x';
create view v_cte_reordered_scans as
  with live as (select t.id, t.cur_code from tx t)
  select r.id, a.cur_code, b.cur_code as b_cur_code
  from refund r
  left join live a on a.id = r.id
  left join live b on b.id = r.id + 1;

-- NEGATIVE
create view v_coalesce as
  select t.id, coalesce(t.cur_code, w.cur_code) as cur_code
  from tx t left join wallet w on w.id = t.id;
create view v_constant as select id, 'usdt'::text as cur_code from tx;
create view v_cast_truncating as select id, cur_code::varchar(4) as cur_code from tx;
create view v_cast_function as select id, bank_id::numeric as bank_id from tx;
create view v_distinct_over_union as
  select distinct * from (select id, cur_code from tx union all select id, cur_code from wallet) s;
create view v_self_join as
  select a.id as a_id, b.cur_code as b_cur_code from tx a join tx b on b.id = a.id + 1;
create view v_nullable_unique as select tag from slot;

-- The union is what the plan is built on; whether it is also the root of the plan is
-- the planner's judgement of cost. An `ORDER BY` puts a `Sort` or a `MergeAppend`
-- over it, a `LIMIT` puts a `Limit` over it, and parallelism puts a `Gather` over a
-- parallel `Append`. All three read the same, because the union under them is the
-- same union.
create view v_union_ordered as
  select id, cur_code from tx union all select id, cur_code from wallet order by 1;
create view v_union_limited as
  select id, cur_code
  from (select id, cur_code from tx union all select id, cur_code from wallet) s
  limit 10;

-- De-duplication over a union is refused whichever way the planner implements it.
-- `Unique` over a `Sort` and a hashed `Aggregate` grouping by every column are the
-- same query costed two ways, and the `Aggregate` computes, so neither is stepped
-- over. `v_distinct_over_union` above is the `SELECT DISTINCT` spelling of it; this
-- is the `UNION` one, which PostgreSQL plans the same way.
create view v_union_distinct as
  select id, cur_code from tx union select id, cur_code from wallet;

-- ── Views built on views ───────────────────────────────────────────────────────
--
-- PostgreSQL flattens a view into the query above it wherever it may, and then the
-- plan names the base relations directly. Two things stop it. A security-barrier
-- view is never pulled up — its qualifiers have to stay below whatever the query
-- above adds — and a `Subquery Scan` that projects a narrower list than its child's
-- is not the trivial one `setrefs.c` removes. So a barrier view asked for whole
-- dissolves all the same, and a barrier view asked for a subset leaves a node
-- spelled with its own column names and nothing else.
--
-- Every published projection of this repository is a barrier view, so this is the
-- shape the surfaces are actually made of.

create view v_barrier with (security_barrier = true) as
  select id, cur_code, bank_id, amount from tx;
-- Asked for its whole select list, the barrier is a trivial `Subquery Scan` and
-- `setrefs.c` removes it: the plan is the plan of `tx`.
create view v_barrier_whole as select id, cur_code, bank_id, amount from v_barrier;
-- Asked for a subset, it stays, and the descent has a boundary to cross.
create view v_over_barrier as select id, cur_code from v_barrier;
-- A barrier over a barrier, narrowing at each level: two boundaries in one plan.
create view v_barrier_over_barrier with (security_barrier = true) as
  select id, cur_code, bank_id from v_barrier;
create view v_barrier_chain as select id, cur_code from v_barrier_over_barrier;
-- A barrier over a plain view: the plain one is flattened into the barrier, and the
-- barrier is asked for its whole list, so nothing is left of either.
create view v_barrier_over_plain with (security_barrier = true) as
  select id, cur_code from v_bare;
-- A plain view over a barrier is the ordinary surface shape.
create view v_plain_over_barrier as select id, bank_id from v_barrier;
-- A union inside a barrier view, read branch by branch through the boundary.
create view v_barrier_union with (security_barrier = true) as
  select id, cur_code, amount from tx union all select id, cur_code, 0::numeric from wallet;
create view v_over_barrier_union as select id, cur_code from v_barrier_union;

-- NEGATIVE, across a boundary: what the inner view computes stays computed.
create view v_barrier_computed with (security_barrier = true) as
  select id, cur_code, upper(cur_code) as loud, amount from tx;
create view v_over_barrier_computed as select id, loud from v_barrier_computed;

-- NEGATIVE, across a boundary: the inner view narrows the value and the outer casts
-- it back to the base type. Read one step at a time each cast is binary-coercible;
-- read end to end the value is not the base column's any more.
create view v_barrier_narrowing with (security_barrier = true) as
  select id, cur_code::varchar(4) as cur_code, amount from tx;
create view v_over_barrier_narrowing as
  select id, cur_code::text as cur_code from v_barrier_narrowing;

-- NEGATIVE: an alias over a barrier view. The plan prints the alias and nothing else
-- — no schema, no relation name — so the name is all there is to pin the node to a
-- view with, and `t` is not the name of any view this one is built on.
create view v_aliased_barrier as select t.id, t.cur_code from v_barrier t;

-- NEGATIVE: a column that is a NULL literal all the way up contributes no value.
create view v_null_column as select id, NULL::text as cur_code from tx;

-- NEGATIVE: a set operation that is not a union reads its input as one tagged
-- stream, and there is no branch to read a column off.
create view v_except as
  select id, cur_code from tx except select id, cur_code from wallet;

-- NEGATIVE: a row source the catalog has nothing to say about. A function scan
-- carries an alias like any other scan and names no relation.
create view v_function_scan as
  select t.id, u.val from tx t cross join lateral unnest(array [t.bank_id]) as u(val);

-- A union inside a barrier view that PostgreSQL cannot pull up into the query above
-- — an `ORDER BY` of its own is enough — keeps both the boundary and the union, so
-- the branches are read one by one on the far side of a `Subquery Scan`.
create view v_barrier_union_ordered with (security_barrier = true) as
  select id, cur_code, amount from tx
  union all
  select id, cur_code, 0::numeric from wallet
  order by 1;
create view v_over_barrier_union_ordered as
  select id, cur_code from v_barrier_union_ordered;

-- NEGATIVE: a `VALUES` list is a row source with an alias and no relation behind it.
-- Two rows, because PostgreSQL folds a one-row `VALUES` into constants and the case
-- would then be the constant one instead.
create view v_values_scan as
  select v.a, v.b from (values (1, 'usdt'), (2, 'btc')) as v(a, b);

-- NEGATIVE: a constant-false qualifier leaves a plan with no scan in it at all, while
-- the select list still spells the relation that is not read.
create view v_where_false as select id, cur_code from tx where 1 = 0;
