select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from "c"."person" as __local_0__
where (
  __local_0__."email" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."person_full_name")) as "name",
to_json((__local_0__."email")) as "email"
from "c"."person" as __local_0__
where (
  __local_0__."email" = $1
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