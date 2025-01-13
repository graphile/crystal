select
  __people__."person_id"::text as "0",
  __people__."username" as "1"
from "polymorphic"."people" as __people__
order by __people__."person_id" asc
limit 4;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($5::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    __applications__."0" as "0",
    __applications__."1"::text as "1",
    __union_identifiers__.idx as "2"
  from (
      select
        __aws_applications__."0",
        __aws_applications__."1",
        "n"
      from (
        select
          'AwsApplication' as "0",
          json_build_array((__aws_applications__."id")::text) as "1",
          row_number() over (
            order by
              __aws_applications__."id" asc
          ) as "n"
        from "polymorphic"."aws_applications" as __aws_applications__
        where __aws_applications__."person_id" = __union_identifiers__."id0"
        and __aws_applications__."name" = $1::"text"
        and (
          ('AwsApplication' > $2::"text")
          or (
            'AwsApplication' = $2::"text"
            and (
              __aws_applications__."id" > ($3::"json"->>0)::"int4"
            )
          )
        )
        order by
          __aws_applications__."id" asc
        limit 1
      ) as __aws_applications__
    union all
      select
        __gcp_applications__."0",
        __gcp_applications__."1",
        "n"
      from (
        select
          'GcpApplication' as "0",
          json_build_array((__gcp_applications__."id")::text) as "1",
          row_number() over (
            order by
              __gcp_applications__."id" asc
          ) as "n"
        from "polymorphic"."gcp_applications" as __gcp_applications__
        where __gcp_applications__."person_id" = __union_identifiers__."id0"
        and __gcp_applications__."name" = $4::"text"
        and (
          ('GcpApplication' > $2::"text")
          or (
            'GcpApplication' = $2::"text"
            and (
              __gcp_applications__."id" > ($3::"json"->>0)::"int4"
            )
          )
        )
        order by
          __gcp_applications__."id" asc
        limit 1
      ) as __gcp_applications__
    order by
      "0" asc,
      "n" asc
    limit 1
  ) __applications__
) as __union_result__;

select __aws_applications_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __aws_applications_identifiers__,
lateral (
  select
    __aws_applications__."id"::text as "0",
    __aws_applications__."name" as "1",
    __aws_applications_identifiers__.idx as "2"
  from "polymorphic"."aws_applications" as __aws_applications__
  where (
    __aws_applications__."id" = __aws_applications_identifiers__."id0"
  )
) as __aws_applications_result__;