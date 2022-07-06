SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."person" set "person_full_name" = $1,
  "about" = $2
  where (
    "id" = $3
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
      'about'::text,
      (__local_0__."about"),
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
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'id'::text,
          (__local_0__."id")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."person" set "person_full_name" = $1,
  "email" = $2
  where (
    "id" = $3
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
      'about'::text,
      (__local_0__."about"),
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
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'id'::text,
          (__local_0__."id")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."person" set "about" = $1
  where (
    "id" = $2
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
      'about'::text,
      (__local_0__."about"),
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
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'id'::text,
          (__local_0__."id")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."person" set "about" = NULL
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
      'about'::text,
      (__local_0__."about"),
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
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'id'::text,
          (__local_0__."id")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."person" set "person_full_name" = $1,
  "about" = $2
  where (
    "id" = $3
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
      'about'::text,
      (__local_0__."about"),
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
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'id'::text,
          (__local_0__."id")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."person" set "about" = $1
  where (
    "email" = $2
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
      'about'::text,
      (__local_0__."about"),
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
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'id'::text,
          (__local_0__."id")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "c"."compound_key" set "person_id_1" = $1,
  "extra" = $2
  where (
    "person_id_1" = $3
  )
  and (
    "person_id_2" = $4
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
      'extra'::text,
      (__local_0__."extra"),
      '@personByPersonId1'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name")
        ) as object
        from "c"."person" as __local_1__
        where (__local_0__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
      ),
      '@personByPersonId2'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_2__."id"),
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
  update "c"."compound_key" set "person_id_1" = $1,
  "extra" = $2
  where (
    "person_id_1" = $3
  )
  and (
    "person_id_2" = $4
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
      'extra'::text,
      (__local_0__."extra"),
      '@personByPersonId1'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name")
        ) as object
        from "c"."person" as __local_1__
        where (__local_0__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
      ),
      '@personByPersonId2'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_2__."id"),
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
  update "c"."compound_key" set "extra" = $1
  where (
    "person_id_1" = $2
  )
  and (
    "person_id_2" = $3
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
      'extra'::text,
      (__local_0__."extra"),
      '@personByPersonId1'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name")
        ) as object
        from "c"."person" as __local_1__
        where (__local_0__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
      ),
      '@personByPersonId2'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_2__."id"),
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
  update "c"."person" set "email" = $1
  where (
    "email" = $2
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
      'about'::text,
      (__local_0__."about"),
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
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'id'::text,
          (__local_0__."id")
        )
      )
    )
  )
) as "@personEdge"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "a"."default_value" set "null_value" = NULL
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
    str::"a"."default_value"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'nullValue'::text,
      (__local_0__."null_value")
    )
  )
) as "@defaultValue"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "a"."no_primary_key" set "str" = $1
  where (
    "id" = $2
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
    str::"a"."no_primary_key"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'str'::text,
      (__local_0__."str")
    )
  )
) as "@noPrimaryKey"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation