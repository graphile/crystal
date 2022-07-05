with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            'testviewid'::text,
            (__local_1__."testviewid"),
            'col1'::text,
            (__local_1__."col1"),
            'col2'::text,
            (__local_1__."col2")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'view_unique_key_asc',
      json_build_array(__local_1__."testviewid")
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "a"."testview" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."testviewid" ASC
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
        '@node'::text,
        (
          json_build_object(
            'testviewid'::text,
            (__local_1__."testviewid"),
            'col1'::text,
            (__local_1__."col1"),
            'col2'::text,
            (__local_1__."col2")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'col1_desc',
      json_build_array(
        __local_1__."col1",
        __local_1__."testviewid"
      )
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "a"."testview" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."col1" DESC,
    __local_1__."testviewid" ASC
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