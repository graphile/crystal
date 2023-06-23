select
  __people__."person_id"::text as "0",
  __people__."username" as "1"
from "polymorphic"."people" as __people__
order by __people__."person_id" asc
limit 4;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
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
        order by
          __aws_applications__."id" asc
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
        where __gcp_applications__."person_id" = __union_identifiers__."id1"
        order by
          __gcp_applications__."id" asc
      ) as __gcp_applications__
    order by
      "0" asc,
      "n" asc
  ) __applications__
) as __union_result__;

select __aws_applications_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __aws_applications_identifiers__,
lateral (
  select
    __aws_applications__."id"::text as "0",
    __aws_applications_identifiers__.idx as "1"
  from "polymorphic"."aws_applications" as __aws_applications__
  where (
    __aws_applications__."id" = __aws_applications_identifiers__."id0"
  )
  order by __aws_applications__."id" asc
) as __aws_applications_result__;

select __gcp_applications_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __gcp_applications_identifiers__,
lateral (
  select
    __gcp_applications__."id"::text as "0",
    __gcp_applications_identifiers__.idx as "1"
  from "polymorphic"."gcp_applications" as __gcp_applications__
  where (
    __gcp_applications__."id" = __gcp_applications_identifiers__."id0"
  )
  order by __gcp_applications__."id" asc
) as __gcp_applications_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    null as "1",
    null as "2",
    __union_identifiers__.idx as "3"
  from (
      select
        __first_party_vulnerabilities__."1",
        __first_party_vulnerabilities__."2",
        "n"
      from (
        select
          'FirstPartyVulnerability' as "1",
          json_build_array((__first_party_vulnerabilities__."id")::text) as "2",
          row_number() over (
            order by
              __first_party_vulnerabilities__."id" asc
          ) as "n"
        from "polymorphic"."aws_application_first_party_vulnerabilities" as __aws_application_first_party_vulnerabilities__
        inner join "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
        on (
          __first_party_vulnerabilities__."id" = __aws_application_first_party_vulnerabilities__."first_party_vulnerability_id"
        )
        where __aws_application_first_party_vulnerabilities__."aws_application_id" = __union_identifiers__."id0"
        order by
          __first_party_vulnerabilities__."id" asc
      ) as __first_party_vulnerabilities__
    union all
      select
        __third_party_vulnerabilities__."1",
        __third_party_vulnerabilities__."2",
        "n"
      from (
        select
          'ThirdPartyVulnerability' as "1",
          json_build_array((__third_party_vulnerabilities__."id")::text) as "2",
          row_number() over (
            order by
              __third_party_vulnerabilities__."id" asc
          ) as "n"
        from "polymorphic"."aws_application_third_party_vulnerabilities" as __aws_application_third_party_vulnerabilities__
        inner join "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
        on (
          __third_party_vulnerabilities__."id" = __aws_application_third_party_vulnerabilities__."third_party_vulnerability_id"
        )
        where __aws_application_third_party_vulnerabilities__."aws_application_id" = __union_identifiers__."id1"
        order by
          __third_party_vulnerabilities__."id" asc
      ) as __third_party_vulnerabilities__
  ) __vulnerabilities__
) as __union_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    null as "1",
    null as "2",
    __union_identifiers__.idx as "3"
  from (
      select
        __first_party_vulnerabilities__."1",
        __first_party_vulnerabilities__."2",
        "n"
      from (
        select
          'FirstPartyVulnerability' as "1",
          json_build_array((__first_party_vulnerabilities__."id")::text) as "2",
          row_number() over (
            order by
              __first_party_vulnerabilities__."id" asc
          ) as "n"
        from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities__
        inner join "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
        on (
          __first_party_vulnerabilities__."id" = __gcp_application_first_party_vulnerabilities__."first_party_vulnerability_id"
        )
        where __gcp_application_first_party_vulnerabilities__."gcp_application_id" = __union_identifiers__."id0"
        order by
          __first_party_vulnerabilities__."id" asc
      ) as __first_party_vulnerabilities__
    union all
      select
        __third_party_vulnerabilities__."1",
        __third_party_vulnerabilities__."2",
        "n"
      from (
        select
          'ThirdPartyVulnerability' as "1",
          json_build_array((__third_party_vulnerabilities__."id")::text) as "2",
          row_number() over (
            order by
              __third_party_vulnerabilities__."id" asc
          ) as "n"
        from "polymorphic"."gcp_application_third_party_vulnerabilities" as __gcp_application_third_party_vulnerabilities__
        inner join "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
        on (
          __third_party_vulnerabilities__."id" = __gcp_application_third_party_vulnerabilities__."third_party_vulnerability_id"
        )
        where __gcp_application_third_party_vulnerabilities__."gcp_application_id" = __union_identifiers__."id1"
        order by
          __third_party_vulnerabilities__."id" asc
      ) as __third_party_vulnerabilities__
  ) __vulnerabilities__
) as __union_result__;