with __local_0__ as (
  select to_json(
    (
      json_build_object(
        'id'::text,
        (__local_1__."id"),
        'firstName'::text,
        (__local_1__."first_name"),
        'lastName'::text,
        (__local_1__."last_name"),
        'colNoCreate'::text,
        (__local_1__."col_no_create"),
        'colNoUpdate'::text,
        (__local_1__."col_no_update"),
        'colNoOrder'::text,
        (__local_1__."col_no_order"),
        'colNoFilter'::text,
        (__local_1__."col_no_filter"),
        'colNoCreateUpdate'::text,
        (__local_1__."col_no_create_update"),
        'colNoCreateUpdateOrderFilter'::text,
        (__local_1__."col_no_create_update_order_filter")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "d"."person" as __local_1__
    where (
      __local_1__."col_no_create" = $1
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