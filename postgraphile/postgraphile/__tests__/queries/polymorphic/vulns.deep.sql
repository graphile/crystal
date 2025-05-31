select
  __vulnerability__."0" as "0",
  __vulnerability__."1"::text as "1",
  __vulnerability__."2"::text as "2"
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
            __first_party_vulnerabilities__."cvss_score" desc,
            __first_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
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
        'ThirdPartyVulnerability' as "0",
        json_build_array((__third_party_vulnerabilities__."id")::text) as "1",
        __third_party_vulnerabilities__."cvss_score" as "2",
        row_number() over (
          order by
            __third_party_vulnerabilities__."cvss_score" desc,
            __third_party_vulnerabilities__."id" asc
        ) as "n"
      from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      order by
        __third_party_vulnerabilities__."cvss_score" desc,
        __third_party_vulnerabilities__."id" asc
      limit 3
    ) as __third_party_vulnerabilities__
  order by
    "2" desc,
    "0" asc,
    "n" asc
  limit 2
  offset 1
) __vulnerability__


select
  __first_party_vulnerabilities__."name" as "0",
  __first_party_vulnerabilities__."id"::text as "1"
from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
where (
  __first_party_vulnerabilities__."id" = $1::"int4"
);

select
  __third_party_vulnerabilities__."name" as "0",
  __third_party_vulnerabilities__."id"::text as "1"
from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
where (
  __third_party_vulnerabilities__."id" = $1::"int4"
);

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
      from "polymorphic"."aws_application_first_party_vulnerabilities" as __aws_application_first_party_vulnerabilities__
      inner join "polymorphic"."aws_applications" as __aws_applications__
      on (
        __aws_applications__."id" = __aws_application_first_party_vulnerabilities__."aws_application_id"
      )
      where __aws_application_first_party_vulnerabilities__."first_party_vulnerability_id" = $1::"int4"
      order by
        __aws_applications__."id" asc
      limit 5
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
      from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities__
      inner join "polymorphic"."gcp_applications" as __gcp_applications__
      on (
        __gcp_applications__."id" = __gcp_application_first_party_vulnerabilities__."gcp_application_id"
      )
      where __gcp_application_first_party_vulnerabilities__."first_party_vulnerability_id" = $2::"int4"
      order by
        __gcp_applications__."id" asc
      limit 5
    ) as __gcp_applications__
  order by
    "0" asc,
    "n" asc
  limit 2
  offset 3
) __applications__


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
      from "polymorphic"."aws_application_third_party_vulnerabilities" as __aws_application_third_party_vulnerabilities__
      inner join "polymorphic"."aws_applications" as __aws_applications__
      on (
        __aws_applications__."id" = __aws_application_third_party_vulnerabilities__."aws_application_id"
      )
      where __aws_application_third_party_vulnerabilities__."third_party_vulnerability_id" = $1::"int4"
      order by
        __aws_applications__."id" asc
      limit 5
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
      from "polymorphic"."gcp_application_third_party_vulnerabilities" as __gcp_application_third_party_vulnerabilities__
      inner join "polymorphic"."gcp_applications" as __gcp_applications__
      on (
        __gcp_applications__."id" = __gcp_application_third_party_vulnerabilities__."gcp_application_id"
      )
      where __gcp_application_third_party_vulnerabilities__."third_party_vulnerability_id" = $2::"int4"
      order by
        __gcp_applications__."id" asc
      limit 5
    ) as __gcp_applications__
  order by
    "0" asc,
    "n" asc
  limit 2
  offset 3
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
        order by
          __first_party_vulnerabilities__."id" asc
        limit 2
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
        order by
          __third_party_vulnerabilities__."id" asc
        limit 2
      ) as __third_party_vulnerabilities__
    order by
      "0" asc,
      "n" asc
    limit 2
  ) __vulnerabilities__
) as __union_result__;

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
      order by
        __first_party_vulnerabilities__."id" asc
      limit 2
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
      where __gcp_application_third_party_vulnerabilities__."gcp_application_id" = $2::"int4"
      order by
        __third_party_vulnerabilities__."id" asc
      limit 2
    ) as __third_party_vulnerabilities__
  order by
    "0" asc,
    "n" asc
  limit 2
) __vulnerabilities__


select __first_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __first_party_vulnerabilities_identifiers__,
lateral (
  select
    __first_party_vulnerabilities__."name" as "0",
    __first_party_vulnerabilities__."id"::text as "1",
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
    __third_party_vulnerabilities__."id"::text as "1",
    __third_party_vulnerabilities_identifiers__.idx as "2"
  from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
  where (
    __third_party_vulnerabilities__."id" = __third_party_vulnerabilities_identifiers__."id0"
  )
) as __third_party_vulnerabilities_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
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
        from "polymorphic"."aws_application_first_party_vulnerabilities" as __aws_application_first_party_vulnerabilities__
        inner join "polymorphic"."aws_applications" as __aws_applications__
        on (
          __aws_applications__."id" = __aws_application_first_party_vulnerabilities__."aws_application_id"
        )
        where __aws_application_first_party_vulnerabilities__."first_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __aws_applications__."id" asc
        limit 6
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
        from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities__
        inner join "polymorphic"."gcp_applications" as __gcp_applications__
        on (
          __gcp_applications__."id" = __gcp_application_first_party_vulnerabilities__."gcp_application_id"
        )
        where __gcp_application_first_party_vulnerabilities__."first_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __gcp_applications__."id" asc
        limit 6
      ) as __gcp_applications__
    order by
      "0" asc,
      "n" asc
    limit 2
    offset 4
  ) __applications__
) as __union_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
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
        from "polymorphic"."aws_application_third_party_vulnerabilities" as __aws_application_third_party_vulnerabilities__
        inner join "polymorphic"."aws_applications" as __aws_applications__
        on (
          __aws_applications__."id" = __aws_application_third_party_vulnerabilities__."aws_application_id"
        )
        where __aws_application_third_party_vulnerabilities__."third_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __aws_applications__."id" asc
        limit 6
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
        from "polymorphic"."gcp_application_third_party_vulnerabilities" as __gcp_application_third_party_vulnerabilities__
        inner join "polymorphic"."gcp_applications" as __gcp_applications__
        on (
          __gcp_applications__."id" = __gcp_application_third_party_vulnerabilities__."gcp_application_id"
        )
        where __gcp_application_third_party_vulnerabilities__."third_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __gcp_applications__."id" asc
        limit 6
      ) as __gcp_applications__
    order by
      "0" asc,
      "n" asc
    limit 2
    offset 4
  ) __applications__
) as __union_result__;

select __gcp_applications_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __gcp_applications_identifiers__,
lateral (
  select
    __gcp_applications__."name" as "0",
    __gcp_applications__."id"::text as "1",
    __gcp_applications_identifiers__.idx as "2"
  from "polymorphic"."gcp_applications" as __gcp_applications__
  where (
    __gcp_applications__."id" = __gcp_applications_identifiers__."id0"
  )
) as __gcp_applications_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
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
        from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities__
        inner join "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
        on (
          __first_party_vulnerabilities__."id" = __gcp_application_first_party_vulnerabilities__."first_party_vulnerability_id"
        )
        where __gcp_application_first_party_vulnerabilities__."gcp_application_id" = __union_identifiers__."id0"
        order by
          __first_party_vulnerabilities__."id" asc
        limit 3
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
        where __gcp_application_third_party_vulnerabilities__."gcp_application_id" = __union_identifiers__."id0"
        order by
          __third_party_vulnerabilities__."id" asc
        limit 3
      ) as __third_party_vulnerabilities__
    order by
      "0" asc,
      "n" asc
    limit 3
  ) __vulnerabilities__
) as __union_result__;

select __first_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __first_party_vulnerabilities_identifiers__,
lateral (
  select
    __first_party_vulnerabilities__."name" as "0",
    __first_party_vulnerabilities_identifiers__.idx as "1"
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
    __third_party_vulnerabilities_identifiers__.idx as "1"
  from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
  where (
    __third_party_vulnerabilities__."id" = __third_party_vulnerabilities_identifiers__."id0"
  )
) as __third_party_vulnerabilities_result__;