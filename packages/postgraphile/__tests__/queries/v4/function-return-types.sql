select to_json(__local_0__) as "value"
from "c"."func_in_inout"(
  $1,
  $2
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."func_in_out"(
  $1
) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value"
from "c"."func_out"( ) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value",
to_json((__local_0__."x")) as "@x",
to_json(
  (
    case when (
      (__local_0__."y") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."y")."a"
      ),
      'b'::text,
      (
        (__local_0__."y")."b"
      ),
      'c'::text,
      (
        (__local_0__."y")."c"
      )
    ) end
  )
) as "@y",
to_json(
  (
    case when (
      (__local_0__."z") is null
    ) then null else json_build_object(
      '__identifiers'::text,
      json_build_array(
        (__local_0__."z")."id"
      ),
      'id'::text,
      (
        (__local_0__."z")."id"
      ),
      'name'::text,
      (
        (__local_0__."z")."person_full_name"
      ),
      '@postsByAuthorId'::text,
      (
        with __local_1__ as (
          select to_json(
            (
              json_build_object(
                '__identifiers'::text,
                json_build_array(__local_2__."id"),
                'id'::text,
                (__local_2__."id")
              )
            )
          ) as "@nodes"
          from (
            select __local_2__.*
            from "a"."post" as __local_2__
            where (
              __local_2__."author_id" = (__local_0__."z")."id"
            ) and (TRUE) and (TRUE)
            order by __local_2__."id" ASC
          ) __local_2__
        ),
        __local_3__ as (
          select json_agg(
            to_json(__local_1__)
          ) as data
          from __local_1__
        )
        select json_build_object(
          'data'::text,
          coalesce(
            (
              select __local_3__.data
              from __local_3__
            ),
            '[]'::json
          )
        )
      )
    ) end
  )
) as "@z"
from "c"."func_out_complex"(
  $1,
  $2
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(__local_1__) as "value",
  to_json(
    (
      json_build_object(
        '@x'::text,
        (__local_1__."x"),
        '@y'::text,
        (
          case when (
            (__local_1__."y") is not distinct
            from null
          ) then null else json_build_object(
            'a'::text,
            (
              (__local_1__."y")."a"
            ),
            'b'::text,
            (
              (__local_1__."y")."b"
            ),
            'c'::text,
            (
              (__local_1__."y")."c"
            )
          ) end
        ),
        '@z'::text,
        (
          case when (
            (__local_1__."z") is null
          ) then null else json_build_object(
            '__identifiers'::text,
            json_build_array(
              (__local_1__."z")."id"
            ),
            'id'::text,
            (
              (__local_1__."z")."id"
            ),
            'name'::text,
            (
              (__local_1__."z")."person_full_name"
            ),
            '@postsByAuthorId'::text,
            (
              with __local_2__ as (
                select to_json(
                  (
                    json_build_object(
                      '__identifiers'::text,
                      json_build_array(__local_3__."id"),
                      'id'::text,
                      (__local_3__."id")
                    )
                  )
                ) as "@nodes"
                from (
                  select __local_3__.*
                  from "a"."post" as __local_3__
                  where (
                    __local_3__."author_id" = (__local_1__."z")."id"
                  ) and (TRUE) and (TRUE)
                  order by __local_3__."id" ASC
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
          ) end
        )
      )
    )
  ) as "@nodes"
  from "c"."func_out_complex_setof"(
    $1,
    $2
  ) as __local_1__
  where (TRUE) and (TRUE)
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
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."func_out_complex_setof"(
    $1,
    $2
  ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(__local_0__) as "value",
to_json((__local_0__."first_out")) as "@firstOut",
to_json((__local_0__."second_out")) as "@secondOut"
from "c"."func_out_out"( ) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

select to_json(__local_0__) as "value",
to_json((__local_0__."o1")) as "@o1",
to_json(
  (
    case when (
      (__local_0__."o2") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."o2")."a"
      ),
      'b'::text,
      (
        (__local_0__."o2")."b"
      ),
      'c'::text,
      (
        (__local_0__."o2")."c"
      )
    ) end
  )
) as "@o2"
from "c"."func_out_out_compound_type"(
  $1
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(__local_1__) as "value",
  to_json(
    (
      json_build_object(
        '@o1'::text,
        (__local_1__."o1"),
        '@o2'::text,
        (__local_1__."o2")
      )
    )
  ) as "@nodes"
  from "c"."func_out_out_setof"( ) as __local_1__
  where (TRUE) and (TRUE)
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
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."func_out_out_setof"( ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(__local_0__) as "value",
to_json((__local_0__."column1")) as "@arg1",
to_json((__local_0__."column2")) as "@arg2"
from "c"."func_out_out_unnamed"( ) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(__local_1__) as "value",
  to_json(
    (
      to_json(__local_1__)
    )
  ) as "@nodes"
  from "c"."func_out_setof"( ) as __local_1__
  where (TRUE) and (TRUE)
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
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."func_out_setof"( ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id"
from "c"."func_out_table"( ) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id")
      )
    )
  ) as "@nodes"
  from "c"."func_out_table_setof"( ) as __local_1__
  where (TRUE) and (TRUE)
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
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."func_out_table_setof"( ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(__local_0__) as "value"
from "c"."func_out_unnamed"( ) as __local_0__
where (TRUE) and (TRUE)

select to_json(__local_0__) as "value",
to_json((__local_0__."column1")) as "@arg1",
to_json((__local_0__."column3")) as "@arg3",
to_json((__local_0__."o2")) as "@o2"
from "c"."func_out_unnamed_out_out_unnamed"( ) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(__local_1__) as "value",
  to_json(
    (
      json_build_object(
        '@col1'::text,
        (__local_1__."col1"),
        '@col2'::text,
        (__local_1__."col2")
      )
    )
  ) as "@nodes"
  from "c"."func_returns_table_multi_col"(
    $1
  ) as __local_1__
  where (TRUE) and (TRUE)
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
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."func_returns_table_multi_col"(
    $1
  ) as __local_1__
  where 1 = 1
) as "aggregates"

with __local_0__ as (
  select to_json(__local_1__) as "value",
  to_json(
    (
      to_json(__local_1__)
    )
  ) as "@nodes"
  from "c"."func_returns_table_one_col"(
    $1
  ) as __local_1__
  where (TRUE) and (TRUE)
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
) as "data",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."func_returns_table_one_col"(
    $1
  ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_full_name")) as "name",
to_json(
  (
    select (
      case when (__local_1__ is null) then null else json_build_object(
        'value'::text,
        __local_1__,
        '@x'::text,
        (__local_1__."x"),
        '@y'::text,
        (
          case when (
            (__local_1__."y") is not distinct
            from null
          ) then null else json_build_object(
            'a'::text,
            (
              (__local_1__."y")."a"
            ),
            'b'::text,
            (
              (__local_1__."y")."b"
            ),
            'c'::text,
            (
              (__local_1__."y")."c"
            )
          ) end
        ),
        '@z'::text,
        (
          case when (
            (__local_1__."z") is null
          ) then null else json_build_object(
            '__identifiers'::text,
            json_build_array(
              (__local_1__."z")."id"
            ),
            'id'::text,
            (
              (__local_1__."z")."id"
            ),
            'name'::text,
            (
              (__local_1__."z")."person_full_name"
            ),
            '@postsByAuthorId'::text,
            (
              with __local_2__ as (
                select to_json(
                  (
                    json_build_object(
                      '__identifiers'::text,
                      json_build_array(__local_3__."id"),
                      'id'::text,
                      (__local_3__."id")
                    )
                  )
                ) as "@nodes"
                from (
                  select __local_3__.*
                  from "a"."post" as __local_3__
                  where (
                    __local_3__."author_id" = (__local_1__."z")."id"
                  ) and (TRUE) and (TRUE)
                  order by __local_3__."id" ASC
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
          ) end
        )
      ) end
    ) as object
    from "c"."person_computed_complex"(
      __local_0__,
      $1,
      $2
    ) as __local_1__
    where (
      not (__local_1__ is null)
    ) and (TRUE) and (TRUE)
  )
) as "@computedComplex",
to_json(
  (
    select (
      case when (__local_5__ is null) then null else json_build_object(
        '__identifiers'::text,
        json_build_array(__local_5__."id"),
        'id'::text,
        (__local_5__."id"),
        'name'::text,
        (__local_5__."person_full_name")
      ) end
    ) as object
    from "c"."person_computed_first_arg_inout"(__local_0__) as __local_5__
    where (
      not (__local_5__ is null)
    ) and (TRUE) and (TRUE)
  )
) as "@computedFirstArgInout",
to_json(
  (
    select (
      case when (__local_6__ is null) then null else json_build_object(
        'value'::text,
        __local_6__,
        '@person'::text,
        (
          case when (
            (__local_6__."person") is null
          ) then null else json_build_object(
            'id'::text,
            (
              (__local_6__."person")."id"
            ),
            'name'::text,
            (
              (__local_6__."person")."person_full_name"
            )
          ) end
        ),
        '@o'::text,
        (__local_6__."o")
      ) end
    ) as object
    from "c"."person_computed_first_arg_inout_out"(__local_0__) as __local_6__
    where (
      not (__local_6__ is null)
    ) and (TRUE) and (TRUE)
  )
) as "@computedFirstArgInoutOut",
to_json(
  (
    select to_json(__local_7__) as "value"
    from "c"."person_computed_inout"(
      __local_0__,
      $3
    ) as __local_7__
    where (TRUE) and (TRUE)
  )
) as "@computedInout",
to_json(
  (
    select (
      case when (__local_8__ is null) then null else json_build_object(
        'value'::text,
        __local_8__,
        '@ino'::text,
        (__local_8__."ino"),
        '@o'::text,
        (__local_8__."o")
      ) end
    ) as object
    from "c"."person_computed_inout_out"(
      __local_0__,
      $4
    ) as __local_8__
    where (
      not (__local_8__ is null)
    ) and (TRUE) and (TRUE)
  )
) as "@computedInoutOut",
to_json(
  (
    select to_json(__local_9__) as "value"
    from "c"."person_computed_out"(__local_0__) as __local_9__
    where (TRUE) and (TRUE)
  )
) as "@computedOut",
to_json(
  (
    select (
      case when (__local_10__ is null) then null else json_build_object(
        'value'::text,
        __local_10__,
        '@o1'::text,
        (__local_10__."o1"),
        '@o2'::text,
        (__local_10__."o2")
      ) end
    ) as object
    from "c"."person_computed_out_out"(__local_0__) as __local_10__
    where (
      not (__local_10__ is null)
    ) and (TRUE) and (TRUE)
  )
) as "@computedOutOut"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $5
) and (TRUE) and (TRUE)

select to_json(__local_0__) as "value",
to_json(
  (
    case when (
      (__local_0__."left_arm") is null
    ) then null else json_build_object(
      'id'::text,
      (
        (__local_0__."left_arm")."id"
      ),
      'lengthInMetres'::text,
      (
        (__local_0__."left_arm")."length_in_metres"
      ),
      'mood'::text,
      (
        (__local_0__."left_arm")."mood"
      ),
      '@personByPersonId'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name"),
          '@personSecretByPersonId'::text,
          (
            select (
              case when (__local_2__ is null) then null else json_build_object(
                '__identifiers'::text,
                json_build_array(__local_2__."person_id"),
                'secret'::text,
                (__local_2__."sekrit")
              ) end
            ) as object
            from "c"."person_secret" as __local_2__
            where (
              not (__local_2__ is null)
            )
            and (__local_2__."person_id" = __local_1__."id") and (TRUE) and (TRUE)
          )
        ) as object
        from "c"."person" as __local_1__
        where (
          (__local_0__."left_arm")."person_id" = __local_1__."id"
        ) and (TRUE) and (TRUE)
      ),
      '__identifiers'::text,
      json_build_array(
        (__local_0__."left_arm")."id"
      )
    ) end
  )
) as "@leftArm",
to_json(
  (
    case when (
      (__local_0__."left_arm") is null
    ) then null else json_build_object(
      'personId'::text,
      (
        (__local_0__."left_arm")."person_id"
      )
    ) end
  )
) as "@l2",
to_json(
  (
    case when (
      (__local_0__."post") is null
    ) then null else json_build_object(
      'id'::text,
      (
        (__local_0__."post")."id"
      ),
      'headline'::text,
      (
        (__local_0__."post")."headline"
      ),
      'authorId'::text,
      (
        (__local_0__."post")."author_id"
      ),
      '@personByAuthorId'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_3__."id"),
          'name'::text,
          (__local_3__."person_full_name"),
          '@personSecretByPersonId'::text,
          (
            select (
              case when (__local_4__ is null) then null else json_build_object(
                '__identifiers'::text,
                json_build_array(__local_4__."person_id"),
                'secret'::text,
                (__local_4__."sekrit")
              ) end
            ) as object
            from "c"."person_secret" as __local_4__
            where (
              not (__local_4__ is null)
            )
            and (__local_4__."person_id" = __local_3__."id") and (TRUE) and (TRUE)
          )
        ) as object
        from "c"."person" as __local_3__
        where (
          (__local_0__."post")."author_id" = __local_3__."id"
        ) and (TRUE) and (TRUE)
      ),
      '__identifiers'::text,
      json_build_array(
        (__local_0__."post")."id"
      )
    ) end
  )
) as "@post",
to_json((__local_0__."txt")) as "@txt"
from "c"."query_output_two_rows"(
  $1,
  $2,
  $3
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

select to_json(__local_0__) as "value",
to_json(
  (
    case when (
      (__local_0__."left_arm") is null
    ) then null else json_build_object(
      'id'::text,
      (
        (__local_0__."left_arm")."id"
      ),
      'lengthInMetres'::text,
      (
        (__local_0__."left_arm")."length_in_metres"
      ),
      'mood'::text,
      (
        (__local_0__."left_arm")."mood"
      ),
      '@personByPersonId'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name"),
          '@personSecretByPersonId'::text,
          (
            select (
              case when (__local_2__ is null) then null else json_build_object(
                '__identifiers'::text,
                json_build_array(__local_2__."person_id"),
                'secret'::text,
                (__local_2__."sekrit")
              ) end
            ) as object
            from "c"."person_secret" as __local_2__
            where (
              not (__local_2__ is null)
            )
            and (__local_2__."person_id" = __local_1__."id") and (TRUE) and (TRUE)
          )
        ) as object
        from "c"."person" as __local_1__
        where (
          (__local_0__."left_arm")."person_id" = __local_1__."id"
        ) and (TRUE) and (TRUE)
      ),
      '__identifiers'::text,
      json_build_array(
        (__local_0__."left_arm")."id"
      )
    ) end
  )
) as "@leftArm",
to_json(
  (
    case when (
      (__local_0__."left_arm") is null
    ) then null else json_build_object(
      'personId'::text,
      (
        (__local_0__."left_arm")."person_id"
      )
    ) end
  )
) as "@l2",
to_json(
  (
    case when (
      (__local_0__."post") is null
    ) then null else json_build_object(
      'id'::text,
      (
        (__local_0__."post")."id"
      ),
      'headline'::text,
      (
        (__local_0__."post")."headline"
      ),
      'authorId'::text,
      (
        (__local_0__."post")."author_id"
      ),
      '@personByAuthorId'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_3__."id"),
          'name'::text,
          (__local_3__."person_full_name"),
          '@personSecretByPersonId'::text,
          (
            select (
              case when (__local_4__ is null) then null else json_build_object(
                '__identifiers'::text,
                json_build_array(__local_4__."person_id"),
                'secret'::text,
                (__local_4__."sekrit")
              ) end
            ) as object
            from "c"."person_secret" as __local_4__
            where (
              not (__local_4__ is null)
            )
            and (__local_4__."person_id" = __local_3__."id") and (TRUE) and (TRUE)
          )
        ) as object
        from "c"."person" as __local_3__
        where (
          (__local_0__."post")."author_id" = __local_3__."id"
        ) and (TRUE) and (TRUE)
      ),
      '__identifiers'::text,
      json_build_array(
        (__local_0__."post")."id"
      )
    ) end
  )
) as "@post",
to_json((__local_0__."txt")) as "@txt"
from "c"."query_output_two_rows"(
  $1,
  $2,
  $3
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

select to_json(__local_0__) as "value",
to_json((__local_0__."id")) as "@id",
to_json(
  ((__local_0__."total_duration"))::text
) as "@totalDuration"
from "c"."search_test_summaries"( ) as __local_0__
where (TRUE) and (TRUE)