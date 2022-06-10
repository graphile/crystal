with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        '@node'::text,
        (
          json_build_object(
            'id'::text,
            (__local_1__."id"),
            'inet'::text,
            (__local_1__."inet"),
            'cidr'::text,
            (__local_1__."cidr"),
            'macaddr'::text,
            (__local_1__."macaddr")
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
    from "network_types"."network" as __local_1__
    where (
      __local_1__."inet" = $1
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
  from "network_types"."network" as __local_1__
  where (
    __local_1__."inet" = $1
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
            'id'::text,
            (__local_1__."id"),
            'inet'::text,
            (__local_1__."inet"),
            'cidr'::text,
            (__local_1__."cidr"),
            'macaddr'::text,
            (__local_1__."macaddr")
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
    from "network_types"."network" as __local_1__
    where (
      __local_1__."cidr" = $1
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
  from "network_types"."network" as __local_1__
  where (
    __local_1__."cidr" = $1
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
            'id'::text,
            (__local_1__."id"),
            'inet'::text,
            (__local_1__."inet"),
            'cidr'::text,
            (__local_1__."cidr"),
            'macaddr'::text,
            (__local_1__."macaddr")
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
    from "network_types"."network" as __local_1__
    where (
      __local_1__."macaddr" = $1
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
  from "network_types"."network" as __local_1__
  where (
    __local_1__."macaddr" = $1
  )
) as "aggregates"