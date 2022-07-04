with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(
          __local_1__."street_id",
          __local_1__."property_id"
        ),
        'buildingName'::text,
        (__local_1__."building_name"),
        'propertyNameOrNumber'::text,
        (__local_1__."property_name_or_number"),
        'streetName'::text,
        (__local_1__."street_name"),
        'streetId'::text,
        (__local_1__."street_id"),
        'buildingId'::text,
        (__local_1__."building_id"),
        'propertyId'::text,
        (__local_1__."property_id"),
        '@streetByStreetId'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_2__."id"),
            'id'::text,
            (__local_2__."id"),
            'name'::text,
            (__local_2__."name"),
            '@buildingsNamedAfterStreet'::text,
            (
              with __local_3__ as (
                select to_json(
                  (
                    json_build_object(
                      '__identifiers'::text,
                      json_build_array(__local_4__."id"),
                      'id'::text,
                      (__local_4__."id"),
                      'name'::text,
                      (__local_4__."name")
                    )
                  )
                ) as "@nodes"
                from (
                  select __local_4__.*
                  from "smart_comment_relations"."buildings" as __local_4__
                  where (__local_4__."name" = __local_2__."name") and (TRUE) and (TRUE)
                  order by __local_4__."id" ASC
                ) __local_4__
              ),
              __local_5__ as (
                select json_agg(
                  to_json(__local_3__)
                ) as data
                from __local_3__
              )
              select json_build_object(
                'data'::text,
                coalesce(
                  (
                    select __local_5__.data
                    from __local_5__
                  ),
                  '[]'::json
                )
              )
            )
          ) as object
          from "smart_comment_relations"."streets" as __local_2__
          where (__local_1__."street_id" = __local_2__."id") and (TRUE) and (TRUE)
        ),
        '@buildingByBuildingId'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_6__."id"),
            'id'::text,
            (__local_6__."id"),
            'name'::text,
            (__local_6__."name"),
            'floors'::text,
            (__local_6__."floors"),
            'isPrimary'::text,
            (__local_6__."is_primary"),
            '@namedAfterStreet'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_7__."id"),
                'id'::text,
                (__local_7__."id"),
                'name'::text,
                (__local_7__."name"),
                '@buildingsNamedAfterStreet'::text,
                (
                  with __local_8__ as (
                    select to_json(
                      (
                        json_build_object(
                          '__identifiers'::text,
                          json_build_array(__local_9__."id"),
                          'id'::text,
                          (__local_9__."id"),
                          'name'::text,
                          (__local_9__."name")
                        )
                      )
                    ) as "@nodes"
                    from (
                      select __local_9__.*
                      from "smart_comment_relations"."buildings" as __local_9__
                      where (__local_9__."name" = __local_7__."name") and (TRUE) and (TRUE)
                      order by __local_9__."id" ASC
                    ) __local_9__
                  ),
                  __local_10__ as (
                    select json_agg(
                      to_json(__local_8__)
                    ) as data
                    from __local_8__
                  )
                  select json_build_object(
                    'data'::text,
                    coalesce(
                      (
                        select __local_10__.data
                        from __local_10__
                      ),
                      '[]'::json
                    )
                  )
                )
              ) as object
              from "smart_comment_relations"."streets" as __local_7__
              where (__local_6__."name" = __local_7__."name") and (TRUE) and (TRUE)
            ),
            '@propertyByPropertyId'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_11__."id"),
                'id'::text,
                (__local_11__."id"),
                'streetId'::text,
                (__local_11__."street_id"),
                'nameOrNumber'::text,
                (__local_11__."name_or_number"),
                '@streetByStreetId'::text,
                (
                  select json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_12__."id"),
                    'id'::text,
                    (__local_12__."id"),
                    'name'::text,
                    (__local_12__."name"),
                    '@buildingsNamedAfterStreet'::text,
                    (
                      with __local_13__ as (
                        select to_json(
                          (
                            json_build_object(
                              '__identifiers'::text,
                              json_build_array(__local_14__."id"),
                              'id'::text,
                              (__local_14__."id"),
                              'name'::text,
                              (__local_14__."name")
                            )
                          )
                        ) as "@nodes"
                        from (
                          select __local_14__.*
                          from "smart_comment_relations"."buildings" as __local_14__
                          where (__local_14__."name" = __local_12__."name") and (TRUE) and (TRUE)
                          order by __local_14__."id" ASC
                        ) __local_14__
                      ),
                      __local_15__ as (
                        select json_agg(
                          to_json(__local_13__)
                        ) as data
                        from __local_13__
                      )
                      select json_build_object(
                        'data'::text,
                        coalesce(
                          (
                            select __local_15__.data
                            from __local_15__
                          ),
                          '[]'::json
                        )
                      )
                    )
                  ) as object
                  from "smart_comment_relations"."streets" as __local_12__
                  where (__local_11__."street_id" = __local_12__."id") and (TRUE) and (TRUE)
                )
              ) as object
              from "smart_comment_relations"."properties" as __local_11__
              where (__local_6__."property_id" = __local_11__."id") and (TRUE) and (TRUE)
            )
          ) as object
          from "smart_comment_relations"."buildings" as __local_6__
          where (__local_1__."building_id" = __local_6__."id") and (TRUE) and (TRUE)
        ),
        '@propertyByPropertyId'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_16__."id"),
            'id'::text,
            (__local_16__."id"),
            'streetId'::text,
            (__local_16__."street_id"),
            'nameOrNumber'::text,
            (__local_16__."name_or_number"),
            '@streetByStreetId'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_17__."id"),
                'id'::text,
                (__local_17__."id"),
                'name'::text,
                (__local_17__."name"),
                '@buildingsNamedAfterStreet'::text,
                (
                  with __local_18__ as (
                    select to_json(
                      (
                        json_build_object(
                          '__identifiers'::text,
                          json_build_array(__local_19__."id"),
                          'id'::text,
                          (__local_19__."id"),
                          'name'::text,
                          (__local_19__."name")
                        )
                      )
                    ) as "@nodes"
                    from (
                      select __local_19__.*
                      from "smart_comment_relations"."buildings" as __local_19__
                      where (__local_19__."name" = __local_17__."name") and (TRUE) and (TRUE)
                      order by __local_19__."id" ASC
                    ) __local_19__
                  ),
                  __local_20__ as (
                    select json_agg(
                      to_json(__local_18__)
                    ) as data
                    from __local_18__
                  )
                  select json_build_object(
                    'data'::text,
                    coalesce(
                      (
                        select __local_20__.data
                        from __local_20__
                      ),
                      '[]'::json
                    )
                  )
                )
              ) as object
              from "smart_comment_relations"."streets" as __local_17__
              where (__local_16__."street_id" = __local_17__."id") and (TRUE) and (TRUE)
            )
          ) as object
          from "smart_comment_relations"."properties" as __local_16__
          where (__local_1__."property_id" = __local_16__."id") and (TRUE) and (TRUE)
        ),
        '@streetPropertyByStreetIdAndPropertyId'::text,
        (
          select json_build_object(
            'strId'::text,
            (__local_21__."str_id"),
            'propId'::text,
            (__local_21__."prop_id"),
            'currentOwner'::text,
            (__local_21__."current_owner"),
            '@streetByStrId'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_22__."id"),
                'id'::text,
                (__local_22__."id"),
                'name'::text,
                (__local_22__."name"),
                '@buildingsNamedAfterStreet'::text,
                (
                  with __local_23__ as (
                    select to_json(
                      (
                        json_build_object(
                          '__identifiers'::text,
                          json_build_array(__local_24__."id"),
                          'id'::text,
                          (__local_24__."id"),
                          'name'::text,
                          (__local_24__."name")
                        )
                      )
                    ) as "@nodes"
                    from (
                      select __local_24__.*
                      from "smart_comment_relations"."buildings" as __local_24__
                      where (__local_24__."name" = __local_22__."name") and (TRUE) and (TRUE)
                      order by __local_24__."id" ASC
                    ) __local_24__
                  ),
                  __local_25__ as (
                    select json_agg(
                      to_json(__local_23__)
                    ) as data
                    from __local_23__
                  )
                  select json_build_object(
                    'data'::text,
                    coalesce(
                      (
                        select __local_25__.data
                        from __local_25__
                      ),
                      '[]'::json
                    )
                  )
                )
              ) as object
              from "smart_comment_relations"."streets" as __local_22__
              where (__local_21__."str_id" = __local_22__."id") and (TRUE) and (TRUE)
            ),
            '@propertyByPropId'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_26__."id"),
                'id'::text,
                (__local_26__."id"),
                'streetId'::text,
                (__local_26__."street_id"),
                'nameOrNumber'::text,
                (__local_26__."name_or_number"),
                '@streetByStreetId'::text,
                (
                  select json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_27__."id"),
                    'id'::text,
                    (__local_27__."id"),
                    'name'::text,
                    (__local_27__."name"),
                    '@buildingsNamedAfterStreet'::text,
                    (
                      with __local_28__ as (
                        select to_json(
                          (
                            json_build_object(
                              '__identifiers'::text,
                              json_build_array(__local_29__."id"),
                              'id'::text,
                              (__local_29__."id"),
                              'name'::text,
                              (__local_29__."name")
                            )
                          )
                        ) as "@nodes"
                        from (
                          select __local_29__.*
                          from "smart_comment_relations"."buildings" as __local_29__
                          where (__local_29__."name" = __local_27__."name") and (TRUE) and (TRUE)
                          order by __local_29__."id" ASC
                        ) __local_29__
                      ),
                      __local_30__ as (
                        select json_agg(
                          to_json(__local_28__)
                        ) as data
                        from __local_28__
                      )
                      select json_build_object(
                        'data'::text,
                        coalesce(
                          (
                            select __local_30__.data
                            from __local_30__
                          ),
                          '[]'::json
                        )
                      )
                    )
                  ) as object
                  from "smart_comment_relations"."streets" as __local_27__
                  where (__local_26__."street_id" = __local_27__."id") and (TRUE) and (TRUE)
                )
              ) as object
              from "smart_comment_relations"."properties" as __local_26__
              where (__local_21__."prop_id" = __local_26__."id") and (TRUE) and (TRUE)
            )
          ) as object
          from "smart_comment_relations"."street_property" as __local_21__
          where (__local_1__."street_id" = __local_21__."str_id")
          and (__local_1__."property_id" = __local_21__."prop_id") and (TRUE) and (TRUE)
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "smart_comment_relations"."houses" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."street_id" ASC,
    __local_1__."property_id" ASC
  ) __local_1__
),
__local_31__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_31__.data
    from __local_31__
  ),
  '[]'::json
) as "data"

select to_json((__local_0__."building_name")) as "buildingName",
to_json((__local_0__."property_name_or_number")) as "propertyNameOrNumber",
to_json((__local_0__."street_name")) as "streetName",
to_json(
  json_build_array(
    __local_0__."street_id",
    __local_0__."property_id"
  )
) as "__identifiers"
from "smart_comment_relations"."houses" as __local_0__
where (
  __local_0__."street_id" = $1
)
and (
  __local_0__."property_id" = $2
) and (TRUE) and (TRUE)

select to_json((__local_0__."building_name")) as "buildingName",
to_json((__local_0__."property_name_or_number")) as "propertyNameOrNumber",
to_json((__local_0__."street_name")) as "streetName",
to_json(
  json_build_array(
    __local_0__."street_id",
    __local_0__."property_id"
  )
) as "__identifiers"
from "smart_comment_relations"."houses" as __local_0__
where (
  __local_0__."street_id" = $1
)
and (
  __local_0__."property_id" = $2
) and (TRUE) and (TRUE)