select __houses_result__.*
from (
  select
    ids.ordinality - 1 as idx,
    (ids.value->>0)::"int4" as "id0",
    (ids.value->>1)::"int4" as "id1"
  from json_array_elements($1::json) with ordinality as ids
) as __houses_identifiers__,
lateral (
  select
    __houses__."property_id"::text as "0",
    __houses__."street_id"::text as "1",
    __houses__."street_name" as "2",
    __houses__."property_name_or_number" as "3",
    __houses__."building_name" as "4",
    __houses_identifiers__.idx as "5"
  from "smart_comment_relations"."houses" as __houses__
  where
    (
      __houses__."street_id" = __houses_identifiers__."id0"
    ) and (
      __houses__."property_id" = __houses_identifiers__."id1"
    )
  order by __houses__."street_id" asc, __houses__."property_id" asc
) as __houses_result__;

select
  __houses__."building_name" as "0",
  __houses__."property_name_or_number" as "1",
  __houses__."street_name" as "2",
  __streets__."id"::text as "3",
  (select json_agg(_) from (
    select
      __buildings__."id"::text as "0",
      __buildings__."name" as "1"
    from "smart_comment_relations"."buildings" as __buildings__
    where (
      __streets__."name"::"text" = __buildings__."name"
    )
    order by __buildings__."id" asc
  ) _) as "4",
  __streets__."name" as "5",
  (select json_agg(_) from (
    select
      __buildings_2."name" as "0",
      __buildings_2."id"::text as "1"
    from "smart_comment_relations"."buildings" as __buildings_2
    where (
      __streets_2."name"::"text" = __buildings_2."name"
    )
    order by __buildings_2."id" asc
  ) _) as "6",
  __streets_2."name" as "7",
  __streets_2."id"::text as "8",
  __properties__."street_id"::text as "9",
  __properties__."name_or_number" as "10",
  __properties__."id"::text as "11",
  __street_property__."prop_id"::text as "12",
  (select json_agg(_) from (
    select
      __buildings_3."name" as "0",
      __buildings_3."id"::text as "1"
    from "smart_comment_relations"."buildings" as __buildings_3
    where (
      __streets_3."name"::"text" = __buildings_3."name"
    )
    order by __buildings_3."id" asc
  ) _) as "13",
  __streets_3."name" as "14",
  __streets_3."id"::text as "15",
  __street_property__."str_id"::text as "16",
  __street_property__."current_owner" as "17",
  __houses__."street_id"::text as "18",
  __buildings_4."id"::text as "19",
  __buildings_4."floors"::text as "20",
  __buildings_4."is_primary"::text as "21",
  __streets_4."id"::text as "22",
  (select json_agg(_) from (
    select
      __buildings_5."id"::text as "0",
      __buildings_5."name" as "1"
    from "smart_comment_relations"."buildings" as __buildings_5
    where (
      __streets_4."name"::"text" = __buildings_5."name"
    )
    order by __buildings_5."id" asc
  ) _) as "23",
  __streets_4."name" as "24",
  __buildings_4."name" as "25",
  __properties_2."id"::text as "26",
  __properties_2."name_or_number" as "27",
  __streets_5."id"::text as "28",
  (select json_agg(_) from (
    select
      __buildings_6."id"::text as "0",
      __buildings_6."name" as "1"
    from "smart_comment_relations"."buildings" as __buildings_6
    where (
      __streets_5."name"::"text" = __buildings_6."name"
    )
    order by __buildings_6."id" asc
  ) _) as "29",
  __streets_5."name" as "30",
  __properties_2."street_id"::text as "31",
  __houses__."building_id"::text as "32",
  (select json_agg(_) from (
    select
      __buildings_7."name" as "0",
      __buildings_7."id"::text as "1"
    from "smart_comment_relations"."buildings" as __buildings_7
    where (
      __streets_6."name"::"text" = __buildings_7."name"
    )
    order by __buildings_7."id" asc
  ) _) as "33",
  __streets_6."name" as "34",
  __streets_6."id"::text as "35",
  __properties_3."id"::text as "36",
  __properties_3."name_or_number" as "37",
  __properties_3."street_id"::text as "38",
  __houses__."property_id"::text as "39"
from "smart_comment_relations"."houses" as __houses__
left outer join "smart_comment_relations"."streets" as __streets__
on (__houses__."street_id"::"int4" = __streets__."id")
left outer join "smart_comment_relations"."street_property" as __street_property__
on (
  (
    __houses__."street_id"::"int4" = __street_property__."str_id"
  ) and (
    __houses__."property_id"::"int4" = __street_property__."prop_id"
  )
)
left outer join "smart_comment_relations"."properties" as __properties__
on (__street_property__."prop_id"::"int4" = __properties__."id")
left outer join "smart_comment_relations"."streets" as __streets_2
on (__properties__."street_id"::"int4" = __streets_2."id")
left outer join "smart_comment_relations"."streets" as __streets_3
on (__street_property__."str_id"::"int4" = __streets_3."id")
left outer join "smart_comment_relations"."buildings" as __buildings_4
on (__houses__."building_id"::"int4" = __buildings_4."id")
left outer join "smart_comment_relations"."streets" as __streets_4
on (__buildings_4."name"::"text" = __streets_4."name")
left outer join "smart_comment_relations"."properties" as __properties_2
on (__buildings_4."property_id"::"int4" = __properties_2."id")
left outer join "smart_comment_relations"."streets" as __streets_5
on (__properties_2."street_id"::"int4" = __streets_5."id")
left outer join "smart_comment_relations"."properties" as __properties_3
on (__houses__."property_id"::"int4" = __properties_3."id")
left outer join "smart_comment_relations"."streets" as __streets_6
on (__properties_3."street_id"::"int4" = __streets_6."id")
order by __houses__."street_id" asc, __houses__."property_id" asc;