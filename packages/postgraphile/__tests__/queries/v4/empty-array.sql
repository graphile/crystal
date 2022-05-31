with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'name'::text,
        (__local_1__."person_full_name"),
        'aliases'::text,
        (
          case when (__local_1__."aliases") is null then null when coalesce(
            array_length(
              (__local_1__."aliases"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_2__)
            from unnest((__local_1__."aliases")) as __local_2__
          ) end
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."person" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
    limit 1
  ) __local_1__
),
__local_3__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_3__.data
    from __local_3__
  ),
  '[]'::json
) as "data"