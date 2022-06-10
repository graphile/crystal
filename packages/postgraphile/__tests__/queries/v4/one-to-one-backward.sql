with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'id'::text,
            (__local_1__."id"),
            'name'::text,
            (__local_1__."person_full_name"),
            '@firstName'::text,
            (
              select to_json(__local_2__) as "value"
              from "c"."person_first_name"(__local_1__) as __local_2__
              where (TRUE) and (TRUE)
            ),
            '@leftArm'::text,
            (
              select (
                case when (__local_3__ is null) then null else json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_3__."id"),
                  'id'::text,
                  (__local_3__."id"),
                  'personId'::text,
                  (__local_3__."person_id"),
                  '@personByPersonId'::text,
                  (
                    select json_build_object(
                      '__identifiers'::text,
                      json_build_array(__local_4__."id"),
                      'id'::text,
                      (__local_4__."id"),
                      'name'::text,
                      (__local_4__."person_full_name"),
                      '@firstName'::text,
                      (
                        select to_json(__local_5__) as "value"
                        from "c"."person_first_name"(__local_4__) as __local_5__
                        where (TRUE) and (TRUE)
                      )
                    ) as object
                    from "c"."person" as __local_4__
                    where (__local_3__."person_id" = __local_4__."id") and (TRUE) and (TRUE)
                  ),
                  'lengthInMetres'::text,
                  (__local_3__."length_in_metres")
                ) end
              ) as object
              from "c"."left_arm" as __local_3__
              where (
                not (__local_3__ is null)
              )
              and (__local_3__."person_id" = __local_1__."id") and (TRUE) and (TRUE)
            ),
            '@secret'::text,
            (
              select (
                case when (__local_6__ is null) then null else json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_6__."person_id"),
                  'personId'::text,
                  (__local_6__."person_id"),
                  '@personByPersonId'::text,
                  (
                    select json_build_object(
                      '__identifiers'::text,
                      json_build_array(__local_7__."id"),
                      'id'::text,
                      (__local_7__."id"),
                      'name'::text,
                      (__local_7__."person_full_name"),
                      '@firstName'::text,
                      (
                        select to_json(__local_8__) as "value"
                        from "c"."person_first_name"(__local_7__) as __local_8__
                        where (TRUE) and (TRUE)
                      )
                    ) as object
                    from "c"."person" as __local_7__
                    where (__local_6__."person_id" = __local_7__."id") and (TRUE) and (TRUE)
                  ),
                  'secret'::text,
                  (__local_6__."sekrit")
                ) end
              ) as object
              from "c"."person_secret" as __local_6__
              where (
                not (__local_6__ is null)
              )
              and (__local_6__."person_id" = __local_1__."id") and (TRUE) and (TRUE)
            )
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "c"."person" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
),
__local_9__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_9__.data
    from __local_9__
  ),
  '[]'::json
) as "data"