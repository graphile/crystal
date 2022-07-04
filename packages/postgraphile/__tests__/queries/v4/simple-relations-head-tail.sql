select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_1__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_2__."id"),
            'headline'::text,
            (__local_2__."headline"),
            'authorId'::text,
            (__local_2__."author_id")
          ) as object
          from (
            select __local_2__.*
            from "a"."post" as __local_2__
            where (__local_2__."author_id" = __local_0__."id") and (TRUE) and (TRUE)
            order by __local_2__."id" ASC
            limit 2
          ) __local_2__
        ) as __local_1__
      ),
      '[]'::json
    )
  )
) as "@postsByAuthorIdList",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_3__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_4__."id"),
            'headline'::text,
            (__local_4__."headline"),
            'authorId'::text,
            (__local_4__."author_id")
          ) as object
          from (
            select __local_4__.*
            from "a"."post" as __local_4__
            where (__local_4__."author_id" = __local_0__."id")
            and (
              __local_4__."headline" = $1
            ) and (TRUE) and (TRUE)
            order by __local_4__."id" ASC
          ) __local_4__
        ) as __local_3__
      ),
      '[]'::json
    )
  )
) as "@roundOnePost",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_5__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(
              __local_6__."person_id_1",
              __local_6__."person_id_2"
            ),
            'personId1'::text,
            (__local_6__."person_id_1"),
            'personId2'::text,
            (__local_6__."person_id_2")
          ) as object
          from (
            select __local_6__.*
            from "c"."compound_key" as __local_6__
            where (__local_6__."person_id_1" = __local_0__."id") and (TRUE) and (TRUE)
            order by __local_6__."person_id_1" ASC,
            __local_6__."person_id_2" ASC
          ) __local_6__
        ) as __local_5__
      ),
      '[]'::json
    )
  )
) as "@compoundKeysByPersonId1List",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_7__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(
              __local_8__."person_id_1",
              __local_8__."person_id_2"
            ),
            'personId1'::text,
            (__local_8__."person_id_1"),
            'personId2'::text,
            (__local_8__."person_id_2")
          ) as object
          from (
            select __local_8__.*
            from "c"."compound_key" as __local_8__
            where (__local_8__."person_id_2" = __local_0__."id") and (TRUE) and (TRUE)
            order by __local_8__."person_id_1" ASC,
            __local_8__."person_id_2" ASC
          ) __local_8__
        ) as __local_7__
      ),
      '[]'::json
    )
  )
) as "@compoundKeysByPersonId2List"
from (
  select __local_0__.*
  from "c"."person" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from (
  select __local_0__.*
  from "c"."compound_key" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."person_id_1" ASC,
  __local_0__."person_id_2" ASC
) __local_0__