with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(
          (
            (__local_1__."id")::numeric
          )::text
        ),
        'id'::text,
        ((__local_1__."id"))::text,
        'text'::text,
        (__local_1__."text")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "large_bigint"."large_node_id" as __local_1__
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

select to_json(
  json_build_array(
    (
      (__local_0__."id")::numeric
    )::text
  )
) as "__identifiers",
to_json(
  ((__local_0__."id"))::text
) as "id",
to_json((__local_0__."text")) as "text"
from "large_bigint"."large_node_id" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(
    (
      (__local_0__."id")::numeric
    )::text
  )
) as "__identifiers",
to_json(
  ((__local_0__."id"))::text
) as "id",
to_json((__local_0__."text")) as "text"
from "large_bigint"."large_node_id" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)