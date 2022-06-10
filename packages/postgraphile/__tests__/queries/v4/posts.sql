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
            'headline'::text,
            (__local_1__."headline"),
            '@headlineTrimmed'::text,
            (
              select to_json(__local_2__) as "value"
              from "a"."post_headline_trimmed"(__local_1__) as __local_2__
              where (TRUE) and (TRUE)
            ),
            '@author'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_3__."id"),
                'id'::text,
                (__local_3__."id"),
                'name'::text,
                (__local_3__."person_full_name"),
                '@firstName'::text,
                (
                  select to_json(__local_4__) as "value"
                  from "c"."person_first_name"(__local_3__) as __local_4__
                  where (TRUE) and (TRUE)
                ),
                '@firstPost'::text,
                (
                  select (
                    case when (__local_5__ is null) then null else json_build_object(
                      '__identifiers'::text,
                      json_build_array(__local_5__."id"),
                      'id'::text,
                      (__local_5__."id"),
                      'headline'::text,
                      (__local_5__."headline"),
                      '@headlineTrimmed'::text,
                      (
                        select to_json(__local_6__) as "value"
                        from "a"."post_headline_trimmed"(__local_5__) as __local_6__
                        where (TRUE) and (TRUE)
                      ),
                      '@author'::text,
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
                        where (__local_5__."author_id" = __local_7__."id") and (TRUE) and (TRUE)
                      )
                    ) end
                  ) as object
                  from "c"."person_first_post"(__local_3__) as __local_5__
                  where (
                    not (__local_5__ is null)
                  ) and (TRUE) and (TRUE)
                ),
                '@friends'::text,
                (
                  with __local_9__ as (
                    select to_json(
                      (
                        json_build_object(
                          '__identifiers'::text,
                          json_build_array(__local_10__."id"),
                          'id'::text,
                          (__local_10__."id"),
                          'name'::text,
                          (__local_10__."person_full_name"),
                          '@firstName'::text,
                          (
                            select to_json(__local_11__) as "value"
                            from "c"."person_first_name"(__local_10__) as __local_11__
                            where (TRUE) and (TRUE)
                          )
                        )
                      )
                    ) as "@nodes",
                    to_json(
                      json_build_array(
                        'natural',
                        (
                          row_number( ) over (partition by 1)
                        )
                      )
                    ) as "__cursor"
                    from "c"."person_friends"(__local_3__) as __local_10__
                    where (TRUE) and (TRUE)
                  ),
                  __local_12__ as (
                    select json_agg(
                      to_json(__local_9__)
                    ) as data
                    from __local_9__
                  )
                  select json_build_object(
                    'data'::text,
                    coalesce(
                      (
                        select __local_12__.data
                        from __local_12__
                      ),
                      '[]'::json
                    ),
                    'aggregates'::text,
                    (
                      select json_build_object(
                        'totalCount'::text,
                        count(1)
                      )
                      from "c"."person_friends"(__local_3__) as __local_10__
                      where 1 = 1
                    )
                  )
                )
              ) as object
              from "c"."person" as __local_3__
              where (__local_1__."author_id" = __local_3__."id") and (TRUE) and (TRUE)
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
    from "a"."post" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
),
__local_13__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_13__.data
    from __local_13__
  ),
  '[]'::json
) as "data"