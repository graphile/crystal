with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        '@firstName'::text,
        (
          select to_json(__local_2__) as "value"
          from "c"."person_first_name"(__local_1__) as __local_2__
          where (TRUE) and (TRUE)
        )
      )
    )
  ) as "@nodes",
  to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'id'::text,
            (__local_1__."id"),
            '@firstName'::text,
            (
              select to_json(__local_3__) as "value"
              from "c"."person_first_name"(__local_1__) as __local_3__
              where (TRUE) and (TRUE)
            )
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
    from "c"."badly_behaved_function"( ) as __local_1__
    where (TRUE) and (TRUE)
  ) __local_1__
),
__local_4__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_4__.data
    from __local_4__
  ),
  '[]'::json
) as "data"