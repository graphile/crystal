select
  __houses__."street_id"::text as "0",
  __houses__."property_id"::text as "1",
  __streets__."id"::text as "2",
  __streets__."name" as "3",
  __street_property__."current_owner" as "4",
  __street_property__."str_id"::text as "5",
  __streets_2."id"::text as "6",
  __streets_2."name" as "7",
  __houses_2."street_id"::text as "8",
  __houses_2."property_id"::text as "9",
  __street_property_2."current_owner" as "10",
  __street_property_2."str_id"::text as "11",
  __streets_3."id"::text as "12",
  __streets_3."name" as "13",
  __properties__."id"::text as "14",
  __properties__."name_or_number" as "15",
  __streets_4."id"::text as "16",
  __streets_4."name" as "17",
  __properties_2."id"::text as "18",
  __properties_2."name_or_number" as "19",
  __streets_5."id"::text as "20",
  __streets_5."name" as "21",
  __buildings__."id"::text as "22",
  __buildings__."name" as "23",
  __streets_6."id"::text as "24",
  __streets_6."name" as "25",
  __properties_3."id"::text as "26",
  __properties_3."name_or_number" as "27",
  __streets_7."id"::text as "28",
  __streets_7."name" as "29",
  __properties_4."id"::text as "30",
  __properties_4."name_or_number" as "31",
  __streets_8."id"::text as "32",
  __streets_8."name" as "33",
  __properties_5."id"::text as "34",
  __properties_5."name_or_number" as "35",
  __streets_9."id"::text as "36",
  __streets_9."name" as "37",
  __buildings_2."id"::text as "38",
  __buildings_2."name" as "39",
  __streets_10."id"::text as "40",
  __streets_10."name" as "41",
  __properties_6."id"::text as "42",
  __properties_6."name_or_number" as "43",
  __streets_11."id"::text as "44",
  __streets_11."name" as "45"
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
left outer join "smart_comment_relations"."houses" as __houses_2
on (
/* WHERE becoming ON */
  (
    __houses_2."street_id" = __street_property__."str_id"
  ) and (
    __houses_2."property_id" = __street_property__."prop_id"
  )
)
left outer join "smart_comment_relations"."street_property" as __street_property_2
on (
/* WHERE becoming ON */
  (
    __street_property_2."str_id" = __houses_2."street_id"
  ) and (
    __street_property_2."prop_id" = __houses_2."property_id"
  )
)
left outer join "smart_comment_relations"."streets" as __streets_3
on (
/* WHERE becoming ON */ (
  __streets_3."id" = __street_property_2."str_id"
))
left outer join "smart_comment_relations"."properties" as __properties__
on (
/* WHERE becoming ON */ (
  __properties__."id" = __street_property_2."prop_id"
))
left outer join "smart_comment_relations"."streets" as __streets_4
on (
/* WHERE becoming ON */ (
  __streets_4."id" = __properties__."street_id"
))
left outer join "smart_comment_relations"."properties" as __properties_2
on (
/* WHERE becoming ON */ (
  __properties_2."id" = __houses_2."property_id"
))
left outer join "smart_comment_relations"."streets" as __streets_5
on (
/* WHERE becoming ON */ (
  __streets_5."id" = __properties_2."street_id"
))
left outer join "smart_comment_relations"."buildings" as __buildings__
on (
/* WHERE becoming ON */ (
  __buildings__."id" = __houses_2."building_id"
))
left outer join "smart_comment_relations"."streets" as __streets_6
on (
/* WHERE becoming ON */ (
  __streets_6."name" = __buildings__."name"
))
left outer join "smart_comment_relations"."properties" as __properties_3
on (
/* WHERE becoming ON */ (
  __properties_3."id" = __buildings__."property_id"
))
left outer join "smart_comment_relations"."streets" as __streets_7
on (
/* WHERE becoming ON */ (
  __streets_7."id" = __properties_3."street_id"
))
left outer join "smart_comment_relations"."properties" as __properties_4
on (
/* WHERE becoming ON */ (
  __properties_4."id" = __street_property__."prop_id"
))
left outer join "smart_comment_relations"."streets" as __streets_8
on (
/* WHERE becoming ON */ (
  __streets_8."id" = __properties_4."street_id"
))
left outer join "smart_comment_relations"."properties" as __properties_5
on (
/* WHERE becoming ON */ (
  __properties_5."id" = __houses__."property_id"
))
left outer join "smart_comment_relations"."streets" as __streets_9
on (
/* WHERE becoming ON */ (
  __streets_9."id" = __properties_5."street_id"
))
left outer join "smart_comment_relations"."buildings" as __buildings_2
on (
/* WHERE becoming ON */ (
  __buildings_2."id" = __houses__."building_id"
))
left outer join "smart_comment_relations"."streets" as __streets_10
on (
/* WHERE becoming ON */ (
  __streets_10."name" = __buildings_2."name"
))
left outer join "smart_comment_relations"."properties" as __properties_6
on (
/* WHERE becoming ON */ (
  __properties_6."id" = __buildings_2."property_id"
))
left outer join "smart_comment_relations"."streets" as __streets_11
on (
/* WHERE becoming ON */ (
  __streets_11."id" = __properties_6."street_id"
))
order by __houses__."street_id" asc, __houses__."property_id" asc
limit 1;