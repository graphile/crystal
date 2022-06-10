with __local_0__ as (
  select to_json(
    (
      json_build_object(
        'id'::text,
        (__local_1__."id"),
        'regrole'::text,
        (__local_1__."regrole"),
        'regnamespace'::text,
        (__local_1__."regnamespace"),
        'bigintDomainArrayDomain'::text,
        (
          case when (__local_1__."bigint_domain_array_domain") is null then null else array(
            select (val)::text
            from unnest((__local_1__."bigint_domain_array_domain")) as unnest(val)
          ) end
        ),
        'domainConstrainedCompoundType'::text,
        (__local_1__."domain_constrained_compound_type")
      )
    )
  ) as "@nodes",
  to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            'id'::text,
            (__local_1__."id"),
            'regrole'::text,
            (__local_1__."regrole"),
            'regnamespace'::text,
            (__local_1__."regnamespace"),
            'bigintDomainArrayDomain'::text,
            (
              case when (__local_1__."bigint_domain_array_domain") is null then null else array(
                select (val)::text
                from unnest((__local_1__."bigint_domain_array_domain")) as unnest(val)
              ) end
            ),
            'domainConstrainedCompoundType'::text,
            (__local_1__."domain_constrained_compound_type")
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
    from "pg11"."types" as __local_1__
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
  from "pg11"."types" as __local_1__
  where 1 = 1
) as "aggregates"