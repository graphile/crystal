with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'name'::text,
        (__local_1__."person_full_name"),
        '@postsByAuthorId'::text,
        (
          with __local_2__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_3__."id"),
                  'headline'::text,
                  (__local_3__."headline"),
                  'authorId'::text,
                  (__local_3__."author_id")
                )
              )
            ) as "@nodes"
            from (
              with __local_4__ as (
                select __local_3__.*
                from "a"."post" as __local_3__
                where (__local_3__."author_id" = __local_1__."id") and (TRUE) and (TRUE)
                order by __local_3__."id" DESC
                limit 2
              )
              select *
              from __local_4__
              order by (
                row_number( ) over (partition by 1)
              ) desc
            ) __local_3__
          ),
          __local_5__ as (
            select json_agg(
              to_json(__local_2__)
            ) as data
            from __local_2__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_5__.data
                from __local_5__
              ),
              '[]'::json
            )
          )
        ),
        '@roundOnePost'::text,
        (
          with __local_6__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_7__."id"),
                  'headline'::text,
                  (__local_7__."headline"),
                  'authorId'::text,
                  (__local_7__."author_id")
                )
              )
            ) as "@nodes"
            from (
              select __local_7__.*
              from "a"."post" as __local_7__
              where (__local_7__."author_id" = __local_1__."id")
              and (
                __local_7__."headline" = $1
              ) and (TRUE) and (TRUE)
              order by __local_7__."id" ASC
            ) __local_7__
          ),
          __local_8__ as (
            select json_agg(
              to_json(__local_6__)
            ) as data
            from __local_6__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_8__.data
                from __local_8__
              ),
              '[]'::json
            )
          )
        ),
        '@compoundKeysByPersonId1'::text,
        (
          with __local_9__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(
                    __local_10__."person_id_1",
                    __local_10__."person_id_2"
                  ),
                  'personId1'::text,
                  (__local_10__."person_id_1"),
                  'personId2'::text,
                  (__local_10__."person_id_2")
                )
              )
            ) as "@nodes"
            from (
              select __local_10__.*
              from "c"."compound_key" as __local_10__
              where (__local_10__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
              order by __local_10__."person_id_1" ASC,
              __local_10__."person_id_2" ASC
            ) __local_10__
          ),
          __local_11__ as (
            select json_agg(
              to_json(__local_9__)
            ) as data
            from __local_9__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_11__.data
                from __local_11__
              ),
              '[]'::json
            )
          )
        ),
        '@compoundKeysByPersonId2'::text,
        (
          with __local_12__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(
                    __local_13__."person_id_1",
                    __local_13__."person_id_2"
                  ),
                  'personId1'::text,
                  (__local_13__."person_id_1"),
                  'personId2'::text,
                  (__local_13__."person_id_2")
                )
              )
            ) as "@nodes"
            from (
              select __local_13__.*
              from "c"."compound_key" as __local_13__
              where (__local_13__."person_id_2" = __local_1__."id") and (TRUE) and (TRUE)
              order by __local_13__."person_id_1" ASC,
              __local_13__."person_id_2" ASC
            ) __local_13__
          ),
          __local_14__ as (
            select json_agg(
              to_json(__local_12__)
            ) as data
            from __local_12__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_14__.data
                from __local_14__
              ),
              '[]'::json
            )
          )
        )
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
__local_15__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_15__.data
    from __local_15__
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
        (__local_1__."person_id_2"),
        '@foreignKeysByCompoundKey1AndCompoundKey2'::text,
        (
          with __local_2__ as (
            select to_json(
              (
                json_build_object(
                  'personId'::text,
                  (__local_3__."person_id"),
                  'compoundKey1'::text,
                  (__local_3__."compound_key_1"),
                  'compoundKey2'::text,
                  (__local_3__."compound_key_2")
                )
              )
            ) as "@nodes"
            from (
              select __local_3__.*
              from "a"."foreign_key" as __local_3__
              where (
                __local_3__."compound_key_1" = __local_1__."person_id_1"
              )
              and (
                __local_3__."compound_key_2" = __local_1__."person_id_2"
              ) and (TRUE) and (TRUE)
            ) __local_3__
          ),
          __local_4__ as (
            select json_agg(
              to_json(__local_2__)
            ) as data
            from __local_2__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_4__.data
                from __local_4__
              ),
              '[]'::json
            )
          )
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
__local_5__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_5__.data
    from __local_5__
  ),
  '[]'::json
) as "data"