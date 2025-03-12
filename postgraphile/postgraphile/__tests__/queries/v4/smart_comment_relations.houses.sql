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
  __houses__."building_id"::text as "5",
  __streets__."id"::text as "6",
  __streets__."name" as "7",
  __street_property__."str_id"::text as "8",
  __street_property__."prop_id"::text as "9",
  __street_property__."current_owner" as "10",
  __streets_2."id"::text as "11",
  __streets_2."name" as "12",
  __properties__."id"::text as "13",
  __properties__."street_id"::text as "14",
  __properties__."name_or_number" as "15",
  __streets_3."id"::text as "16",
  __streets_3."name" as "17",
  __properties_2."id"::text as "18",
  __properties_2."street_id"::text as "19",
  __properties_2."name_or_number" as "20",
  __streets_4."id"::text as "21",
  __streets_4."name" as "22",
  __buildings__."id"::text as "23",
  __buildings__."name" as "24",
  __buildings__."floors"::text as "25",
  __buildings__."is_primary"::text as "26",
  __streets_5."id"::text as "27",
  __streets_5."name" as "28",
  __properties_3."id"::text as "29",
  __properties_3."street_id"::text as "30",
  __properties_3."name_or_number" as "31",
  __streets_6."id"::text as "32",
  __streets_6."name" as "33"
from "smart_comment_relations"."houses" as __houses__
left outer join "smart_comment_relations"."streets" as __streets__
on (
/* WHERE becoming ON */ (
  __streets__."id" = __houses__."street_id"
))
left outer join "smart_comment_relations"."street_property" as __street_property__
on (
/* WHERE becoming ON */
  (
    __street_property__."str_id" = __houses__."street_id"
  ) and (
    __street_property__."prop_id" = __houses__."property_id"
  )
)
left outer join "smart_comment_relations"."streets" as __streets_2
on (
/* WHERE becoming ON */ (
  __streets_2."id" = __street_property__."str_id"
))
left outer join "smart_comment_relations"."properties" as __properties__
on (
/* WHERE becoming ON */ (
  __properties__."id" = __street_property__."prop_id"
))
left outer join "smart_comment_relations"."streets" as __streets_3
on (
/* WHERE becoming ON */ (
  __streets_3."id" = __properties__."street_id"
))
left outer join "smart_comment_relations"."properties" as __properties_2
on (
/* WHERE becoming ON */ (
  __properties_2."id" = __houses__."property_id"
))
left outer join "smart_comment_relations"."streets" as __streets_4
on (
/* WHERE becoming ON */ (
  __streets_4."id" = __properties_2."street_id"
))
left outer join "smart_comment_relations"."buildings" as __buildings__
on (
/* WHERE becoming ON */ (
  __buildings__."id" = __houses__."building_id"
))
left outer join "smart_comment_relations"."streets" as __streets_5
on (
/* WHERE becoming ON */ (
  __streets_5."name" = __buildings__."name"
))
left outer join "smart_comment_relations"."properties" as __properties_3
on (
/* WHERE becoming ON */ (
  __properties_3."id" = __buildings__."property_id"
))
left outer join "smart_comment_relations"."streets" as __streets_6
on (
/* WHERE becoming ON */ (
  __streets_6."id" = __properties_3."street_id"
))
order by __houses__."street_id" asc, __houses__."property_id" asc;

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