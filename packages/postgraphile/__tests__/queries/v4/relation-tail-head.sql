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
        (__local_1__."person_id_2"),
        'extra'::text,
        (__local_1__."extra"),
        '@personByPersonId1'::text,
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
          where (__local_1__."person_id_1" = __local_2__."id") and (TRUE) and (TRUE)
        ),
        '@personByPersonId2'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_3__."id"),
            'name'::text,
            (__local_3__."person_full_name"),
            'email'::text,
            (__local_3__."email")
          ) as object
          from "c"."person" as __local_3__
          where (__local_1__."person_id_2" = __local_3__."id") and (TRUE) and (TRUE)
        )
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

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        'personId'::text,
        (__local_1__."person_id"),
        'compoundKey1'::text,
        (__local_1__."compound_key_1"),
        'compoundKey2'::text,
        (__local_1__."compound_key_2"),
        '@personByPersonId'::text,
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
          where (__local_1__."person_id" = __local_2__."id") and (TRUE) and (TRUE)
        ),
        '@compoundKeyByCompoundKey1AndCompoundKey2'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(
              __local_3__."person_id_1",
              __local_3__."person_id_2"
            ),
            'personId1'::text,
            (__local_3__."person_id_1"),
            'personId2'::text,
            (__local_3__."person_id_2"),
            'extra'::text,
            (__local_3__."extra")
          ) as object
          from "c"."compound_key" as __local_3__
          where (
            __local_1__."compound_key_1" = __local_3__."person_id_1"
          )
          and (
            __local_1__."compound_key_2" = __local_3__."person_id_2"
          ) and (TRUE) and (TRUE)
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "a"."foreign_key" as __local_1__
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