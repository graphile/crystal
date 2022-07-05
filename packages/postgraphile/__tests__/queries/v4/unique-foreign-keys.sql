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
        '@uniqueForeignKeyByCompoundKey1AndCompoundKey2'::text,
        (
          select (
            case when (__local_2__ is null) then null else json_build_object(
              'compoundKey1'::text,
              (__local_2__."compound_key_1"),
              'compoundKey2'::text,
              (__local_2__."compound_key_2"),
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
                  '@uniqueForeignKeyByCompoundKey1AndCompoundKey2'::text,
                  (
                    select (
                      case when (__local_4__ is null) then null else json_build_object(
                        'compoundKey1'::text,
                        (__local_4__."compound_key_1"),
                        'compoundKey2'::text,
                        (__local_4__."compound_key_2")
                      ) end
                    ) as object
                    from "a"."unique_foreign_key" as __local_4__
                    where (
                      not (__local_4__ is null)
                    )
                    and (
                      __local_4__."compound_key_1" = __local_3__."person_id_1"
                    )
                    and (
                      __local_4__."compound_key_2" = __local_3__."person_id_2"
                    ) and (TRUE) and (TRUE)
                  )
                ) as object
                from "c"."compound_key" as __local_3__
                where (
                  __local_2__."compound_key_1" = __local_3__."person_id_1"
                )
                and (
                  __local_2__."compound_key_2" = __local_3__."person_id_2"
                ) and (TRUE) and (TRUE)
              )
            ) end
          ) as object
          from "a"."unique_foreign_key" as __local_2__
          where (
            not (__local_2__ is null)
          )
          and (
            __local_2__."compound_key_1" = __local_1__."person_id_1"
          )
          and (
            __local_2__."compound_key_2" = __local_1__."person_id_2"
          ) and (TRUE) and (TRUE)
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