select
  __people__."person_id"::text as "0",
  __people__."username" as "1"
from "polymorphic"."people" as __people__
order by __people__."person_id" asc
limit 4;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    null as "1",
    null as "2",
    __union_identifiers__.idx as "3"
  from (
      select
        __aws_applications__."1",
        __aws_applications__."2",
        "n"
      from (
        select
          'AwsApplication' as "1",
          json_build_array((__aws_applications__."id")::text) as "2",
          row_number() over (
            order by
              __aws_applications__."id" asc
          ) as "n"
        from "polymorphic"."aws_applications" as __aws_applications__
        where __aws_applications__."person_id" = __union_identifiers__."id0"
        order by
          __aws_applications__."id" asc
      ) as __aws_applications__
    union all
      select
        __gcp_applications__."1",
        __gcp_applications__."2",
        "n"
      from (
        select
          'GcpApplication' as "1",
          json_build_array((__gcp_applications__."id")::text) as "2",
          row_number() over (
            order by
              __gcp_applications__."id" asc
          ) as "n"
        from "polymorphic"."gcp_applications" as __gcp_applications__
        where __gcp_applications__."person_id" = __union_identifiers__."id0"
        order by
          __gcp_applications__."id" asc
      ) as __gcp_applications__
  ) __applications__
) as __union_result__;