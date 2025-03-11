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
  array(
    select array[
      __buildings__."id"::text,
      __buildings__."name"
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings__
    where (
      __buildings__."name" = __streets__."name"
    )
    order by __buildings__."id" asc
  )::text as "8",
  __street_property__."str_id"::text as "9",
  __street_property__."prop_id"::text as "10",
  __street_property__."current_owner" as "11",
  __streets_2."id"::text as "12",
  __streets_2."name" as "13",
  array(
    select array[
      __buildings_2."id"::text,
      __buildings_2."name"
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings_2
    where (
      __buildings_2."name" = __streets_2."name"
    )
    order by __buildings_2."id" asc
  )::text as "14",
  __properties__."id"::text as "15",
  __properties__."street_id"::text as "16",
  __properties__."name_or_number" as "17",
  __streets_3."id"::text as "18",
  __streets_3."name" as "19",
  array(
    select array[
      __buildings_3."id"::text,
      __buildings_3."name"
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings_3
    where (
      __buildings_3."name" = __streets_3."name"
    )
    order by __buildings_3."id" asc
  )::text as "20",
  __properties_2."id"::text as "21",
  __properties_2."street_id"::text as "22",
  __properties_2."name_or_number" as "23",
  __streets_4."id"::text as "24",
  __streets_4."name" as "25",
  array(
    select array[
      __buildings_4."id"::text,
      __buildings_4."name"
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings_4
    where (
      __buildings_4."name" = __streets_4."name"
    )
    order by __buildings_4."id" asc
  )::text as "26",
  __buildings_5."id"::text as "27",
  __buildings_5."name" as "28",
  __buildings_5."floors"::text as "29",
  __buildings_5."is_primary"::text as "30",
  __streets_5."id"::text as "31",
  __streets_5."name" as "32",
  array(
    select array[
      __buildings_6."id"::text,
      __buildings_6."name"
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings_6
    where (
      __buildings_6."name" = __streets_5."name"
    )
    order by __buildings_6."id" asc
  )::text as "33",
  __properties_3."id"::text as "34",
  __properties_3."street_id"::text as "35",
  __properties_3."name_or_number" as "36",
  __streets_6."id"::text as "37",
  __streets_6."name" as "38",
  array(
    select array[
      __buildings_7."id"::text,
      __buildings_7."name"
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings_7
    where (
      __buildings_7."name" = __streets_6."name"
    )
    order by __buildings_7."id" asc
  )::text as "39"
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
left outer join "smart_comment_relations"."buildings" as __buildings_5
on (
/* WHERE becoming ON */ (
  __buildings_5."id" = __houses__."building_id"
))
left outer join "smart_comment_relations"."streets" as __streets_5
on (
/* WHERE becoming ON */ (
  __streets_5."name" = __buildings_5."name"
))
left outer join "smart_comment_relations"."properties" as __properties_3
on (
/* WHERE becoming ON */ (
  __properties_3."id" = __buildings_5."property_id"
))
left outer join "smart_comment_relations"."streets" as __streets_6
on (
/* WHERE becoming ON */ (
  __streets_6."id" = __properties_3."street_id"
))
order by __houses__."street_id" asc, __houses__."property_id" asc;