select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2",
to_json((__local_0__."extra")) as "extra",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_1__."id"),
      'name'::text,
      (__local_1__."person_full_name"),
      'email'::text,
      (__local_1__."email")
    ) as object
    from "c"."person" as __local_1__
    where (__local_0__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
  )
) as "@personByPersonId1",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_2__."id"),
      'name'::text,
      (__local_2__."person_full_name"),
      'email'::text,
      (__local_2__."email")
    ) as object
    from "c"."person" as __local_2__
    where (__local_0__."person_id_2" = __local_2__."id") and (TRUE) and (TRUE)
  )
) as "@personByPersonId2"
from (
  select __local_0__.*
  from "c"."compound_key" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."person_id_1" ASC,
  __local_0__."person_id_2" ASC
) __local_0__

select to_json((__local_0__."person_id")) as "personId",
to_json((__local_0__."compound_key_1")) as "compoundKey1",
to_json((__local_0__."compound_key_2")) as "compoundKey2",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_1__."id"),
      'name'::text,
      (__local_1__."person_full_name"),
      'email'::text,
      (__local_1__."email")
    ) as object
    from "c"."person" as __local_1__
    where (__local_0__."person_id" = __local_1__."id") and (TRUE) and (TRUE)
  )
) as "@personByPersonId",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(
        __local_2__."person_id_1",
        __local_2__."person_id_2"
      ),
      'personId1'::text,
      (__local_2__."person_id_1"),
      'personId2'::text,
      (__local_2__."person_id_2"),
      'extra'::text,
      (__local_2__."extra")
    ) as object
    from "c"."compound_key" as __local_2__
    where (
      __local_0__."compound_key_1" = __local_2__."person_id_1"
    )
    and (
      __local_0__."compound_key_2" = __local_2__."person_id_2"
    ) and (TRUE) and (TRUE)
  )
) as "@compoundKeyByCompoundKey1AndCompoundKey2"
from (
  select __local_0__.*
  from "a"."foreign_key" as __local_0__
  where (TRUE) and (TRUE)
) __local_0__