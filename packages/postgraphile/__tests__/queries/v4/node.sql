with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'name'::text,
        (__local_1__."person_full_name")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."person" as __local_1__
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
        json_build_array(
          __local_1__."person_id_1",
          __local_1__."person_id_2"
        ),
        'personId1'::text,
        (__local_1__."person_id_1"),
        'personId2'::text,
        (__local_1__."person_id_2")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."compound_key" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."person_id_1" ASC,
    __local_1__."person_id_2" ASC
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
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from "c"."compound_key" as __local_0__
where (
  __local_0__."person_id_1" = $1
)
and (
  __local_0__."person_id_2" = $2
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from "c"."compound_key" as __local_0__
where (
  __local_0__."person_id_1" = $1
)
and (
  __local_0__."person_id_2" = $2
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from "c"."compound_key" as __local_0__
where (
  __local_0__."person_id_1" = $1
)
and (
  __local_0__."person_id_2" = $2
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from "c"."compound_key" as __local_0__
where (
  __local_0__."person_id_1" = $1
)
and (
  __local_0__."person_id_2" = $2
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from "c"."compound_key" as __local_0__
where (
  __local_0__."person_id_1" = $1
)
and (
  __local_0__."person_id_2" = $2
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from "c"."compound_key" as __local_0__
where (
  __local_0__."person_id_1" = $1
)
and (
  __local_0__."person_id_2" = $2
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."col1")) as "col1",
to_json((__local_0__."col2")) as "col2",
to_json((__local_0__."col3")) as "col3"
from "a"."similar_table_1" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."col3")) as "col3",
to_json((__local_0__."col4")) as "col4",
to_json((__local_0__."col5")) as "col5"
from "a"."similar_table_2" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."col1")) as "col1",
to_json((__local_0__."col2")) as "col2",
to_json((__local_0__."col3")) as "col3"
from "a"."similar_table_1" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."col3")) as "col3",
to_json((__local_0__."col4")) as "col4",
to_json((__local_0__."col5")) as "col5"
from "a"."similar_table_2" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)