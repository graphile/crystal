select
  __people__."username" as "0",
  __people__."person_id"::text as "1"
from "polymorphic"."people" as __people__
order by __people__."person_id" asc
limit 1;

select
  __applications__."0" as "0",
  __applications__."1"::text as "1"
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
      where __aws_applications__."person_id" = $1::"int4"
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
      where __gcp_applications__."person_id" = $2::"int4"
      order by
        __gcp_applications__."id" asc
    ) as __gcp_applications__
  order by
    "0" asc,
    "n" asc
) __applications__


select __aws_applications_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __aws_applications_identifiers__,
lateral (
  select
    __aws_applications__."name" as "0",
    __aws_applications__."id"::text as "1",
    __aws_applications_identifiers__.idx as "2"
  from "polymorphic"."aws_applications" as __aws_applications__
  where (
    __aws_applications__."id" = __aws_applications_identifiers__."id0"
  )
) as __aws_applications_result__;

select
  __gcp_applications__."name" as "0",
  __gcp_applications__."id"::text as "1"
from "polymorphic"."gcp_applications" as __gcp_applications__
where (
  __gcp_applications__."id" = $1::"int4"
);

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    __vulnerabilities__."0" as "0",
    __vulnerabilities__."1"::text as "1",
    __vulnerabilities__."2"::text as "2",
    __vulnerabilities__."3" as "3",
    __union_identifiers__.idx as "4"
  from (
      select
        __first_party_vulnerabilities__."0",
        __first_party_vulnerabilities__."1",
        __first_party_vulnerabilities__."2",
        __first_party_vulnerabilities__."3",
        "n"
      from (
        select
          'FirstPartyVulnerability' as "0",
          json_build_array((__first_party_vulnerabilities__."id")::text) as "1",
          __first_party_vulnerabilities__."cvss_score" as "2",
          __first_party_vulnerabilities__."name" as "3",
          row_number() over (
            order by
              __first_party_vulnerabilities__."cvss_score" desc,
              __first_party_vulnerabilities__."name" asc,
              __first_party_vulnerabilities__."id" asc
          ) as "n"
        from "polymorphic"."aws_application_first_party_vulnerabilities" as __aws_application_first_party_vulnerabilities__
        inner join "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
        on (
          __first_party_vulnerabilities__."id" = __aws_application_first_party_vulnerabilities__."first_party_vulnerability_id"
        )
        where __aws_application_first_party_vulnerabilities__."aws_application_id" = __union_identifiers__."id0"
        order by
          __first_party_vulnerabilities__."cvss_score" desc,
          __first_party_vulnerabilities__."name" asc,
          __first_party_vulnerabilities__."id" asc
      ) as __first_party_vulnerabilities__
    union all
      select
        __third_party_vulnerabilities__."0",
        __third_party_vulnerabilities__."1",
        __third_party_vulnerabilities__."2",
        __third_party_vulnerabilities__."3",
        "n"
      from (
        select
          'ThirdPartyVulnerability' as "0",
          json_build_array((__third_party_vulnerabilities__."id")::text) as "1",
          __third_party_vulnerabilities__."cvss_score" as "2",
          __third_party_vulnerabilities__."name" as "3",
          row_number() over (
            order by
              __third_party_vulnerabilities__."cvss_score" desc,
              __third_party_vulnerabilities__."name" asc,
              __third_party_vulnerabilities__."id" asc
          ) as "n"
        from "polymorphic"."aws_application_third_party_vulnerabilities" as __aws_application_third_party_vulnerabilities__
        inner join "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
        on (
          __third_party_vulnerabilities__."id" = __aws_application_third_party_vulnerabilities__."third_party_vulnerability_id"
        )
        where __aws_application_third_party_vulnerabilities__."aws_application_id" = __union_identifiers__."id0"
        order by
          __third_party_vulnerabilities__."cvss_score" desc,
          __third_party_vulnerabilities__."name" asc,
          __third_party_vulnerabilities__."id" asc
      ) as __third_party_vulnerabilities__
    order by
      "2" desc,
      "3" asc,
      "0" asc,
      "n" asc
  ) __vulnerabilities__
) as __union_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($3::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    __vulnerabilities__."0" as "0",
    __vulnerabilities__."1"::text as "1",
    __union_identifiers__.idx as "2"
  from (
      select
        __first_party_vulnerabilities__."0",
        __first_party_vulnerabilities__."1",
        "n"
      from (
        select
          'FirstPartyVulnerability' as "0",
          json_build_array((__first_party_vulnerabilities__."id")::text) as "1",
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
        and __first_party_vulnerabilities__."name" = $1::"text"
        order by
          __first_party_vulnerabilities__."id" asc
      ) as __first_party_vulnerabilities__
    union all
      select
        __third_party_vulnerabilities__."0",
        __third_party_vulnerabilities__."1",
        "n"
      from (
        select
          'ThirdPartyVulnerability' as "0",
          json_build_array((__third_party_vulnerabilities__."id")::text) as "1",
          row_number() over (
            order by
              __third_party_vulnerabilities__."id" asc
          ) as "n"
        from "polymorphic"."aws_application_third_party_vulnerabilities" as __aws_application_third_party_vulnerabilities__
        inner join "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
        on (
          __third_party_vulnerabilities__."id" = __aws_application_third_party_vulnerabilities__."third_party_vulnerability_id"
        )
        where __aws_application_third_party_vulnerabilities__."aws_application_id" = __union_identifiers__."id0"
        and __third_party_vulnerabilities__."name" = $2::"text"
        order by
          __third_party_vulnerabilities__."id" asc
      ) as __third_party_vulnerabilities__
    order by
      "0" asc,
      "n" asc
  ) __vulnerabilities__
) as __union_result__;

select
  __vulnerabilities__."0" as "0",
  __vulnerabilities__."1"::text as "1",
  __vulnerabilities__."2"::text as "2",
  __vulnerabilities__."3" as "3"
from (
    select
      __first_party_vulnerabilities__."0",
      __first_party_vulnerabilities__."1",
      __first_party_vulnerabilities__."2",
      __first_party_vulnerabilities__."3",
      "n"
    from (
      select
        'FirstPartyVulnerability' as "0",
        json_build_array((__first_party_vulnerabilities__."id")::text) as "1",
        __first_party_vulnerabilities__."cvss_score" as "2",
        __first_party_vulnerabilities__."name" as "3",
        row_number() over (
          order by
            __first_party_vulnerabilities__."cvss_score" desc,
            __first_party_vulnerabilities__."name" asc,
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities__
      inner join "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
      on (
        __first_party_vulnerabilities__."id" = __gcp_application_first_party_vulnerabilities__."first_party_vulnerability_id"
      )
      where __gcp_application_first_party_vulnerabilities__."gcp_application_id" = $1::"int4"
      order by
        __first_party_vulnerabilities__."cvss_score" desc,
        __first_party_vulnerabilities__."name" asc,
        __first_party_vulnerabilities__."id" asc
    ) as __first_party_vulnerabilities__
  union all
    select
      __third_party_vulnerabilities__."0",
      __third_party_vulnerabilities__."1",
      __third_party_vulnerabilities__."2",
      __third_party_vulnerabilities__."3",
      "n"
    from (
      select
        'ThirdPartyVulnerability' as "0",
        json_build_array((__third_party_vulnerabilities__."id")::text) as "1",
        __third_party_vulnerabilities__."cvss_score" as "2",
        __third_party_vulnerabilities__."name" as "3",
        row_number() over (
          order by
            __third_party_vulnerabilities__."cvss_score" desc,
            __third_party_vulnerabilities__."name" asc,
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."gcp_application_third_party_vulnerabilities" as __gcp_application_third_party_vulnerabilities__
      inner join "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      on (
        __third_party_vulnerabilities__."id" = __gcp_application_third_party_vulnerabilities__."third_party_vulnerability_id"
      )
      where __gcp_application_third_party_vulnerabilities__."gcp_application_id" = $2::"int4"
      order by
        __third_party_vulnerabilities__."cvss_score" desc,
        __third_party_vulnerabilities__."name" asc,
        __third_party_vulnerabilities__."id" asc
    ) as __third_party_vulnerabilities__
  order by
    "2" desc,
    "3" asc,
    "0" asc,
    "n" asc
) __vulnerabilities__


select
  __vulnerabilities__."0" as "0",
  __vulnerabilities__."1"::text as "1"
from (
    select
      __first_party_vulnerabilities__."0",
      __first_party_vulnerabilities__."1",
      "n"
    from (
      select
        'FirstPartyVulnerability' as "0",
        json_build_array((__first_party_vulnerabilities__."id")::text) as "1",
        row_number() over (
          order by
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities__
      inner join "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
      on (
        __first_party_vulnerabilities__."id" = __gcp_application_first_party_vulnerabilities__."first_party_vulnerability_id"
      )
      where __gcp_application_first_party_vulnerabilities__."gcp_application_id" = $1::"int4"
      and __first_party_vulnerabilities__."name" = $2::"text"
      order by
        __first_party_vulnerabilities__."id" asc
    ) as __first_party_vulnerabilities__
  union all
    select
      __third_party_vulnerabilities__."0",
      __third_party_vulnerabilities__."1",
      "n"
    from (
      select
        'ThirdPartyVulnerability' as "0",
        json_build_array((__third_party_vulnerabilities__."id")::text) as "1",
        row_number() over (
          order by
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."gcp_application_third_party_vulnerabilities" as __gcp_application_third_party_vulnerabilities__
      inner join "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      on (
        __third_party_vulnerabilities__."id" = __gcp_application_third_party_vulnerabilities__."third_party_vulnerability_id"
      )
      where __gcp_application_third_party_vulnerabilities__."gcp_application_id" = $3::"int4"
      and __third_party_vulnerabilities__."name" = $4::"text"
      order by
        __third_party_vulnerabilities__."id" asc
    ) as __third_party_vulnerabilities__
  order by
    "0" asc,
    "n" asc
) __vulnerabilities__


select __first_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __first_party_vulnerabilities_identifiers__,
lateral (
  select
    __first_party_vulnerabilities__."name" as "0",
    __first_party_vulnerabilities__."cvss_score"::text as "1",
    __first_party_vulnerabilities_identifiers__.idx as "2"
  from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
  where (
    __first_party_vulnerabilities__."id" = __first_party_vulnerabilities_identifiers__."id0"
  )
) as __first_party_vulnerabilities_result__;

select __third_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __third_party_vulnerabilities_identifiers__,
lateral (
  select
    __third_party_vulnerabilities__."name" as "0",
    __third_party_vulnerabilities__."cvss_score"::text as "1",
    __third_party_vulnerabilities_identifiers__.idx as "2"
  from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
  where (
    __third_party_vulnerabilities__."id" = __third_party_vulnerabilities_identifiers__."id0"
  )
) as __third_party_vulnerabilities_result__;

select
  __third_party_vulnerabilities__."name" as "0"
from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
where (
  __third_party_vulnerabilities__."id" = $1::"int4"
);