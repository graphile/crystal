with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'letter'::text,
        (__local_1__."letter"),
        'letterViaView'::text,
        (__local_1__."letter_via_view"),
        'description'::text,
        (__local_1__."description")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "enum_tables"."letter_descriptions" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
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
) as "data"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'letter'::text,
        (__local_1__."letter"),
        'letterViaView'::text,
        (__local_1__."letter_via_view"),
        'description'::text,
        (__local_1__."description")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "enum_tables"."letter_descriptions" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."letter" DESC
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
) as "data"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'letter'::text,
        (__local_1__."letter"),
        'letterViaView'::text,
        (__local_1__."letter_via_view"),
        'description'::text,
        (__local_1__."description")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "enum_tables"."letter_descriptions" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."letter_via_view" DESC
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
) as "data"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."letter")) as "letter",
to_json((__local_0__."letter_via_view")) as "letterViaView",
to_json((__local_0__."description")) as "description"
from "enum_tables"."letter_descriptions" as __local_0__
where (
  __local_0__."letter" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."letter")) as "letter",
to_json((__local_0__."letter_via_view")) as "letterViaView",
to_json((__local_0__."description")) as "description"
from "enum_tables"."letter_descriptions" as __local_0__
where (
  __local_0__."letter_via_view" = $1
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'letter'::text,
        (__local_1__."letter"),
        'letterViaView'::text,
        (__local_1__."letter_via_view"),
        'description'::text,
        (__local_1__."description")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "enum_tables"."letter_descriptions" as __local_1__
    where (
      __local_1__."letter" = $1
    ) and (TRUE) and (TRUE)
    order by __local_1__."id" ASC
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
) as "data"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'letter'::text,
        (__local_1__."letter"),
        'letterViaView'::text,
        (__local_1__."letter_via_view"),
        'description'::text,
        (__local_1__."description")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "enum_tables"."letter_descriptions" as __local_1__
    where (
      __local_1__."letter_via_view" = $1
    ) and (TRUE) and (TRUE)
    order by __local_1__."id" ASC
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
) as "data"