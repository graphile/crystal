select
  __notes__."body" as "0",
  __notes__."person_id"::text as "1"
from "ref_to_union"."notes" as __notes__
order by __notes__."id" asc;

select __union_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __union_identifiers__,
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
          json_build_array((__people__."id")::text) as "1",
          row_number() over (
            order by
              __people__."id" asc
          ) as "n"
        from "ref_to_union"."people" as __people__
        where __people__."id" = __union_identifiers__."id0"
        order by
          __people__."id" asc
      ) as __people__
    order by
      "0" asc,
      "n" asc
  ) __owner__
) as __union_result__;

select __people_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __people_identifiers__,
lateral (
  select
    __people__."username" as "0",
    __people_identifiers__.idx as "1"
  from "ref_to_union"."people" as __people__
  where (
    __people__."id" = __people_identifiers__."id0"
  )
) as __people_result__;