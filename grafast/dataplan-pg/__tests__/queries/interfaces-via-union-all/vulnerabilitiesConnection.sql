select
  __vulnerabilities__."0" as "0",
  __vulnerabilities__."1"::text as "1",
  __vulnerabilities__."2"::text as "2"
from (
    select
      __first_party_vulnerabilities__."0",
      __first_party_vulnerabilities__."1",
      __first_party_vulnerabilities__."2",
      "n"
    from (
      select
        'FirstPartyVulnerability' as "0",
        json_build_array((__first_party_vulnerabilities__."id")::text) as "1",
        __first_party_vulnerabilities__."cvss_score" as "2",
        row_number() over (
          order by
            __first_party_vulnerabilities__."cvss_score" asc,
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from interfaces_and_unions.first_party_vulnerabilities as __first_party_vulnerabilities__
      order by
        __first_party_vulnerabilities__."cvss_score" asc,
        __first_party_vulnerabilities__."id" asc
    ) as __first_party_vulnerabilities__
  union all
    select
      __third_party_vulnerabilities__."0",
      __third_party_vulnerabilities__."1",
      __third_party_vulnerabilities__."2",
      "n"
    from (
      select
        'ThirdPartyVulnerability' as "0",
        json_build_array((__third_party_vulnerabilities__."id")::text) as "1",
        __third_party_vulnerabilities__."cvss_score" as "2",
        row_number() over (
          order by
            __third_party_vulnerabilities__."cvss_score" asc,
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from interfaces_and_unions.third_party_vulnerabilities as __third_party_vulnerabilities__
      order by
        __third_party_vulnerabilities__."cvss_score" asc,
        __third_party_vulnerabilities__."id" asc
    ) as __third_party_vulnerabilities__
  order by
    "2" asc,
    "0" asc,
    "n" asc
) __vulnerabilities__


select __first_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __first_party_vulnerabilities_identifiers__,
lateral (
  select
    __first_party_vulnerabilities__."cvss_score"::text as "0",
    __first_party_vulnerabilities__."id"::text as "1",
    __first_party_vulnerabilities__."name" as "2",
    __first_party_vulnerabilities__."team_name" as "3",
    __first_party_vulnerabilities_identifiers__.idx as "4"
  from interfaces_and_unions.first_party_vulnerabilities as __first_party_vulnerabilities__
  where
    (
      __first_party_vulnerabilities__."id" = __first_party_vulnerabilities_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
) as __first_party_vulnerabilities_result__;

select __third_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __third_party_vulnerabilities_identifiers__,
lateral (
  select
    __third_party_vulnerabilities__."cvss_score"::text as "0",
    __third_party_vulnerabilities__."id"::text as "1",
    __third_party_vulnerabilities__."name" as "2",
    __third_party_vulnerabilities__."vendor_name" as "3",
    __third_party_vulnerabilities_identifiers__.idx as "4"
  from interfaces_and_unions.third_party_vulnerabilities as __third_party_vulnerabilities__
  where
    (
      __third_party_vulnerabilities__."id" = __third_party_vulnerabilities_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
) as __third_party_vulnerabilities_result__;
