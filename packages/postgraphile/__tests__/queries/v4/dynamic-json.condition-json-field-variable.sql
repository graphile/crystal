with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'jsonData'::text,
        (__local_1__."json_data")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."my_table" as __local_1__
    where (
      __local_1__."json_data" = $1
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
        'jsonData'::text,
        (__local_1__."json_data")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."my_table" as __local_1__
    where (
      __local_1__."json_data" = $1
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
        'jsonData'::text,
        (__local_1__."json_data")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."my_table" as __local_1__
    where (
      __local_1__."json_data" = $1
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