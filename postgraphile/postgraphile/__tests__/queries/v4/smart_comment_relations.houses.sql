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
  (
    select array[
      __street_property__."str_id"::text,
      __street_property__."prop_id"::text,
      __street_property__."current_owner",
      __streets_2."id"::text,
      __streets_2."name",
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
      )::text,
      (
        select array[
          __properties__."id"::text,
          __properties__."street_id"::text,
          __properties__."name_or_number",
          __streets_3."id"::text,
          __streets_3."name",
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
          )::text
        ]::text[]
        from "smart_comment_relations"."properties" as __properties__
        left outer join "smart_comment_relations"."streets" as __streets_3
        on (
        /* WHERE becoming ON */ (
          __streets_3."id" = __properties__."street_id"
        ))
        where (
          __properties__."id" = __street_property__."prop_id"
        )
      )::text
    ]::text[]
    from "smart_comment_relations"."street_property" as __street_property__
    left outer join "smart_comment_relations"."streets" as __streets_2
    on (
    /* WHERE becoming ON */ (
      __streets_2."id" = __street_property__."str_id"
    ))
    where
      (
        __street_property__."str_id" = __houses__."street_id"
      ) and (
        __street_property__."prop_id" = __houses__."property_id"
      )
  )::text as "9",
  (
    select array[
      __properties_2."id"::text,
      __properties_2."street_id"::text,
      __properties_2."name_or_number",
      __streets_4."id"::text,
      __streets_4."name",
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
      )::text
    ]::text[]
    from "smart_comment_relations"."properties" as __properties_2
    left outer join "smart_comment_relations"."streets" as __streets_4
    on (
    /* WHERE becoming ON */ (
      __streets_4."id" = __properties_2."street_id"
    ))
    where (
      __properties_2."id" = __houses__."property_id"
    )
  )::text as "10",
  (
    select array[
      __buildings_5."id"::text,
      __buildings_5."name",
      __buildings_5."floors"::text,
      __buildings_5."is_primary"::text,
      __streets_5."id"::text,
      __streets_5."name",
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
      )::text,
      (
        select array[
          __properties_3."id"::text,
          __properties_3."street_id"::text,
          __properties_3."name_or_number",
          __streets_6."id"::text,
          __streets_6."name",
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
          )::text
        ]::text[]
        from "smart_comment_relations"."properties" as __properties_3
        left outer join "smart_comment_relations"."streets" as __streets_6
        on (
        /* WHERE becoming ON */ (
          __streets_6."id" = __properties_3."street_id"
        ))
        where (
          __properties_3."id" = __buildings_5."property_id"
        )
      )::text
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings_5
    left outer join "smart_comment_relations"."streets" as __streets_5
    on (
    /* WHERE becoming ON */ (
      __streets_5."name" = __buildings_5."name"
    ))
    where (
      __buildings_5."id" = __houses__."building_id"
    )
  )::text as "11"
from "smart_comment_relations"."houses" as __houses__
left outer join "smart_comment_relations"."streets" as __streets__
on (
/* WHERE becoming ON */ (
  __streets__."id" = __houses__."street_id"
))
order by __houses__."street_id" asc, __houses__."property_id" asc;