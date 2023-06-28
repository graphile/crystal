select
  __log_entries__."id"::text as "0",
  __log_entries__."person_id"::text as "1",
  __log_entries__."organization_id"::text as "2"
from "polymorphic"."log_entries" as __log_entries__
order by __log_entries__."id" asc;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
lateral (
  select
    __author__."0" as "0",
    __author__."1"::text as "1",
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
  ) __author__
) as __union_result__;

select __organizations_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __organizations_identifiers__,
lateral (
  select
    __organizations__."name" as "0",
    __organizations_identifiers__.idx as "1"
  from "polymorphic"."organizations" as __organizations__
  where (
    __organizations__."organization_id" = __organizations_identifiers__."id0"
  )
) as __organizations_result__;

select __people_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __people_identifiers__,
lateral (
  select
    __people__."username" as "0",
    __people_identifiers__.idx as "1"
  from "polymorphic"."people" as __people__
  where (
    __people__."person_id" = __people_identifiers__."id0"
  )
) as __people_result__;