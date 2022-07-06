SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."mutation_in_inout"(
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
) as "@ino"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."mutation_in_out"(
    $1
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
) as "@o"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."mutation_out"( ) __local_1__
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
) as "@o"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_complex"(
    $1,
    $2
  ) __local_1__
)
select (
  array[__local_0__."x"::text ,
  __local_0__."y"::text ,
  __local_0__."z"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "x",
  (__local_1__.output_value_list)[2]::"c"."compound_type" as "y",
  (__local_1__.output_value_list)[3]::"c"."person" as "z"
  from (
    values (
      $1::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@x'::text,
      (__local_0__."x"),
      '@y'::text,
      (
        case when (
          (__local_0__."y") is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (__local_0__."y")."a"
          ),
          'b'::text,
          (
            (__local_0__."y")."b"
          ),
          'c'::text,
          (
            (__local_0__."y")."c"
          )
        ) end
      ),
      '@z'::text,
      (
        case when (
          (__local_0__."z") is null
        ) then null else json_build_object(
          '__identifiers'::text,
          json_build_array(
            (__local_0__."z")."id"
          ),
          'id'::text,
          (
            (__local_0__."z")."id"
          ),
          'name'::text,
          (
            (__local_0__."z")."person_full_name"
          ),
          '@postsByAuthorId'::text,
          (
            with __local_2__ as (
              select to_json(
                (
                  json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_3__."id"),
                    'id'::text,
                    (__local_3__."id")
                  )
                )
              ) as "@nodes"
              from (
                select __local_3__.*
                from "a"."post" as __local_3__
                where (
                  __local_3__."author_id" = (__local_0__."z")."id"
                ) and (TRUE) and (TRUE)
                order by __local_3__."id" ASC
              ) __local_3__
            ),
            __local_4__ as (
              select json_agg(
                to_json(__local_2__)
              ) as data
              from __local_2__
            )
            select json_build_object(
              'data'::text,
              coalesce(
                (
                  select __local_4__.data
                  from __local_4__
                ),
                '[]'::json
              )
            )
          )
        ) end
      )
    )
  )
) as "@result"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_complex_setof"(
    $1,
    $2
  ) __local_1__
)
select (
  array[__local_0__."x"::text ,
  __local_0__."y"::text ,
  __local_0__."z"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "x",
  (__local_1__.output_value_list)[2]::"c"."compound_type" as "y",
  (__local_1__.output_value_list)[3]::"c"."person" as "z"
  from (
    values (
      $1::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@x'::text,
      (__local_0__."x"),
      '@y'::text,
      (
        case when (
          (__local_0__."y") is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (__local_0__."y")."a"
          ),
          'b'::text,
          (
            (__local_0__."y")."b"
          ),
          'c'::text,
          (
            (__local_0__."y")."c"
          )
        ) end
      ),
      '@z'::text,
      (
        case when (
          (__local_0__."z") is null
        ) then null else json_build_object(
          '__identifiers'::text,
          json_build_array(
            (__local_0__."z")."id"
          ),
          'id'::text,
          (
            (__local_0__."z")."id"
          ),
          'name'::text,
          (
            (__local_0__."z")."person_full_name"
          ),
          '@postsByAuthorId'::text,
          (
            with __local_2__ as (
              select to_json(
                (
                  json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_3__."id"),
                    'id'::text,
                    (__local_3__."id")
                  )
                )
              ) as "@nodes"
              from (
                select __local_3__.*
                from "a"."post" as __local_3__
                where (
                  __local_3__."author_id" = (__local_0__."z")."id"
                ) and (TRUE) and (TRUE)
                order by __local_3__."id" ASC
              ) __local_3__
            ),
            __local_4__ as (
              select json_agg(
                to_json(__local_2__)
              ) as data
              from __local_2__
            )
            select json_build_object(
              'data'::text,
              coalesce(
                (
                  select __local_4__.data
                  from __local_4__
                ),
                '[]'::json
              )
            )
          )
        ) end
      )
    )
  )
) as "@results"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_out"( ) __local_1__
)
select (
  array[__local_0__."first_out"::text ,
  __local_0__."second_out"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "first_out",
  (__local_1__.output_value_list)[2]::"pg_catalog"."text" as "second_out"
  from (
    values (
      $1::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@firstOut'::text,
      (__local_0__."first_out"),
      '@secondOut'::text,
      (__local_0__."second_out")
    )
  )
) as "@result"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_out_compound_type"(
    $1
  ) __local_1__
)
select (
  array[__local_0__."o1"::text ,
  __local_0__."o2"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "o1",
  (__local_1__.output_value_list)[2]::"c"."compound_type" as "o2"
  from (
    values (
      $1::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@o1'::text,
      (__local_0__."o1"),
      '@o2'::text,
      (
        case when (
          (__local_0__."o2") is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (__local_0__."o2")."a"
          ),
          'b'::text,
          (
            (__local_0__."o2")."b"
          ),
          'c'::text,
          (
            (__local_0__."o2")."c"
          )
        ) end
      )
    )
  )
) as "@result"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_out_setof"( ) __local_1__
)
select (
  array[__local_0__."o1"::text ,
  __local_0__."o2"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "o1",
  (__local_1__.output_value_list)[2]::"pg_catalog"."text" as "o2"
  from (
    values (
      $1::text[]
    ),
    (
      $2::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@o1'::text,
      (__local_0__."o1"),
      '@o2'::text,
      (__local_0__."o2")
    )
  )
) as "@results"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_out_unnamed"( ) __local_1__
)
select (
  array[__local_0__."column1"::text ,
  __local_0__."column2"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "column1",
  (__local_1__.output_value_list)[2]::"pg_catalog"."text" as "column2"
  from (
    values (
      $1::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@arg1'::text,
      (__local_0__."column1"),
      '@arg2'::text,
      (__local_0__."column2")
    )
  )
) as "@result"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."mutation_out_setof"( ) __local_1__
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
) as "@os"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_table"( ) __local_1__
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id")
    )
  )
) as "@person"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_out_table_setof"( ) __local_1__
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id")
    )
  )
) as "@people"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."mutation_out_unnamed"( ) __local_1__
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
  select __local_1__.*
  from "c"."mutation_out_unnamed_out_out_unnamed"( ) __local_1__
)
select (
  array[__local_0__."column1"::text ,
  __local_0__."o2"::text ,
  __local_0__."column3"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "column1",
  (__local_1__.output_value_list)[2]::"pg_catalog"."text" as "o2",
  (__local_1__.output_value_list)[3]::"pg_catalog"."int4" as "column3"
  from (
    values (
      $1::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@arg1'::text,
      (__local_0__."column1"),
      '@arg3'::text,
      (__local_0__."column3"),
      '@o2'::text,
      (__local_0__."o2")
    )
  )
) as "@result"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "c"."mutation_returns_table_multi_col"(
    $1
  ) __local_1__
)
select (
  array[__local_0__."col1"::text ,
  __local_0__."col2"::text]
)::text
from __local_0__

with __local_0__ as (
  select (__local_1__.output_value_list)[1]::"pg_catalog"."int4" as "col1",
  (__local_1__.output_value_list)[2]::"pg_catalog"."text" as "col2"
  from (
    values (
      $1::text[]
    ),
    (
      $2::text[]
    )
  ) as __local_1__(output_value_list)
)
select to_json(__local_0__) as "value",
to_json(
  (
    json_build_object(
      '@col1'::text,
      (__local_0__."col1"),
      '@col2'::text,
      (__local_0__."col2")
    )
  )
) as "@results"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__ as __local_0__
  from "c"."mutation_returns_table_one_col"(
    $1
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
) as "@col1S"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation