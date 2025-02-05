select
  __houses__."building_name" as "0",
  __houses__."property_name_or_number" as "1",
  __houses__."street_name" as "2",
  __houses__."street_id"::text as "3",
  __houses__."property_id"::text as "4"
from "smart_comment_relations"."houses" as __houses__
where
  (
    __houses__."street_id" = $1::"int4"
  ) and (
    __houses__."property_id" = $2::"int4"
  );

select
  __houses__."street_id"::text as "0",
  __houses__."property_id"::text as "1",
  __houses__."building_name" as "2",
  __houses__."property_name_or_number" as "3",
  __houses__."street_name" as "4",
  __houses__."building_id"::text as "5"
from "smart_comment_relations"."houses" as __houses__
order by __houses__."street_id" asc, __houses__."property_id" asc;

select __streets_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __streets_identifiers__,
lateral (
  select
    __streets__."id"::text as "0",
    __streets__."name" as "1",
    __streets_identifiers__.idx as "2"
  from "smart_comment_relations"."streets" as __streets__
  where (
    __streets__."id" = __streets_identifiers__."id0"
  )
) as __streets_result__;

select __buildings_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __buildings_identifiers__,
lateral (
  select
    __buildings__."id"::text as "0",
    __buildings__."name" as "1",
    __buildings__."floors"::text as "2",
    __buildings__."is_primary"::text as "3",
    __buildings__."property_id"::text as "4",
    __buildings_identifiers__.idx as "5"
  from "smart_comment_relations"."buildings" as __buildings__
  where (
    __buildings__."id" = __buildings_identifiers__."id0"
  )
) as __buildings_result__;

select __properties_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __properties_identifiers__,
lateral (
  select
    __properties__."id"::text as "0",
    __properties__."street_id"::text as "1",
    __properties__."name_or_number" as "2",
    __properties_identifiers__.idx as "3"
  from "smart_comment_relations"."properties" as __properties__
  where (
    __properties__."id" = __properties_identifiers__."id0"
  )
) as __properties_result__;

select __street_property_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0", (ids.value->>1)::"int4" as "id1" from json_array_elements($1::json) with ordinality as ids) as __street_property_identifiers__,
lateral (
  select
    __street_property__."str_id"::text as "0",
    __street_property__."prop_id"::text as "1",
    __street_property__."current_owner" as "2",
    __street_property_identifiers__.idx as "3"
  from "smart_comment_relations"."street_property" as __street_property__
  where
    (
      __street_property__."str_id" = __street_property_identifiers__."id0"
    ) and (
      __street_property__."prop_id" = __street_property_identifiers__."id1"
    )
) as __street_property_result__;

select __buildings_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"text" as "id0" from json_array_elements($1::json) with ordinality as ids) as __buildings_identifiers__,
lateral (
  select
    __buildings__."id"::text as "0",
    __buildings__."name" as "1",
    __buildings_identifiers__.idx as "2"
  from "smart_comment_relations"."buildings" as __buildings__
  where (
    __buildings__."name" = __buildings_identifiers__."id0"
  )
  order by __buildings__."id" asc
) as __buildings_result__;

select __streets_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"text" as "id0" from json_array_elements($1::json) with ordinality as ids) as __streets_identifiers__,
lateral (
  select
    __streets__."id"::text as "0",
    __streets__."name" as "1",
    __streets_identifiers__.idx as "2"
  from "smart_comment_relations"."streets" as __streets__
  where (
    __streets__."name" = __streets_identifiers__."id0"
  )
) as __streets_result__;