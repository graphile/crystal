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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    limit 2
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
) as "data",
exists(
  select 1
  from "c"."person" as __local_1__
  where (TRUE)
  and (
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    with __local_2__ as (
      select __local_1__.*
      from "c"."person" as __local_1__
      where (TRUE) and (TRUE)
      order by __local_1__."id" DESC
      limit 2
    )
    select *
    from __local_2__
    order by (
      row_number( ) over (partition by 1)
    ) desc
  ) __local_1__
),
__local_3__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_3__.data
    from __local_3__
  ),
  '[]'::json
) as "data",
FALSE as "hasNextPage",
exists(
  select 1
  from "c"."person" as __local_1__
  where (TRUE)
  and (
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'name_asc',
      json_build_array(
        __local_1__."person_full_name",
        __local_1__."id"
      )
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "c"."person" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."person_full_name" ASC,
    __local_1__."id" ASC
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'name_desc',
      json_build_array(
        __local_1__."person_full_name",
        __local_1__."id"
      )
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "c"."person" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."person_full_name" DESC,
    __local_1__."id" ASC
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    where (TRUE)
    and (
      (
        (
          (
            ('primary_key_asc') = (
              $1
            )
          ) AND (
            (
              (
                __local_1__."id" < $2
              ) OR (
                __local_1__."id" = $2 AND false
              )
            )
          )
        )
      )
    )
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
) as "data",
exists(
  select 1
  from "c"."person" as __local_1__
  where 1 = 1
  and not (
    (
      (
        (
          ('primary_key_asc') = (
            $1
          )
        ) AND (
          (
            (
              __local_1__."id" < $2
            ) OR (
              __local_1__."id" = $2 AND false
            )
          )
        )
      )
    )
  )
) as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    where (
      (
        (
          (
            ('primary_key_asc') = (
              $1
            )
          ) AND (
            (
              (
                __local_1__."id" > $2
              ) OR (
                __local_1__."id" = $2 AND false
              )
            )
          )
        )
      )
    ) and (TRUE)
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
) as "data",
FALSE as "hasNextPage",
exists(
  select 1
  from "c"."person" as __local_1__
  where 1 = 1
  and not (
    (
      (
        (
          ('primary_key_asc') = (
            $1
          )
        ) AND (
          (
            (
              __local_1__."id" > $2
            ) OR (
              __local_1__."id" = $2 AND false
            )
          )
        )
      )
    )
  )
) as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            'x'::text,
            (__local_1__."x"),
            'name'::text,
            (__local_1__."name"),
            'constant'::text,
            (__local_1__."constant")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'view_unique_key_asc',
      json_build_array(__local_1__."x")
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "b"."updatable_view" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."x" ASC
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

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            'x'::text,
            (__local_1__."x"),
            'name'::text,
            (__local_1__."name"),
            'constant'::text,
            (__local_1__."constant")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'constant_asc',
      json_build_array(
        __local_1__."constant",
        __local_1__."x"
      )
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "b"."updatable_view" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."constant" ASC,
    __local_1__."x" ASC
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
            'headline'::text,
            (__local_1__."headline"),
            'authorId'::text,
            (__local_1__."author_id")
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
    where (
      __local_1__."author_id" = $1
    ) and (TRUE) and (TRUE)
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "a"."post" as __local_1__
  where (
    __local_1__."author_id" = $1
  )
) as "aggregates"

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
            'headline'::text,
            (__local_1__."headline"),
            'authorId'::text,
            (__local_1__."author_id")
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
    where (
      __local_1__."author_id" = $1
    ) and (TRUE) and (TRUE)
    order by __local_1__."id" ASC
    limit 2
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
) as "data",
exists(
  select 1
  from "a"."post" as __local_1__
  where (
    __local_1__."author_id" = $1
  ) and (TRUE)
  and (
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "a"."post" as __local_1__
  where (
    __local_1__."author_id" = $1
  )
) as "aggregates"

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
            'headline'::text,
            (__local_1__."headline"),
            'authorId'::text,
            (__local_1__."author_id")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'headline_asc',
      json_build_array(
        __local_1__."headline",
        __local_1__."id"
      )
    )
  ) as "__cursor"
  from (
    with __local_2__ as (
      select __local_1__.*
      from "a"."post" as __local_1__
      where (
        __local_1__."author_id" = $1
      ) and (TRUE) and (TRUE)
      order by __local_1__."headline" DESC,
      __local_1__."id" DESC
      limit 1
    )
    select *
    from __local_2__
    order by (
      row_number( ) over (partition by 1)
    ) desc
  ) __local_1__
),
__local_3__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_3__.data
    from __local_3__
  ),
  '[]'::json
) as "data",
FALSE as "hasNextPage",
exists(
  select 1
  from "a"."post" as __local_1__
  where (
    __local_1__."author_id" = $1
  ) and (TRUE)
  and (
    json_build_array(
      'headline_asc',
      json_build_array(
        __local_1__."headline",
        __local_1__."id"
      )
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "a"."post" as __local_1__
  where (
    __local_1__."author_id" = $1
  )
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    limit 3 offset 1
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
) as "data",
exists(
  select 1
  from "c"."person" as __local_1__
  where (TRUE)
  and (
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  ) offset $1
) as "hasNextPage",
TRUE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    limit 0
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        'rowId'::text,
        (__local_1__."row_id")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."edge_case" as __local_1__
    where (
      __local_1__."row_id" = $1
    ) and (TRUE) and (TRUE)
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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    with __local_2__ as (
      select __local_1__.*
      from "c"."person" as __local_1__
      where (TRUE)
      and (
        (
          (
            (
              ('primary_key_asc') = (
                $1
              )
            ) AND (
              (
                (
                  __local_1__."id" < $2
                ) OR (
                  __local_1__."id" = $2 AND false
                )
              )
            )
          )
        )
      )
      order by __local_1__."id" DESC
      limit 2
    )
    select *
    from __local_2__
    order by (
      row_number( ) over (partition by 1)
    ) desc
  ) __local_1__
),
__local_3__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_3__.data
    from __local_3__
  ),
  '[]'::json
) as "data",
exists(
  select 1
  from "c"."person" as __local_1__
  where 1 = 1
  and not (
    (
      (
        (
          ('primary_key_asc') = (
            $1
          )
        ) AND (
          (
            (
              __local_1__."id" < $2
            ) OR (
              __local_1__."id" = $2 AND false
            )
          )
        )
      )
    )
  )
) as "hasNextPage",
exists(
  select 1
  from "c"."person" as __local_1__
  where (
    (
      (
        (
          ('primary_key_asc') = (
            $1
          )
        ) AND (
          (
            (
              __local_1__."id" < $2
            ) OR (
              __local_1__."id" = $2 AND false
            )
          )
        )
      )
    )
  )
  and (
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    where (
      (
        (
          (
            ('primary_key_asc') = (
              $1
            )
          ) AND (
            (
              (
                __local_1__."id" > $2
              ) OR (
                __local_1__."id" = $2 AND false
              )
            )
          )
        )
      )
    ) and (TRUE)
    order by __local_1__."id" ASC
    limit 1
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
) as "data",
exists(
  select 1
  from "c"."person" as __local_1__
  where (
    (
      (
        (
          ('primary_key_asc') = (
            $1
          )
        ) AND (
          (
            (
              __local_1__."id" > $2
            ) OR (
              __local_1__."id" = $2 AND false
            )
          )
        )
      )
    )
  )
  and (
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasNextPage",
exists(
  select 1
  from "c"."person" as __local_1__
  where 1 = 1
  and not (
    (
      (
        (
          ('primary_key_asc') = (
            $1
          )
        ) AND (
          (
            (
              __local_1__."id" > $2
            ) OR (
              __local_1__."id" = $2 AND false
            )
          )
        )
      )
    )
  )
) as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    with __local_2__ as (
      select __local_1__.*
      from "c"."person" as __local_1__
      where (
        (
          (
            (
              ('primary_key_asc') = (
                $1
              )
            ) AND (
              (
                (
                  __local_1__."id" > $2
                ) OR (
                  __local_1__."id" = $2 AND false
                )
              )
            )
          )
        )
      ) and (TRUE)
      order by __local_1__."id" DESC
      limit 1
    )
    select *
    from __local_2__
    order by (
      row_number( ) over (partition by 1)
    ) desc
  ) __local_1__
),
__local_3__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_3__.data
    from __local_3__
  ),
  '[]'::json
) as "data",
FALSE as "hasNextPage",
exists(
  select 1
  from "c"."person" as __local_1__
  where (TRUE)
  and (
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    where (__local_1__."about" IS NULL) and (TRUE) and (TRUE)
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where (__local_1__."about" IS NULL)
) as "aggregates"

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
            'headline'::text,
            (__local_1__."headline"),
            'authorId'::text,
            (__local_1__."author_id")
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'author_id_desc',
      'headline_desc',
      json_build_array(
        __local_1__."author_id",
        __local_1__."headline",
        __local_1__."id"
      )
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "a"."post" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."author_id" DESC,
    __local_1__."headline" DESC,
    __local_1__."id" ASC
    limit 3
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
) as "data",
exists(
  select 1
  from "a"."post" as __local_1__
  where (TRUE)
  and (
    json_build_array(
      'author_id_desc',
      'headline_desc',
      json_build_array(
        __local_1__."author_id",
        __local_1__."headline",
        __local_1__."id"
      )
    )
  )::text not in (
    select __cursor::text
    from __local_0__
  )
) as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "a"."post" as __local_1__
  where 1 = 1
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    where (
      __local_1__."last_login_from_ip" = $1
    ) and (TRUE) and (TRUE)
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where (
    __local_1__."last_login_from_ip" = $1
  )
) as "aggregates"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '@n1'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'id'::text,
            (__local_1__."id"),
            '@personByAuthorId'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_2__."id"),
                'name'::text,
                (__local_2__."person_full_name")
              ) as object
              from "c"."person" as __local_2__
              where (__local_1__."author_id" = __local_2__."id") and (TRUE) and (TRUE)
            )
          )
        ),
        '@n2'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'headline'::text,
            (__local_1__."headline"),
            '@personByAuthorId'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_3__."id"),
                'id'::text,
                (__local_3__."id")
              ) as object
              from "c"."person" as __local_3__
              where (__local_1__."author_id" = __local_3__."id") and (TRUE) and (TRUE)
            )
          )
        )
      )
    )
  ) as "@e1",
  to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id")
          )
        )
      )
    )
  ) as "@e2"
  from (
    select __local_1__.*
    from "a"."post" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
    limit 2
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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    where (
      __local_1__."last_login_from_subnet" = $1
    ) and (TRUE) and (TRUE)
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where (
    __local_1__."last_login_from_subnet" = $1
  )
) as "aggregates"

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
            'email'::text,
            (__local_1__."email"),
            'config'::text,
            (__local_1__."config"),
            'lastLoginFromIp'::text,
            (__local_1__."last_login_from_ip"),
            'lastLoginFromSubnet'::text,
            (__local_1__."last_login_from_subnet"),
            'userMac'::text,
            (__local_1__."user_mac")
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
    where (
      __local_1__."user_mac" = $1
    ) and (TRUE) and (TRUE)
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "c"."person" as __local_1__
  where (
    __local_1__."user_mac" = $1
  )
) as "aggregates"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'nullableText'::text,
        (__local_1__."nullable_text"),
        'nullableInt'::text,
        (__local_1__."nullable_int")
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."null_test_record" as __local_1__
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