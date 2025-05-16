select
  __vulnerability__."0" as "0",
  __vulnerability__."1"::text as "1"
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
      from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
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
      from "polymorphic"."third_party_vulnerabilities" as __third_party_vulnerabilities__
      order by
        __third_party_vulnerabilities__."id" asc
      limit 2
    ) as __third_party_vulnerabilities__
  order by
    "0" asc,
    "n" asc
  limit 2
) __vulnerability__


select __first_party_vulnerabilities_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __first_party_vulnerabilities_identifiers__,
lateral (
  select
    __first_party_vulnerabilities__."id"::text as "0",
    __first_party_vulnerabilities__."name" as "1",
    __first_party_vulnerabilities_identifiers__.idx as "2"
  from "polymorphic"."first_party_vulnerabilities" as __first_party_vulnerabilities__
  where (
    __first_party_vulnerabilities__."id" = __first_party_vulnerabilities_identifiers__."id0"
  )
) as __first_party_vulnerabilities_result__;

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
      ) as __gcp_applications__
    order by
      "0" asc,
      "n" asc
  ) __applications__
) as __union_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    __owners__."0" as "0",
    __owners__."1"::text as "1",
    __union_identifiers__.idx as "2"
  from (
      select
        __people__."0",
        __people__."1",
        "n"
      from (
        select
          'Person' as "0",
          json_build_array((__people__."person_id")::text) as "1",
          row_number() over (
            order by
              __people__."person_id" asc
          ) as "n"
        from "polymorphic"."aws_application_first_party_vulnerabilities" as __aws_application_first_party_vulnerabilities__
        inner join "polymorphic"."aws_applications" as __aws_applications__
        on (
          __aws_applications__."id" = __aws_application_first_party_vulnerabilities__."aws_application_id"
        )
        inner join "polymorphic"."people" as __people__
        on (
          __people__."person_id" = __aws_applications__."person_id"
        )
        where __aws_application_first_party_vulnerabilities__."first_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __people__."person_id" asc
      ) as __people__
    union all
      select
        __organizations__."0",
        __organizations__."1",
        "n"
      from (
        select
          'Organization' as "0",
          json_build_array((__organizations__."organization_id")::text) as "1",
          row_number() over (
            order by
              __organizations__."organization_id" asc
          ) as "n"
        from "polymorphic"."aws_application_first_party_vulnerabilities" as __aws_application_first_party_vulnerabilities_2
        inner join "polymorphic"."aws_applications" as __aws_applications_2
        on (
          __aws_applications_2."id" = __aws_application_first_party_vulnerabilities_2."aws_application_id"
        )
        inner join "polymorphic"."organizations" as __organizations__
        on (
          __organizations__."organization_id" = __aws_applications_2."organization_id"
        )
        where __aws_application_first_party_vulnerabilities_2."first_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __organizations__."organization_id" asc
      ) as __organizations__
    union all
      select
        __people_2."0",
        __people_2."1",
        "n"
      from (
        select
          'Person' as "0",
          json_build_array((__people_2."person_id")::text) as "1",
          row_number() over (
            order by
              __people_2."person_id" asc
          ) as "n"
        from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities__
        inner join "polymorphic"."gcp_applications" as __gcp_applications__
        on (
          __gcp_applications__."id" = __gcp_application_first_party_vulnerabilities__."gcp_application_id"
        )
        inner join "polymorphic"."people" as __people_2
        on (
          __people_2."person_id" = __gcp_applications__."person_id"
        )
        where __gcp_application_first_party_vulnerabilities__."first_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __people_2."person_id" asc
      ) as __people_2
    union all
      select
        __organizations_2."0",
        __organizations_2."1",
        "n"
      from (
        select
          'Organization' as "0",
          json_build_array((__organizations_2."organization_id")::text) as "1",
          row_number() over (
            order by
              __organizations_2."organization_id" asc
          ) as "n"
        from "polymorphic"."gcp_application_first_party_vulnerabilities" as __gcp_application_first_party_vulnerabilities_2
        inner join "polymorphic"."gcp_applications" as __gcp_applications_2
        on (
          __gcp_applications_2."id" = __gcp_application_first_party_vulnerabilities_2."gcp_application_id"
        )
        inner join "polymorphic"."organizations" as __organizations_2
        on (
          __organizations_2."organization_id" = __gcp_applications_2."organization_id"
        )
        where __gcp_application_first_party_vulnerabilities_2."first_party_vulnerability_id" = __union_identifiers__."id0"
        order by
          __organizations_2."organization_id" asc
      ) as __organizations_2
    order by
      "0" asc,
      "n" asc
  ) __owners__
) as __union_result__;

select __aws_applications_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __aws_applications_identifiers__,
lateral (
  select
    __aws_applications__."id"::text as "0",
    __aws_applications__."name" as "1",
    __aws_applications__."person_id"::text as "2",
    __aws_applications__."organization_id"::text as "3",
    __aws_applications_identifiers__.idx as "4"
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
    __gcp_applications__."person_id"::text as "2",
    __gcp_applications__."organization_id"::text as "3",
    __gcp_applications_identifiers__.idx as "4"
  from "polymorphic"."gcp_applications" as __gcp_applications__
  where (
    __gcp_applications__."id" = __gcp_applications_identifiers__."id0"
  )
) as __gcp_applications_result__;

select __organizations_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __organizations_identifiers__,
lateral (
  select
    __organizations__."organization_id"::text as "0",
    __organizations__."name" as "1",
    __organizations_identifiers__.idx as "2"
  from "polymorphic"."organizations" as __organizations__
  where (
    __organizations__."organization_id" = __organizations_identifiers__."id0"
  )
) as __organizations_result__;

select __people_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __people_identifiers__,
lateral (
  select
    __people__."person_id"::text as "0",
    __people__."username" as "1",
    __people_identifiers__.idx as "2"
  from "polymorphic"."people" as __people__
  where (
    __people__."person_id" = __people_identifiers__."id0"
  )
) as __people_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    __owner__."0" as "0",
    __owner__."1"::text as "1",
    __union_identifiers__.idx as "2"
  from (
      select
        __people__."0",
        __people__."1",
        "n"
      from (
        select
          'Person' as "0",
          json_build_array((__people__."person_id")::text) as "1",
          row_number() over (
            order by
              __people__."person_id" asc
          ) as "n"
        from "polymorphic"."people" as __people__
        where __people__."person_id" = __union_identifiers__."id0"
        order by
          __people__."person_id" asc
      ) as __people__
    union all
      select
        __organizations__."0",
        __organizations__."1",
        "n"
      from (
        select
          'Organization' as "0",
          json_build_array((__organizations__."organization_id")::text) as "1",
          row_number() over (
            order by
              __organizations__."organization_id" asc
          ) as "n"
        from "polymorphic"."organizations" as __organizations__
        where __organizations__."organization_id" = __union_identifiers__."id1"
        order by
          __organizations__."organization_id" asc
      ) as __organizations__
    order by
      "0" asc,
      "n" asc
  ) __owner__
) as __union_result__;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    __owner__."0" as "0",
    __owner__."1"::text as "1",
    __union_identifiers__.idx as "2"
  from (
      select
        __people__."0",
        __people__."1",
        "n"
      from (
        select
          'Person' as "0",
          json_build_array((__people__."person_id")::text) as "1",
          row_number() over (
            order by
              __people__."person_id" asc
          ) as "n"
        from "polymorphic"."people" as __people__
        where __people__."person_id" = __union_identifiers__."id0"
        order by
          __people__."person_id" asc
      ) as __people__
    union all
      select
        __organizations__."0",
        __organizations__."1",
        "n"
      from (
        select
          'Organization' as "0",
          json_build_array((__organizations__."organization_id")::text) as "1",
          row_number() over (
            order by
              __organizations__."organization_id" asc
          ) as "n"
        from "polymorphic"."organizations" as __organizations__
        where __organizations__."organization_id" = __union_identifiers__."id1"
        order by
          __organizations__."organization_id" asc
      ) as __organizations__
    order by
      "0" asc,
      "n" asc
  ) __owner__
) as __union_result__;