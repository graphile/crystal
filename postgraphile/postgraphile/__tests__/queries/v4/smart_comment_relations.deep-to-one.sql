select
  __houses__."street_id"::text as "0",
  __houses__."property_id"::text as "1",
  __streets__."id"::text as "2",
  __streets__."name" as "3",
  (
    select array[
      __street_property__."current_owner",
      __street_property__."str_id"::text,
      __streets_2."id"::text,
      __streets_2."name",
      __houses_2."street_id"::text,
      __houses_2."property_id"::text,
      (
        select array[
          __street_property_2."current_owner",
          __street_property_2."str_id"::text,
          __streets_3."id"::text,
          __streets_3."name",
          (
            select array[
              __properties__."id"::text,
              __properties__."name_or_number",
              __streets_4."id"::text,
              __streets_4."name"
            ]::text[]
            from "smart_comment_relations"."properties" as __properties__
            left outer join "smart_comment_relations"."streets" as __streets_4
            on (
            /* WHERE becoming ON */ (
              __streets_4."id" = __properties__."street_id"
            ))
            where (
              __properties__."id" = __street_property_2."prop_id"
            )
          )::text
        ]::text[]
        from "smart_comment_relations"."street_property" as __street_property_2
        left outer join "smart_comment_relations"."streets" as __streets_3
        on (
        /* WHERE becoming ON */ (
          __streets_3."id" = __street_property_2."str_id"
        ))
        where
          (
            __street_property_2."str_id" = __houses_2."street_id"
          ) and (
            __street_property_2."prop_id" = __houses_2."property_id"
          )
      )::text,
      (
        select array[
          __properties_2."id"::text,
          __properties_2."name_or_number",
          __streets_5."id"::text,
          __streets_5."name"
        ]::text[]
        from "smart_comment_relations"."properties" as __properties_2
        left outer join "smart_comment_relations"."streets" as __streets_5
        on (
        /* WHERE becoming ON */ (
          __streets_5."id" = __properties_2."street_id"
        ))
        where (
          __properties_2."id" = __houses_2."property_id"
        )
      )::text,
      (
        select array[
          __buildings__."id"::text,
          __buildings__."name",
          __streets_6."id"::text,
          __streets_6."name",
          (
            select array[
              __properties_3."id"::text,
              __properties_3."name_or_number",
              __streets_7."id"::text,
              __streets_7."name"
            ]::text[]
            from "smart_comment_relations"."properties" as __properties_3
            left outer join "smart_comment_relations"."streets" as __streets_7
            on (
            /* WHERE becoming ON */ (
              __streets_7."id" = __properties_3."street_id"
            ))
            where (
              __properties_3."id" = __buildings__."property_id"
            )
          )::text
        ]::text[]
        from "smart_comment_relations"."buildings" as __buildings__
        left outer join "smart_comment_relations"."streets" as __streets_6
        on (
        /* WHERE becoming ON */ (
          __streets_6."name" = __buildings__."name"
        ))
        where (
          __buildings__."id" = __houses_2."building_id"
        )
      )::text,
      (
        select array[
          __properties_4."id"::text,
          __properties_4."name_or_number",
          __streets_8."id"::text,
          __streets_8."name"
        ]::text[]
        from "smart_comment_relations"."properties" as __properties_4
        left outer join "smart_comment_relations"."streets" as __streets_8
        on (
        /* WHERE becoming ON */ (
          __streets_8."id" = __properties_4."street_id"
        ))
        where (
          __properties_4."id" = __street_property__."prop_id"
        )
      )::text
    ]::text[]
    from "smart_comment_relations"."street_property" as __street_property__
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
    where
      (
        __street_property__."str_id" = __houses__."street_id"
      ) and (
        __street_property__."prop_id" = __houses__."property_id"
      )
  )::text as "4",
  (
    select array[
      __properties_5."id"::text,
      __properties_5."name_or_number",
      __streets_9."id"::text,
      __streets_9."name"
    ]::text[]
    from "smart_comment_relations"."properties" as __properties_5
    left outer join "smart_comment_relations"."streets" as __streets_9
    on (
    /* WHERE becoming ON */ (
      __streets_9."id" = __properties_5."street_id"
    ))
    where (
      __properties_5."id" = __houses__."property_id"
    )
  )::text as "5",
  (
    select array[
      __buildings_2."id"::text,
      __buildings_2."name",
      __streets_10."id"::text,
      __streets_10."name",
      (
        select array[
          __properties_6."id"::text,
          __properties_6."name_or_number",
          __streets_11."id"::text,
          __streets_11."name"
        ]::text[]
        from "smart_comment_relations"."properties" as __properties_6
        left outer join "smart_comment_relations"."streets" as __streets_11
        on (
        /* WHERE becoming ON */ (
          __streets_11."id" = __properties_6."street_id"
        ))
        where (
          __properties_6."id" = __buildings_2."property_id"
        )
      )::text
    ]::text[]
    from "smart_comment_relations"."buildings" as __buildings_2
    left outer join "smart_comment_relations"."streets" as __streets_10
    on (
    /* WHERE becoming ON */ (
      __streets_10."name" = __buildings_2."name"
    ))
    where (
      __buildings_2."id" = __houses__."building_id"
    )
  )::text as "6"
from "smart_comment_relations"."houses" as __houses__
left outer join "smart_comment_relations"."streets" as __streets__
on (
/* WHERE becoming ON */ (
  __streets__."id" = __houses__."street_id"
))
order by __houses__."street_id" asc, __houses__."property_id" asc
limit 1;