select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."email")) as "email",
to_json(
  (
    select json_build_object(
      'aggregates'::text,
      (
        select json_build_object(
          'totalCount'::text,
          count(1)
        )
        from "c"."person_friends"(__local_0__) as __local_1__
        where 1 = 1
      )
    )
  )
) as "@@25fa9871b4d4d16ffd41359c88e7e851739819c6",
to_json(
  (
    select json_build_object(
      'aggregates'::text,
      (
        select json_build_object(
          'totalCount'::text,
          count(1)
        )
        from "c"."person_friends"(__local_0__) as __local_2__
        where 1 = 1
      )
    )
  )
) as "@@e82261e340b3c5fc784bd0d54ec53541f5a4e2fe"
from "c"."person" as __local_0__
where (
  __local_0__."email" = $1
) and (TRUE) and (TRUE)