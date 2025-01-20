select
  __vulnerability__."0"::text as "0",
  __vulnerability__."1" as "1",
  __vulnerability__."2"::text as "2"
from (
    select
      __first_party_vulnerabilities__."0",
      __first_party_vulnerabilities__."1",
      __first_party_vulnerabilities__."2",
      "n"
    from (
      select
        __first_party_vulnerabilities__."cvss_score" as "0",
        'FirstPartyVulnerability' as "1",
        json_build_array((__first_party_vulnerabilities__."id")::text) as "2",
        row_number() over (
          order by
            __first_party_vulnerabilities__."cvss_score" desc,
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
      order by
        __first_party_vulnerabilities__."cvss_score" desc,
        __first_party_vulnerabilities__."id" asc
      limit 4
    ) as __first_party_vulnerabilities__
  union all
    select
      __third_party_vulnerabilities__."0",
      __third_party_vulnerabilities__."1",
      __third_party_vulnerabilities__."2",
      "n"
    from (
      select
        __third_party_vulnerabilities__."cvss_score" as "0",
        'ThirdPartyVulnerability' as "1",
        json_build_array((__third_party_vulnerabilities__."id")::text) as "2",
        row_number() over (
          order by
            __third_party_vulnerabilities__."cvss_score" desc,
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      order by
        __third_party_vulnerabilities__."cvss_score" desc,
        __third_party_vulnerabilities__."id" asc
      limit 4
    ) as __third_party_vulnerabilities__
  order by
    "0" desc,
    "1" asc,
    "n" asc
  limit 3
  offset 1
) __vulnerability__


select
  __vulnerability__."0"::text as "0",
  __vulnerability__."1" as "1",
  __vulnerability__."2"::text as "2"
from (
    select
      __first_party_vulnerabilities__."0",
      __first_party_vulnerabilities__."1",
      __first_party_vulnerabilities__."2",
      "n"
    from (
      select
        __first_party_vulnerabilities__."cvss_score" as "0",
        'FirstPartyVulnerability' as "1",
        json_build_array((__first_party_vulnerabilities__."id")::text) as "2",
        row_number() over (
          order by
            __first_party_vulnerabilities__."cvss_score" desc,
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
      where (
        (__first_party_vulnerabilities__."cvss_score" < $1::"float8")
        or (
          __first_party_vulnerabilities__."cvss_score" = $1::"float8"
          and (
            ('FirstPartyVulnerability' > $2::"text")
            or (
              'FirstPartyVulnerability' = $2::"text"
              and (
                __first_party_vulnerabilities__."id" > ($3::"json"->>0)::"int4"
              )
            )
          )
        )
      )
      order by
        __first_party_vulnerabilities__."cvss_score" desc,
        __first_party_vulnerabilities__."id" asc
      limit 3
    ) as __first_party_vulnerabilities__
  union all
    select
      __third_party_vulnerabilities__."0",
      __third_party_vulnerabilities__."1",
      __third_party_vulnerabilities__."2",
      "n"
    from (
      select
        __third_party_vulnerabilities__."cvss_score" as "0",
        'ThirdPartyVulnerability' as "1",
        json_build_array((__third_party_vulnerabilities__."id")::text) as "2",
        row_number() over (
          order by
            __third_party_vulnerabilities__."cvss_score" desc,
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      where (
        (__third_party_vulnerabilities__."cvss_score" < $1::"float8")
        or (
          __third_party_vulnerabilities__."cvss_score" = $1::"float8"
          and (
            ('ThirdPartyVulnerability' > $2::"text")
            or (
              'ThirdPartyVulnerability' = $2::"text"
              and (
                __third_party_vulnerabilities__."id" > ($3::"json"->>0)::"int4"
              )
            )
          )
        )
      )
      order by
        __third_party_vulnerabilities__."cvss_score" desc,
        __third_party_vulnerabilities__."id" asc
      limit 3
    ) as __third_party_vulnerabilities__
  order by
    "0" desc,
    "1" asc,
    "n" asc
  limit 3
) __vulnerability__


select
  (count(*))::text as "0",
  null as "1",
  null as "2"
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
            __first_party_vulnerabilities__."cvss_score" desc,
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
      order by
        __first_party_vulnerabilities__."cvss_score" desc,
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
            __third_party_vulnerabilities__."cvss_score" desc,
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      order by
        __third_party_vulnerabilities__."cvss_score" desc,
        __third_party_vulnerabilities__."id" asc
    ) as __third_party_vulnerabilities__
) __vulnerability__


select
  __vulnerability__."0"::text as "0",
  __vulnerability__."1" as "1",
  __vulnerability__."2"::text as "2"
from (
    select
      __first_party_vulnerabilities__."0",
      __first_party_vulnerabilities__."1",
      __first_party_vulnerabilities__."2",
      "n"
    from (
      select
        __first_party_vulnerabilities__."cvss_score" as "0",
        'FirstPartyVulnerability' as "1",
        json_build_array((__first_party_vulnerabilities__."id")::text) as "2",
        row_number() over (
          order by
            __first_party_vulnerabilities__."cvss_score" desc,
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
      where (
        (__first_party_vulnerabilities__."cvss_score" < $1::"float8")
        or (
          __first_party_vulnerabilities__."cvss_score" = $1::"float8"
          and (
            ('FirstPartyVulnerability' > $2::"text")
            or (
              'FirstPartyVulnerability' = $2::"text"
              and (
                __first_party_vulnerabilities__."id" > ($3::"json"->>0)::"int4"
              )
            )
          )
        )
      )
      order by
        __first_party_vulnerabilities__."cvss_score" desc,
        __first_party_vulnerabilities__."id" asc
      limit 4
    ) as __first_party_vulnerabilities__
  union all
    select
      __third_party_vulnerabilities__."0",
      __third_party_vulnerabilities__."1",
      __third_party_vulnerabilities__."2",
      "n"
    from (
      select
        __third_party_vulnerabilities__."cvss_score" as "0",
        'ThirdPartyVulnerability' as "1",
        json_build_array((__third_party_vulnerabilities__."id")::text) as "2",
        row_number() over (
          order by
            __third_party_vulnerabilities__."cvss_score" desc,
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      where (
        (__third_party_vulnerabilities__."cvss_score" < $1::"float8")
        or (
          __third_party_vulnerabilities__."cvss_score" = $1::"float8"
          and (
            ('ThirdPartyVulnerability' > $2::"text")
            or (
              'ThirdPartyVulnerability' = $2::"text"
              and (
                __third_party_vulnerabilities__."id" > ($3::"json"->>0)::"int4"
              )
            )
          )
        )
      )
      order by
        __third_party_vulnerabilities__."cvss_score" desc,
        __third_party_vulnerabilities__."id" asc
      limit 4
    ) as __third_party_vulnerabilities__
  order by
    "0" desc,
    "1" asc,
    "n" asc
  limit 4
) __vulnerability__


select
  __first_party_vulnerabilities__."id"::text as "0",
  __first_party_vulnerabilities__."name" as "1",
  __first_party_vulnerabilities__."cvss_score"::text as "2"
from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
where (
  __first_party_vulnerabilities__."id" = $1::"int4"
);

select __third_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __third_party_vulnerabilities_identifiers__,
lateral (
  select
    __third_party_vulnerabilities__."id"::text as "0",
    __third_party_vulnerabilities__."name" as "1",
    __third_party_vulnerabilities__."cvss_score"::text as "2",
    __third_party_vulnerabilities__."vendor_name" as "3",
    __third_party_vulnerabilities_identifiers__.idx as "4"
  from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
  where (
    __third_party_vulnerabilities__."id" = __third_party_vulnerabilities_identifiers__."id0"
  )
) as __third_party_vulnerabilities_result__;