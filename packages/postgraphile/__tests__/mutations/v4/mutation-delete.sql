SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'headline'::text,
      (__local_0__."headline"),
      'authorId'::text,
      (__local_0__."author_id")
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'headline'::text,
      (__local_0__."headline"),
      'authorId'::text,
      (__local_0__."author_id")
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'headline'::text,
      (__local_0__."headline"),
      'authorId'::text,
      (__local_0__."author_id")
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "b"."types"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

ROLLBACK TO SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'headline'::text,
      (__local_0__."headline"),
      'authorId'::text,
      (__local_0__."author_id")
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'headline'::text,
      (__local_0__."headline"),
      'authorId'::text,
      (__local_0__."author_id")
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "a"."post"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"a"."post"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'headline'::text,
      (__local_0__."headline"),
      'authorId'::text,
      (__local_0__."author_id")
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "c"."compound_key"
  where (
    "person_id_1" = $1
  )
  and (
    "person_id_2" = $2
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."compound_key"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(
        __local_0__."person_id_1",
        __local_0__."person_id_2"
      ),
      'personId1'::text,
      (__local_0__."person_id_1"),
      'personId2'::text,
      (__local_0__."person_id_2"),
      '@personByPersonId1'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name")
        ) as object
        from "c"."person" as __local_1__
        where (__local_0__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
      ),
      '@personByPersonId2'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_2__."id"),
          'name'::text,
          (__local_2__."person_full_name")
        ) as object
        from "c"."person" as __local_2__
        where (__local_0__."person_id_2" = __local_2__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@compoundKey"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "c"."compound_key"
  where (
    "person_id_1" = $1
  )
  and (
    "person_id_2" = $2
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."compound_key"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(
    __local_0__."person_id_1",
    __local_0__."person_id_2"
  )
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(
        __local_0__."person_id_1",
        __local_0__."person_id_2"
      ),
      'personId1'::text,
      (__local_0__."person_id_1"),
      'personId2'::text,
      (__local_0__."person_id_2"),
      '@personByPersonId1'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name")
        ) as object
        from "c"."person" as __local_1__
        where (__local_0__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
      ),
      '@personByPersonId2'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_2__."id"),
          'name'::text,
          (__local_2__."person_full_name")
        ) as object
        from "c"."person" as __local_2__
        where (__local_0__."person_id_2" = __local_2__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@compoundKey"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "c"."person"
  where (
    "email" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."person"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "c"."person"
  where (
    "email" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."person"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'name'::text,
      (__local_0__."person_full_name"),
      'email'::text,
      (__local_0__."email"),
      '@issue27UserExists'::text,
      (
        select to_json(__local_1__) as "value"
        from "c"."person_exists"(
          __local_0__,
          $2
        ) as __local_1__
        where (TRUE) and (TRUE)
      )
    )
  )
) as "@person"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  delete
  from "c"."person"
  where (
    "id" = $1
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."person"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    json_build_object(
      '__order_first_name_asc'::text,
      json_build_array(
        'first_name_asc'::text,
        json_build_array(
          (
            "c"."person_first_name"(__local_0__)
          ),
          __local_0__."id"
        )
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '@firstName'::text,
          (
            select to_json(__local_1__) as "value"
            from "c"."person_first_name"(__local_0__) as __local_1__
            where (TRUE) and (TRUE)
          ),
          'id'::text,
          (__local_0__."id"),
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'email'::text,
          (__local_0__."email")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation