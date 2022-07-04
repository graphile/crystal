select to_json((__local_0__."a")) as "a",
to_json((__local_0__."b")) as "b",
to_json((__local_0__."c")) as "c",
to_json((__local_0__."d")) as "d",
to_json((__local_0__."e")) as "e",
to_json((__local_0__."f")) as "f",
to_json(
  ((__local_0__."g"))::text
) as "g"
from "c"."compound_type_set_query"( ) as __local_0__
where (TRUE) and (TRUE)
limit 5

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."person_full_name")) as "name"
from "c"."table_set_query"( ) as __local_0__
where (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."person_full_name")) as "name"
from "c"."table_set_query"( ) as __local_0__
where (TRUE) and (TRUE)
limit 2 offset 2

select to_json(__local_0__) as "value"
from "c"."int_set_query"(
  $1,
  NULL,
  $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(
  (__local_0__)::text
) as "value"
from "a"."static_big_integer"( ) as __local_0__
where (TRUE) and (TRUE)

select to_json(
  (__local_0__)::text
) as "value"
from "a"."query_interval_set"( ) as __local_0__
where (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_1__."object")
        from (
          select json_build_object(
            'value'::text,
            (__local_2__)::text
          ) as object
          from "a"."post_computed_interval_set"(__local_0__) as __local_2__
          where (TRUE) and (TRUE)
        ) as __local_1__
      ),
      '[]'::json
    )
  )
) as "@computedIntervalSetList"
from (
  select __local_0__.*
  from "a"."post" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
  limit 1
) __local_0__