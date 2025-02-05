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
    __applications__."0" as "0",
    __applications__."1"::text as "1",
    to_char(__applications__."2", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2",
    __applications__."3"::text as "3",
    __union_identifiers__.idx as "4"
  from (
      select
        __aws_applications__."0",
        __aws_applications__."1",
        __aws_applications__."2",
        __aws_applications__."3",
        "n"
      from (
        select
          'AwsApplication' as "0",
          json_build_array((__aws_applications__."id")::text) as "1",
          __aws_applications__."last_deployed" as "2",
          __aws_applications__."id" as "3",
          row_number() over (
            order by
              __aws_applications__."last_deployed" desc,
              __aws_applications__."id" desc,
              __aws_applications__."id" asc
          ) as "n"
        from "polymorphic"."aws_applications" as __aws_applications__
        where __aws_applications__."person_id" = __union_identifiers__."id0"
        order by
          __aws_applications__."last_deployed" desc,
          __aws_applications__."id" desc,
          __aws_applications__."id" asc
      ) as __aws_applications__
    union all
      select
        __gcp_applications__."0",
        __gcp_applications__."1",
        __gcp_applications__."2",
        __gcp_applications__."3",
        "n"
      from (
        select
          'GcpApplication' as "0",
          json_build_array((__gcp_applications__."id")::text) as "1",
          __gcp_applications__."last_deployed" as "2",
          __gcp_applications__."id" as "3",
          row_number() over (
            order by
              __gcp_applications__."last_deployed" desc,
              __gcp_applications__."id" desc,
              __gcp_applications__."id" asc
          ) as "n"
        from "polymorphic"."gcp_applications" as __gcp_applications__
        where __gcp_applications__."person_id" = __union_identifiers__."id0"
        order by
          __gcp_applications__."last_deployed" desc,
          __gcp_applications__."id" desc,
          __gcp_applications__."id" asc
      ) as __gcp_applications__
    order by
      "2" desc,
      "3" desc,
      "0" asc,
      "n" asc
  ) __applications__
) as __union_result__;

select __aws_applications_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __aws_applications_identifiers__,
lateral (
  select
    __aws_applications__."id"::text as "0",
    __aws_applications__."name" as "1",
    to_char(__aws_applications__."last_deployed", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2",
    __aws_applications_identifiers__.idx as "3"
  from "polymorphic"."aws_applications" as __aws_applications__
  where (
    __aws_applications__."id" = __aws_applications_identifiers__."id0"
  )
) as __aws_applications_result__;

select __gcp_applications_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __gcp_applications_identifiers__,
lateral (
  select
    __gcp_applications__."id"::text as "0",
    __gcp_applications__."name" as "1",
    to_char(__gcp_applications__."last_deployed", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2",
    __gcp_applications_identifiers__.idx as "3"
  from "polymorphic"."gcp_applications" as __gcp_applications__
  where (
    __gcp_applications__."id" = __gcp_applications_identifiers__."id0"
  )
) as __gcp_applications_result__;