SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."json_identity_mutation"(
    $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."json"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."json" as __local_0__
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
) as "@json"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."jsonb_identity_mutation"(
    $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."jsonb"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."jsonb" as __local_0__
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
) as "@json"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."json_identity_mutation"(
    $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."json"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."json" as __local_0__
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
) as "@json"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."jsonb_identity_mutation"(
    $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."jsonb"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."jsonb" as __local_0__
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
) as "@json"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."jsonb_identity_mutation_plpgsql"(
    $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."jsonb"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."jsonb" as __local_0__
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
) as "@json"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."jsonb_identity_mutation_plpgsql_with_default"( ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."jsonb"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."jsonb" as __local_0__
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
) as "@json"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."jsonb_identity_mutation_plpgsql_with_default"(
    "_the_json" := $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."jsonb"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."jsonb" as __local_0__
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
) as "@json"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "a"."add_1_mutation"(
    $1,
    $2
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "a"."add_2_mutation"(
    $1,
    "b" := $2
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "a"."add_3_mutation"(
    NULL,
    $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."int4"
)::text
from __local_0__

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "a"."add_4_mutation"(
    $1,
    "b" := $2
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "a"."add_4_mutation_error"(
    $1,
    "b" := $2
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."int4"
)::text
from __local_0__

ROLLBACK TO SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "b"."mult_1"(
    $1,
    $2
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "b"."mult_2"(
    $1,
    $2
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "b"."mult_3"(
    $1,
    $2
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "b"."mult_4"(
    $1,
    $2
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."types_mutation"(
    $1,
    $2,
    $3,
    array[$4,
    $5,
    $6]::"pg_catalog"."_int4",
    $7,
    "c"."floatrange"(
      $8,
      $9,
      $10
    )
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."bool"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."bool" as __local_0__
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
) as "@boolean"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "b"."compound_type_mutation"(
    row(
      $1::"pg_catalog"."int4",
      $2::"pg_catalog"."text",
      $3::"b"."color",
      NULL,
      $4::"b"."enum_caps",
      $5::"b"."enum_with_empty_string",
      $6::"pg_catalog"."interval",
      $7::"pg_catalog"."int4"
    )::"c"."compound_type"
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."compound_type"
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
      'a'::text,
      (__local_0__."a"),
      'b'::text,
      (__local_0__."b"),
      'c'::text,
      (__local_0__."c"),
      'd'::text,
      (__local_0__."d"),
      'e'::text,
      (__local_0__."e"),
      'f'::text,
      (__local_0__."f"),
      'g'::text,
      ((__local_0__."g"))::text,
      'fooBar'::text,
      (__local_0__."foo_bar")
    )
  )
) as "@compoundType"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "b"."compound_type_set_mutation"(
    row(
      $1::"pg_catalog"."int4",
      $2::"pg_catalog"."text",
      $3::"b"."color",
      NULL,
      $4::"b"."enum_caps",
      $5::"b"."enum_with_empty_string",
      $6::"pg_catalog"."interval",
      $7::"pg_catalog"."int4"
    )::"c"."compound_type"
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."compound_type"
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
      'a'::text,
      (__local_0__."a"),
      'b'::text,
      (__local_0__."b"),
      'c'::text,
      (__local_0__."c"),
      'd'::text,
      (__local_0__."d"),
      'e'::text,
      (__local_0__."e"),
      'f'::text,
      (__local_0__."f"),
      'g'::text,
      ((__local_0__."g"))::text,
      'fooBar'::text,
      (__local_0__."foo_bar")
    )
  )
) as "@compoundTypes"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from unnest(
    "b"."compound_type_array_mutation"(
      row(
        $1::"pg_catalog"."int4",
        $2::"pg_catalog"."text",
        $3::"b"."color",
        NULL,
        $4::"b"."enum_caps",
        $5::"b"."enum_with_empty_string",
        $6::"pg_catalog"."interval",
        $7::"pg_catalog"."int4"
      )::"c"."compound_type"
    )
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."compound_type"
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
      'a'::text,
      (__local_0__."a"),
      'b'::text,
      (__local_0__."b"),
      'c'::text,
      (__local_0__."c"),
      'd'::text,
      (__local_0__."d"),
      'e'::text,
      (__local_0__."e"),
      'f'::text,
      (__local_0__."f"),
      'g'::text,
      ((__local_0__."g"))::text,
      'fooBar'::text,
      (__local_0__."foo_bar")
    )
  )
) as "@compoundTypes"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."table_mutation"(
    $1
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'headline'::text,
      (__local_0__."headline"),
      'authorId'::text,
      (__local_0__."author_id")
    )
  )
) as "@post",
to_json(
  (
    select json_build_object(
      'id'::text,
      (__local_1__."id"),
      'name'::text,
      (__local_1__."person_full_name")
    ) as object
    from "c"."person" as __local_1__
    where (__local_0__."author_id" = __local_1__."id") and (TRUE) and (TRUE)
  )
) as "@personByAuthorId",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          'id'::text,
          (__local_0__."id"),
          'headline'::text,
          (__local_0__."headline")
        )
      )
    )
  )
) as "@postEdge"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."table_mutation"(
    $1
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."table_set_mutation"( ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."person"
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
      'name'::text,
      (__local_0__."person_full_name")
    )
  )
) as "@people"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."int_set_mutation"(
    $1,
    NULL,
    $2
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
) as "@integers"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."no_args_mutation"( ) __local_1__
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

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "a"."return_void_mutation"( ) __local_1__
)
select to_json(__local_0__) as "value"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "b"."guid_fn"(NULL) __local_1__
)
select (
  (__local_0__.__local_0__)::"b"."guid"
)::text
from __local_0__

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "b"."guid_fn"(
    $1
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"b"."guid"
)::text
from __local_0__

with __local_0__ as (
  select str::"b"."guid" as __local_0__
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
) as "@guid"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "a"."post_many"(
    array[row(
      $1::"pg_catalog"."int4",
      $2::"pg_catalog"."text",
      $3::"pg_catalog"."text",
      $4::"pg_catalog"."int4",
      array[$5]::"a"."_an_enum"::"a"."_an_enum",
      array[row(
        $6::"pg_catalog"."timestamptz",
        $7::"pg_catalog"."bool"
      )::"a"."comptype"]::"a"."_comptype"::"a"."_comptype"
    )::"a"."post",
    row(
      $8::"pg_catalog"."int4",
      $9::"pg_catalog"."text",
      $10::"pg_catalog"."text",
      $11::"pg_catalog"."int4",
      array[$12]::"a"."_an_enum"::"a"."_an_enum",
      array[row(
        $13::"pg_catalog"."timestamptz",
        NULL
      )::"a"."comptype"]::"a"."_comptype"::"a"."_comptype"
    )::"a"."post",
    row(
      $14::"pg_catalog"."int4",
      $15::"pg_catalog"."text",
      $16::"pg_catalog"."text",
      $17::"pg_catalog"."int4",
      array[$18]::"a"."_an_enum"::"a"."_an_enum",
      array[row(
        $19::"pg_catalog"."timestamptz",
        $20::"pg_catalog"."bool"
      )::"a"."comptype"]::"a"."_comptype"::"a"."_comptype"
    )::"a"."post"]::"a"."_post"
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
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
      'headline'::text,
      (__local_0__."headline"),
      'comptypes'::text,
      (
        case when (__local_0__."comptypes") is null then null when coalesce(
          array_length(
            (__local_0__."comptypes"),
            1
          ),
          0
        ) = 0 then '[]'::json else (
          select json_agg(
            (
              case when (
                __local_1__ is not distinct
                from null
              ) then null else json_build_object(
                'schedule'::text,
                (__local_1__."schedule"),
                'isOptimised'::text,
                (__local_1__."is_optimised")
              ) end
            )
          )
          from unnest((__local_0__."comptypes")) as __local_1__
        ) end
      )
    )
  )
) as "@posts"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "a"."post_with_suffix"(
    row(
      $1::"pg_catalog"."int4",
      $2::"pg_catalog"."text",
      $3::"pg_catalog"."text",
      NULL,
      NULL,
      NULL
    )::"a"."post",
    $4
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
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
      'headline'::text,
      (__local_0__."headline")
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."issue756_mutation"( ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."issue756_set_mutation"( ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."issue756"
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
      'ts'::text,
      (__local_0__."ts")
    )
  )
) as "@issue756S"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from unnest(
    "a"."mutation_compound_type_array"(
      row(
        $1::"pg_catalog"."int4",
        $2::"pg_catalog"."text",
        $3::"b"."color",
        NULL,
        $4::"b"."enum_caps",
        $5::"b"."enum_with_empty_string",
        $6::"pg_catalog"."interval",
        $7::"pg_catalog"."int4"
      )::"c"."compound_type"
    )
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."compound_type"
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
      'a'::text,
      (__local_0__."a"),
      'b'::text,
      (__local_0__."b"),
      'c'::text,
      (__local_0__."c"),
      'd'::text,
      (__local_0__."d"),
      'e'::text,
      (__local_0__."e"),
      'f'::text,
      (__local_0__."f"),
      'g'::text,
      ((__local_0__."g"))::text,
      'fooBar'::text,
      (__local_0__."foo_bar")
    )
  )
) as "@compoundTypes"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from unnest(
    "a"."mutation_text_array"( )
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."text"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."text" as __local_0__
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
) as "@strings"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from unnest(
    "a"."mutation_interval_array"( )
  ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."interval"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."interval" as __local_0__
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (__local_0__)::text
) as "value",
to_json(
  (
    to_json(__local_0__)
  )
) as "@intervals"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "a"."mutation_interval_set"( ) __local_1__
)
select (
  (__local_0__.__local_0__)::"pg_catalog"."interval"
)::text
from __local_0__

with __local_0__ as (
  select str::"pg_catalog"."interval" as __local_0__
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (__local_0__)::text
) as "value",
to_json(
  (
    to_json(__local_0__)
  )
) as "@intervals"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation