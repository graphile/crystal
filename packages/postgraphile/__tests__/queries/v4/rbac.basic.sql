select to_json(
  json_build_array(__local_0__."person_id")
) as "__identifiers",
to_json((__local_0__."person_id")) as "personId",
to_json((__local_0__."sekrit")) as "secret"
from "c"."person_secret" as __local_0__
where (
  __local_0__."person_id" = $1
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."person_id"),
        'personId'::text,
        (__local_1__."person_id"),
        'secret'::text,
        (__local_1__."sekrit")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."person_secret" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."person_id" ASC
  ) __local_1__
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
) as "data"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    select (
      case when (__local_1__ is null) then null else json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."person_id"),
        'personId'::text,
        (__local_1__."person_id"),
        'secret'::text,
        (__local_1__."sekrit")
      ) end
    ) as object
    from "c"."person_secret" as __local_1__
    where (
      not (__local_1__ is null)
    )
    and (__local_1__."person_id" = __local_0__."id") and (TRUE) and (TRUE)
  )
) as "@personSecretByPersonId"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."person_id")) as "personId",
to_json((__local_0__."length_in_metres")) as "lengthInMetres",
to_json((__local_0__."mood")) as "mood"
from "c"."left_arm" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'personId'::text,
        (__local_1__."person_id"),
        'lengthInMetres'::text,
        (__local_1__."length_in_metres"),
        'mood'::text,
        (__local_1__."mood")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."left_arm" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
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
) as "data"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    select (
      case when (__local_1__ is null) then null else json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'personId'::text,
        (__local_1__."person_id"),
        'lengthInMetres'::text,
        (__local_1__."length_in_metres"),
        'mood'::text,
        (__local_1__."mood")
      ) end
    ) as object
    from "c"."left_arm" as __local_1__
    where (
      not (__local_1__ is null)
    )
    and (__local_1__."person_id" = __local_0__."id") and (TRUE) and (TRUE)
  )
) as "@leftArmByPersonId"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."headline")) as "headline",
to_json((__local_0__."body")) as "body",
to_json((__local_0__."author_id")) as "authorId"
from "a"."post" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'headline'::text,
        (__local_1__."headline"),
        'body'::text,
        (__local_1__."body"),
        'authorId'::text,
        (__local_1__."author_id")
      )
    )
  ) as "@nodes"
  from "a"."post" as __local_1__
  where (TRUE) and (TRUE)
  order by __local_1__."id" ASC
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
) as "data"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    with __local_1__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_2__."id"),
            'id'::text,
            (__local_2__."id"),
            'headline'::text,
            (__local_2__."headline"),
            'body'::text,
            (__local_2__."body"),
            'authorId'::text,
            (__local_2__."author_id")
          )
        )
      ) as "@nodes"
      from "a"."post" as __local_2__
      where (__local_2__."author_id" = __local_0__."id") and (TRUE) and (TRUE)
      order by __local_2__."id" ASC
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
) as "@postsByAuthorId"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json((__local_0__."person_id_1")) as "personId1",
to_json((__local_0__."person_id_2")) as "personId2"
from "c"."return_table_without_grants"( ) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)