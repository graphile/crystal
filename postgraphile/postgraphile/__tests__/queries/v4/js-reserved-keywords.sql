select
  __building__."id"::text as "0",
  __building__."constructor" as "1",
  __machine__."constructor" as "2",
  __machine__."input" as "3",
  __machine__."id"::text as "4"
from "js_reserved"."machine" as __machine__
left outer join "js_reserved"."building" as __building__
on (__machine__."constructor"::"text" = __building__."constructor")
where (
  __machine__."id" = $1::"int4"
);

select
  (select json_agg(s) from (
    select
      __machine__."id"::text as "0",
      __machine__."constructor" as "1",
      __machine__."input" as "2"
    from "js_reserved"."machine" as __machine__
    where (
      __building__."constructor"::"text" = __machine__."constructor"
    )
    order by __machine__."id" asc
  ) s) as "0",
  __building__."name" as "1",
  __building__."id"::text as "2"
from "js_reserved"."building" as __building__
where (
  __building__."id" = $1::"int4"
);

select
  __relational_items__."id"::text as "0",
  __relational_items__."constructor" as "1",
  __relational_items__."type"::text as "2"
from "js_reserved"."relational_items" as __relational_items__
order by __relational_items__."id" asc;

select __relational_topics_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_topics_identifiers__,
lateral (
  select
    __relational_topics__."title" as "0",
    __relational_topics_identifiers__.idx as "1"
  from "js_reserved"."relational_topics" as __relational_topics__
  where (
    __relational_topics__."id" = __relational_topics_identifiers__."id0"
  )
) as __relational_topics_result__;

select __relational_status_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __relational_status_identifiers__,
lateral (
  select
    __relational_status__."note" as "0",
    __relational_status__."id"::text as "1",
    __relational_status_identifiers__.idx as "2"
  from "js_reserved"."relational_status" as __relational_status__
  where (
    __relational_status__."id" = __relational_status_identifiers__."id0"
  )
) as __relational_status_result__;