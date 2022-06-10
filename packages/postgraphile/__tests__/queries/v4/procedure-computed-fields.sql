with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'compoundType'::text,
        (
          case when (
            (__local_1__."compound_type") is not distinct
            from null
          ) then null else json_build_object(
            'a'::text,
            (
              (__local_1__."compound_type")."a"
            ),
            'fooBar'::text,
            (
              (__local_1__."compound_type")."foo_bar"
            ),
            '@computedField'::text,
            (
              select to_json(__local_2__) as "value"
              from "c"."compound_type_computed_field"((__local_1__."compound_type")) as __local_2__
              where (TRUE) and (TRUE)
            )
          ) end
        ),
        'nestedCompoundType'::text,
        (
          case when (
            (__local_1__."nested_compound_type") is not distinct
            from null
          ) then null else json_build_object(
            'a'::text,
            (
              case when (
                (
                  (__local_1__."nested_compound_type")."a"
                ) is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."a"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."foo_bar"
                ),
                '@computedField'::text,
                (
                  select to_json(__local_3__) as "value"
                  from "c"."compound_type_computed_field"(
                    (
                      (__local_1__."nested_compound_type")."a"
                    )
                  ) as __local_3__
                  where (TRUE) and (TRUE)
                )
              ) end
            ),
            'b'::text,
            (
              case when (
                (
                  (__local_1__."nested_compound_type")."b"
                ) is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."a"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."foo_bar"
                ),
                '@computedField'::text,
                (
                  select to_json(__local_4__) as "value"
                  from "c"."compound_type_computed_field"(
                    (
                      (__local_1__."nested_compound_type")."b"
                    )
                  ) as __local_4__
                  where (TRUE) and (TRUE)
                )
              ) end
            )
          ) end
        ),
        'nullableCompoundType'::text,
        (
          case when (
            (__local_1__."nullable_compound_type") is not distinct
            from null
          ) then null else json_build_object(
            'a'::text,
            (
              (__local_1__."nullable_compound_type")."a"
            ),
            'fooBar'::text,
            (
              (__local_1__."nullable_compound_type")."foo_bar"
            ),
            '@computedField'::text,
            (
              select to_json(__local_5__) as "value"
              from "c"."compound_type_computed_field"((__local_1__."nullable_compound_type")) as __local_5__
              where (TRUE) and (TRUE)
            )
          ) end
        ),
        'nullableNestedCompoundType'::text,
        (
          case when (
            (__local_1__."nullable_nested_compound_type") is not distinct
            from null
          ) then null else json_build_object(
            'a'::text,
            (
              case when (
                (
                  (__local_1__."nullable_nested_compound_type")."a"
                ) is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."a"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."foo_bar"
                ),
                '@computedField'::text,
                (
                  select to_json(__local_6__) as "value"
                  from "c"."compound_type_computed_field"(
                    (
                      (__local_1__."nullable_nested_compound_type")."a"
                    )
                  ) as __local_6__
                  where (TRUE) and (TRUE)
                )
              ) end
            ),
            'b'::text,
            (
              case when (
                (
                  (__local_1__."nullable_nested_compound_type")."b"
                ) is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."a"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."foo_bar"
                ),
                '@computedField'::text,
                (
                  select to_json(__local_7__) as "value"
                  from "c"."compound_type_computed_field"(
                    (
                      (__local_1__."nullable_nested_compound_type")."b"
                    )
                  ) as __local_7__
                  where (TRUE) and (TRUE)
                )
              ) end
            )
          ) end
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "b"."types" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
),
__local_8__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_8__.data
    from __local_8__
  ),
  '[]'::json
) as "data"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'headline'::text,
        (__local_1__."headline"),
        '@a'::text,
        (
          select to_json(__local_2__) as "value"
          from "a"."post_headline_trimmed"(__local_1__) as __local_2__
          where (TRUE) and (TRUE)
        ),
        '@b'::text,
        (
          select to_json(__local_3__) as "value"
          from "a"."post_headline_trimmed"(
            __local_1__,
            "length" := $1
          ) as __local_3__
          where (TRUE) and (TRUE)
        ),
        '@c'::text,
        (
          select to_json(__local_4__) as "value"
          from "a"."post_headline_trimmed"(
            __local_1__,
            "length" := $2,
            "omission" := $3
          ) as __local_4__
          where (TRUE) and (TRUE)
        ),
        '@d'::text,
        (
          select to_json(__local_5__) as "value"
          from "a"."post_headline_trimmed_strict"(__local_1__) as __local_5__
          where (TRUE) and (TRUE)
        ),
        '@e'::text,
        (
          select to_json(__local_6__) as "value"
          from "a"."post_headline_trimmed_strict"(
            __local_1__,
            "length" := $4
          ) as __local_6__
          where (TRUE) and (TRUE)
        ),
        '@f'::text,
        (
          select to_json(__local_7__) as "value"
          from "a"."post_headline_trimmed_strict"(
            __local_1__,
            "length" := $5,
            "omission" := $6
          ) as __local_7__
          where (TRUE) and (TRUE)
        ),
        '@g'::text,
        (
          select to_json(__local_8__) as "value"
          from "a"."post_headline_trimmed_no_defaults"(
            __local_1__,
            $7,
            NULL
          ) as __local_8__
          where (TRUE) and (TRUE)
        ),
        '@h'::text,
        (
          select to_json(__local_9__) as "value"
          from "a"."post_headline_trimmed_no_defaults"(
            __local_1__,
            $8,
            $9
          ) as __local_9__
          where (TRUE) and (TRUE)
        ),
        '@computedCompoundTypeArray'::text,
        (
          select coalesce(
            (
              select json_agg(__local_10__."object")
              from (
                select json_build_object(
                  'a'::text,
                  (__local_11__."a"),
                  'b'::text,
                  (__local_11__."b"),
                  'c'::text,
                  (__local_11__."c"),
                  'd'::text,
                  (__local_11__."d"),
                  'e'::text,
                  (__local_11__."e"),
                  'f'::text,
                  (__local_11__."f"),
                  'g'::text,
                  ((__local_11__."g"))::text,
                  'fooBar'::text,
                  (__local_11__."foo_bar")
                ) as object
                from unnest(
                  "a"."post_computed_compound_type_array"(
                    __local_1__,
                    row(
                      $10::"pg_catalog"."int4",
                      $11::"pg_catalog"."text",
                      $12::"b"."color",
                      NULL,
                      $13::"b"."enum_caps",
                      $14::"b"."enum_with_empty_string",
                      $15::"pg_catalog"."interval",
                      $16::"pg_catalog"."int4"
                    )::"c"."compound_type"
                  )
                ) as __local_11__
                where (TRUE) and (TRUE)
              ) as __local_10__
            ),
            '[]'::json
          )
        ),
        '@computedTextArray'::text,
        (
          select coalesce(
            (
              select json_agg(__local_12__."object")
              from (
                select json_build_object(
                  'value'::text,
                  __local_13__
                ) as object
                from unnest(
                  "a"."post_computed_text_array"(__local_1__)
                ) as __local_13__
                where (TRUE) and (TRUE)
              ) as __local_12__
            ),
            '[]'::json
          )
        ),
        '@computedIntervalArray'::text,
        (
          select coalesce(
            (
              select json_agg(__local_14__."object")
              from (
                select json_build_object(
                  'value'::text,
                  (__local_15__)::text
                ) as object
                from unnest(
                  "a"."post_computed_interval_array"(__local_1__)
                ) as __local_15__
                where (TRUE) and (TRUE)
              ) as __local_14__
            ),
            '[]'::json
          )
        ),
        '@computedIntervalSet'::text,
        (
          with __local_16__ as (
            select to_json(
              (__local_17__)::text
            ) as "value",
            to_json(
              (
                to_json(__local_17__)
              )
            ) as "@nodes",
            to_json(
              (
                to_json(__local_17__)
              )
            ) as "@edges",
            to_json(
              json_build_array(
                'natural',
                (
                  row_number( ) over (partition by 1)
                )
              )
            ) as "__cursor"
            from "a"."post_computed_interval_set"(__local_1__) as __local_17__
            where (TRUE) and (TRUE)
          ),
          __local_18__ as (
            select json_agg(
              to_json(__local_16__)
            ) as data
            from __local_16__
          )
          select json_build_object(
            'data'::text,
            coalesce(
              (
                select __local_18__.data
                from __local_18__
              ),
              '[]'::json
            )
          )
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "a"."post" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
),
__local_19__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_19__.data
    from __local_19__
  ),
  '[]'::json
) as "data"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'name'::text,
        (__local_1__."person_full_name"),
        '@firstName'::text,
        (
          select to_json(__local_2__) as "value"
          from "c"."person_first_name"(__local_1__) as __local_2__
          where (TRUE) and (TRUE)
        ),
        '@friends'::text,
        (
          with __local_3__ as (
            select to_json(
              (
                json_build_object(
                  '__identifiers'::text,
                  json_build_array(__local_4__."id"),
                  'name'::text,
                  (__local_4__."person_full_name"),
                  '@firstName'::text,
                  (
                    select to_json(__local_5__) as "value"
                    from "c"."person_first_name"(__local_4__) as __local_5__
                    where (TRUE) and (TRUE)
                  ),
                  '@friends'::text,
                  (
                    with __local_6__ as (
                      select to_json(
                        (
                          json_build_object(
                            '__identifiers'::text,
                            json_build_array(__local_7__."id"),
                            'name'::text,
                            (__local_7__."person_full_name"),
                            '@firstName'::text,
                            (
                              select to_json(__local_8__) as "value"
                              from "c"."person_first_name"(__local_7__) as __local_8__
                              where (TRUE) and (TRUE)
                            )
                          )
                        )
                      ) as "@nodes"
                      from "c"."person_friends"(__local_4__) as __local_7__
                      where (TRUE) and (TRUE)
                      limit 1
                    ),
                    __local_9__ as (
                      select json_agg(
                        to_json(__local_6__)
                      ) as data
                      from __local_6__
                    )
                    select json_build_object(
                      'data'::text,
                      coalesce(
                        (
                          select __local_9__.data
                          from __local_9__
                        ),
                        '[]'::json
                      )
                    )
                  )
                )
              )
            ) as "@nodes"
            from "c"."person_friends"(__local_1__) as __local_4__
            where (TRUE) and (TRUE)
          ),
          __local_10__ as (
            select json_agg(
              to_json(__local_3__)
            ) as data
            from __local_3__
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
        ),
        '@firstPost'::text,
        (
          select (
            case when (__local_11__ is null) then null else json_build_object(
              '__identifiers'::text,
              json_build_array(__local_11__."id"),
              'id'::text,
              (__local_11__."id"),
              'headline'::text,
              (__local_11__."headline")
            ) end
          ) as object
          from "c"."person_first_post"(__local_1__) as __local_11__
          where (
            not (__local_11__ is null)
          ) and (TRUE) and (TRUE)
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."person" as __local_1__
    where (TRUE) and (TRUE)
    order by __local_1__."id" ASC
  ) __local_1__
),
__local_12__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_12__.data
    from __local_12__
  ),
  '[]'::json
) as "data"

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        'notNullHasDefault'::text,
        (__local_1__."not_null_has_default"),
        'wontCastEasy'::text,
        (__local_1__."wont_cast_easy"),
        '@computed'::text,
        (
          select to_json(__local_2__) as "value"
          from "c"."edge_case_computed"(__local_1__) as __local_2__
          where (TRUE) and (TRUE)
        )
      )
    )
  ) as "@nodes"
  from (
    select __local_1__.*
    from "c"."edge_case" as __local_1__
    where (TRUE) and (TRUE)
  ) __local_1__
),
__local_3__ as (
  select json_agg(
    to_json(__local_0__)
  ) as data
  from __local_0__
)
select coalesce(
  (
    select __local_3__.data
    from __local_3__
  ),
  '[]'::json
) as "data"