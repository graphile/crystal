select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."jsonb_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."json_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."jsonb_identity"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."add_1_query"(
  $1,
  $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."add_2_query"(
  $1,
  "b" := $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."add_3_query"(
  NULL,
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."add_4_query"(
  $1,
  "b" := $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."optional_missing_middle_1"(
  $1,
  "c" := $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."optional_missing_middle_1"(
  $1,
  "b" := $2,
  "c" := $3
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."optional_missing_middle_2"(
  $1,
  "c" := $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."optional_missing_middle_3"(
  $1,
  "c" := $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."optional_missing_middle_4"(
  $1,
  NULL,
  $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "a"."optional_missing_middle_5"(
  $1,
  NULL,
  $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."types_query"(
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
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."types_query"(
  $1,
  $2,
  $3,
  array[]::"pg_catalog"."_int4",
  $4,
  "c"."floatrange"(
    NULL,
    NULL,
    $5
  )
) as __local_0__
where (TRUE) and (TRUE)

select to_json((__local_0__."a")) as "a",
to_json((__local_0__."b")) as "b",
to_json((__local_0__."c")) as "c",
to_json((__local_0__."d")) as "d",
to_json((__local_0__."e")) as "e",
to_json((__local_0__."f")) as "f",
to_json(
  ((__local_0__."g"))::text
) as "g",
to_json((__local_0__."foo_bar")) as "fooBar"
from "b"."compound_type_query"(
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
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            'a'::text,
            (__local_1__."a"),
            'b'::text,
            (__local_1__."b"),
            'c'::text,
            (__local_1__."c"),
            'd'::text,
            (__local_1__."d"),
            'e'::text,
            (__local_1__."e"),
            'f'::text,
            (__local_1__."f"),
            'g'::text,
            ((__local_1__."g"))::text,
            'fooBar'::text,
            (__local_1__."foo_bar")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."compound_type_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 5
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."compound_type_set_query"( ) as __local_1__
  where (TRUE) offset 5
) as "hasNextPage",
false as "hasPreviousPage"

select to_json((__local_0__."a")) as "a",
to_json((__local_0__."b")) as "b",
to_json((__local_0__."c")) as "c",
to_json((__local_0__."d")) as "d",
to_json((__local_0__."e")) as "e",
to_json((__local_0__."f")) as "f",
to_json(
  ((__local_0__."g"))::text
) as "g",
to_json((__local_0__."foo_bar")) as "fooBar"
from unnest(
  "b"."compound_type_array_query"(
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
) as __local_0__
where (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."headline")) as "headline",
to_json((__local_0__."author_id")) as "authorId"
from "c"."table_query"(
  $1
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
false as "hasNextPage",
false as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'name_asc',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  order by __local_1__."person_full_name" ASC
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
false as "hasNextPage",
false as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (
    __local_1__."person_full_name" = $1
  ) and (TRUE) and (TRUE)
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
false as "hasNextPage",
false as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 1 offset 3
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 4
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 1 offset 3
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 4
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 2 offset 2
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 4
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 2
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 2
) as "hasNextPage",
false as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 2 offset 3
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 5
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 2 offset 2
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 4
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 2 offset 4
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 6
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 2
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 2
) as "hasNextPage",
false as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 6
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 6
) as "hasNextPage",
false as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 0
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) and (TRUE)
  limit 2 offset 2
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query"( ) as __local_1__
  where (TRUE) offset 4
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      0 + (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "c"."table_set_query_plpgsql"( ) as __local_1__
    where (TRUE) and (TRUE)
    limit 2
  ) __local_1__
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query_plpgsql"( ) as __local_1__
  where (TRUE) offset 2
) as "hasNextPage",
false as "hasPreviousPage"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      2 + (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "c"."table_set_query_plpgsql"( ) as __local_1__
    where (TRUE) and (TRUE)
    limit 2 offset 2
  ) __local_1__
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."table_set_query_plpgsql"( ) as __local_1__
  where (TRUE) offset 4
) as "hasNextPage",
TRUE as "hasPreviousPage"

with __local_0__ as (
  select to_json(__local_1__) as "value",
  to_json(
    (
      to_json(__local_1__)
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "c"."int_set_query"(
    $1,
    NULL,
    $2
  ) as __local_1__
  where (TRUE) and (TRUE)
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."int_set_query"(
    $1,
    NULL,
    $2
  ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(__local_0__) as "value"
from "c"."no_args_query"( ) as __local_0__
where (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (__local_1__)::text
  ) as "value",
  to_json(
    (
      to_json(__local_1__)
    )
  ) as "@edges"
  from "a"."static_big_integer"( ) as __local_1__
  where (TRUE) and (TRUE)
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "a"."static_big_integer"( ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json((__local_0__."a")) as "a",
to_json((__local_0__."b")) as "b",
to_json((__local_0__."c")) as "c",
to_json((__local_0__."d")) as "d",
to_json((__local_0__."e")) as "e",
to_json((__local_0__."f")) as "f",
to_json(
  ((__local_0__."g"))::text
) as "g",
to_json((__local_0__."foo_bar")) as "fooBar"
from unnest(
  "a"."query_compound_type_array"(
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
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from unnest(
  "a"."query_text_array"( )
) as __local_0__
where (TRUE) and (TRUE)

select to_json(
  (__local_0__)::text
) as "value"
from unnest(
  "a"."query_interval_array"( )
) as __local_0__
where (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (__local_1__)::text
  ) as "value",
  to_json(
    (
      to_json(__local_1__)
    )
  ) as "@nodes",
  to_json(
    (
      to_json(__local_1__)
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'natural',
      (
        row_number( ) over (partition by 1)
      )
    )
  ) as "__cursor"
  from "a"."query_interval_set"( ) as __local_1__
  where (TRUE) and (TRUE)
),
__local_2__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_2__.data
    from __local_2__
  ),
  '[]'::json
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "a"."query_interval_set"( ) as __local_1__
  where 1 = 1
) as "aggregates"