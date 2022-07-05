SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "enum_tables"."letter_descriptions"
  where (
    "letter" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"enum_tables"."letter_descriptions"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'letter'::text,
      (__local_0__."letter"),
      'letterViaView'::text,
      (__local_0__."letter_via_view")
    )
  )
) as "@letterDescription"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "enum_tables"."letter_descriptions" (
    "letter",
    "letter_via_view",
    "description"
  ) values(
    $1,
    $2,
    $3
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"enum_tables"."letter_descriptions"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'letter'::text,
      (__local_0__."letter"),
      'letterViaView'::text,
      (__local_0__."letter_via_view"),
      'description'::text,
      (__local_0__."description")
    )
  )
) as "@letterDescription"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "enum_tables"."referencing_table_mutation"(
    row(
      NULL,
      $1::"unknown",
      $2::"unknown",
      $3::"unknown"
    )::"enum_tables"."referencing_table"
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."int4"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."int4" as __local_0__
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(__local_0__) as "value",
to_json(
  (
    to_json(__local_0__)
  )
) as "@integer"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation