with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'smallint'::text,
        (__local_1__."smallint"),
        'bigint'::text,
        ((__local_1__."bigint"))::text,
        'numeric'::text,
        ((__local_1__."numeric"))::text,
        'decimal'::text,
        ((__local_1__."decimal"))::text,
        'boolean'::text,
        (__local_1__."boolean"),
        'varchar'::text,
        (__local_1__."varchar"),
        'enum'::text,
        (__local_1__."enum"),
        'enumArray'::text,
        (
          case when (__local_1__."enum_array") is null then null when coalesce(
            array_length(
              (__local_1__."enum_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_2__)
            from unnest((__local_1__."enum_array")) as __local_2__
          ) end
        ),
        'domain'::text,
        (__local_1__."domain"),
        'domain2'::text,
        (__local_1__."domain2"),
        'textArray'::text,
        (
          case when (__local_1__."text_array") is null then null when coalesce(
            array_length(
              (__local_1__."text_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_3__)
            from unnest((__local_1__."text_array")) as __local_3__
          ) end
        ),
        'json'::text,
        (__local_1__."json"),
        'jsonb'::text,
        (__local_1__."jsonb"),
        'nullableRange'::text,
        case when ((__local_1__."nullable_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."nullable_range"))
          ) end,
          'end',
          case when upper((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."nullable_range"))
          ) end
        ) end,
        'numrange'::text,
        case when ((__local_1__."numrange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."numrange"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."numrange"))
          ) end,
          'end',
          case when upper((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."numrange"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."numrange"))
          ) end
        ) end,
        'daterange'::text,
        case when ((__local_1__."daterange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            lower((__local_1__."daterange")),
            'inclusive',
            lower_inc((__local_1__."daterange"))
          ) end,
          'end',
          case when upper((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            upper((__local_1__."daterange")),
            'inclusive',
            upper_inc((__local_1__."daterange"))
          ) end
        ) end,
        'anIntRange'::text,
        case when ((__local_1__."an_int_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            lower((__local_1__."an_int_range")),
            'inclusive',
            lower_inc((__local_1__."an_int_range"))
          ) end,
          'end',
          case when upper((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            upper((__local_1__."an_int_range")),
            'inclusive',
            upper_inc((__local_1__."an_int_range"))
          ) end
        ) end,
        'timestamp'::text,
        (__local_1__."timestamp"),
        'timestamptz'::text,
        (__local_1__."timestamptz"),
        'date'::text,
        (__local_1__."date"),
        'time'::text,
        (__local_1__."time"),
        'timetz'::text,
        (__local_1__."timetz"),
        'interval'::text,
        ((__local_1__."interval"))::text,
        'intervalArray'::text,
        (
          case when (__local_1__."interval_array") is null then null when coalesce(
            array_length(
              (__local_1__."interval_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(
              (__local_4__)::text
            )
            from unnest((__local_1__."interval_array")) as __local_4__
          ) end
        ),
        'money'::text,
        ((__local_1__."money"))::numeric::text,
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
            'b'::text,
            (
              (__local_1__."compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nested_compound_type")."baz_buz"
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
            'b'::text,
            (
              (__local_1__."nullable_compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."nullable_compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."nullable_compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."nullable_compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."nullable_compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."nullable_compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nullable_nested_compound_type")."baz_buz"
            )
          ) end
        ),
        'point'::text,
        (__local_1__."point"),
        'nullablePoint'::text,
        (__local_1__."nullablePoint"),
        'inet'::text,
        (__local_1__."inet"),
        'cidr'::text,
        (__local_1__."cidr"),
        'macaddr'::text,
        (__local_1__."macaddr"),
        'regproc'::text,
        (__local_1__."regproc"),
        'regprocedure'::text,
        (__local_1__."regprocedure"),
        'regoper'::text,
        (__local_1__."regoper"),
        'regoperator'::text,
        (__local_1__."regoperator"),
        'regclass'::text,
        (__local_1__."regclass"),
        'regtype'::text,
        (__local_1__."regtype"),
        'regconfig'::text,
        (__local_1__."regconfig"),
        'regdictionary'::text,
        (__local_1__."regdictionary"),
        'textArrayDomain'::text,
        (__local_1__."text_array_domain"),
        'int8ArrayDomain'::text,
        ((__local_1__."int8_array_domain"))::text[],
        '@postBySmallint'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_5__."id"),
            'id'::text,
            (__local_5__."id"),
            'headline'::text,
            (__local_5__."headline")
          ) as object
          from "a"."post" as __local_5__
          where (__local_1__."smallint" = __local_5__."id") and (TRUE) and (TRUE)
        ),
        '@postById'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_6__."id"),
            'id'::text,
            (__local_6__."id"),
            'headline'::text,
            (__local_6__."headline")
          ) as object
          from "a"."post" as __local_6__
          where (__local_1__."id" = __local_6__."id") and (TRUE) and (TRUE)
        )
      )
    )
  ) as "@nodes",
  to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'id'::text,
            (__local_1__."id"),
            'smallint'::text,
            (__local_1__."smallint"),
            'bigint'::text,
            ((__local_1__."bigint"))::text,
            'numeric'::text,
            ((__local_1__."numeric"))::text,
            'decimal'::text,
            ((__local_1__."decimal"))::text,
            'boolean'::text,
            (__local_1__."boolean"),
            'varchar'::text,
            (__local_1__."varchar"),
            'enum'::text,
            (__local_1__."enum"),
            'enumArray'::text,
            (
              case when (__local_1__."enum_array") is null then null when coalesce(
                array_length(
                  (__local_1__."enum_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_7__)
                from unnest((__local_1__."enum_array")) as __local_7__
              ) end
            ),
            'domain'::text,
            (__local_1__."domain"),
            'domain2'::text,
            (__local_1__."domain2"),
            'textArray'::text,
            (
              case when (__local_1__."text_array") is null then null when coalesce(
                array_length(
                  (__local_1__."text_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_8__)
                from unnest((__local_1__."text_array")) as __local_8__
              ) end
            ),
            'json'::text,
            (__local_1__."json"),
            'jsonb'::text,
            (__local_1__."jsonb"),
            'nullableRange'::text,
            case when ((__local_1__."nullable_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_1__."nullable_range"))
                )::text,
                'inclusive',
                lower_inc((__local_1__."nullable_range"))
              ) end,
              'end',
              case when upper((__local_1__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_1__."nullable_range"))
                )::text,
                'inclusive',
                upper_inc((__local_1__."nullable_range"))
              ) end
            ) end,
            'numrange'::text,
            case when ((__local_1__."numrange")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."numrange")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_1__."numrange"))
                )::text,
                'inclusive',
                lower_inc((__local_1__."numrange"))
              ) end,
              'end',
              case when upper((__local_1__."numrange")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_1__."numrange"))
                )::text,
                'inclusive',
                upper_inc((__local_1__."numrange"))
              ) end
            ) end,
            'daterange'::text,
            case when ((__local_1__."daterange")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."daterange")) is null then null else json_build_object(
                'value',
                lower((__local_1__."daterange")),
                'inclusive',
                lower_inc((__local_1__."daterange"))
              ) end,
              'end',
              case when upper((__local_1__."daterange")) is null then null else json_build_object(
                'value',
                upper((__local_1__."daterange")),
                'inclusive',
                upper_inc((__local_1__."daterange"))
              ) end
            ) end,
            'anIntRange'::text,
            case when ((__local_1__."an_int_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."an_int_range")) is null then null else json_build_object(
                'value',
                lower((__local_1__."an_int_range")),
                'inclusive',
                lower_inc((__local_1__."an_int_range"))
              ) end,
              'end',
              case when upper((__local_1__."an_int_range")) is null then null else json_build_object(
                'value',
                upper((__local_1__."an_int_range")),
                'inclusive',
                upper_inc((__local_1__."an_int_range"))
              ) end
            ) end,
            'timestamp'::text,
            (__local_1__."timestamp"),
            'timestamptz'::text,
            (__local_1__."timestamptz"),
            'date'::text,
            (__local_1__."date"),
            'time'::text,
            (__local_1__."time"),
            'timetz'::text,
            (__local_1__."timetz"),
            'interval'::text,
            ((__local_1__."interval"))::text,
            'intervalArray'::text,
            (
              case when (__local_1__."interval_array") is null then null when coalesce(
                array_length(
                  (__local_1__."interval_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(
                  (__local_9__)::text
                )
                from unnest((__local_1__."interval_array")) as __local_9__
              ) end
            ),
            'money'::text,
            ((__local_1__."money"))::numeric::text,
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
                'b'::text,
                (
                  (__local_1__."compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_1__."compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_1__."compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_1__."compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_1__."compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_1__."compound_type")."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_1__."nested_compound_type")."baz_buz"
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
                'b'::text,
                (
                  (__local_1__."nullable_compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_1__."nullable_compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_1__."nullable_compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_1__."nullable_compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_1__."nullable_compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_1__."nullable_compound_type")."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_1__."nullable_nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'point'::text,
            (__local_1__."point"),
            'nullablePoint'::text,
            (__local_1__."nullablePoint"),
            'inet'::text,
            (__local_1__."inet"),
            'cidr'::text,
            (__local_1__."cidr"),
            'macaddr'::text,
            (__local_1__."macaddr"),
            'regproc'::text,
            (__local_1__."regproc"),
            'regprocedure'::text,
            (__local_1__."regprocedure"),
            'regoper'::text,
            (__local_1__."regoper"),
            'regoperator'::text,
            (__local_1__."regoperator"),
            'regclass'::text,
            (__local_1__."regclass"),
            'regtype'::text,
            (__local_1__."regtype"),
            'regconfig'::text,
            (__local_1__."regconfig"),
            'regdictionary'::text,
            (__local_1__."regdictionary"),
            'textArrayDomain'::text,
            (__local_1__."text_array_domain"),
            'int8ArrayDomain'::text,
            ((__local_1__."int8_array_domain"))::text[],
            '@postBySmallint'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_10__."id"),
                'id'::text,
                (__local_10__."id"),
                'headline'::text,
                (__local_10__."headline")
              ) as object
              from "a"."post" as __local_10__
              where (__local_1__."smallint" = __local_10__."id") and (TRUE) and (TRUE)
            ),
            '@postById'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_11__."id"),
                'id'::text,
                (__local_11__."id"),
                'headline'::text,
                (__local_11__."headline")
              ) as object
              from "a"."post" as __local_11__
              where (__local_1__."id" = __local_11__."id") and (TRUE) and (TRUE)
            )
          )
        )
      )
    )
  ) as "@edges",
  to_json(
    json_build_array(
      'primary_key_asc',
      json_build_array(__local_1__."id")
    )
  ) as "__cursor"
  from (
    select __local_1__.*
    from "b"."types" as __local_1__
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
) as "data",
FALSE as "hasNextPage",
FALSE as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "b"."types" as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."smallint")) as "smallint",
to_json(
  ((__local_0__."bigint"))::text
) as "bigint",
to_json(
  ((__local_0__."numeric"))::text
) as "numeric",
to_json(
  ((__local_0__."decimal"))::text
) as "decimal",
to_json((__local_0__."boolean")) as "boolean",
to_json((__local_0__."varchar")) as "varchar",
to_json((__local_0__."enum")) as "enum",
to_json(
  (
    case when (__local_0__."enum_array") is null then null when coalesce(
      array_length(
        (__local_0__."enum_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_1__)
      from unnest((__local_0__."enum_array")) as __local_1__
    ) end
  )
) as "enumArray",
to_json((__local_0__."domain")) as "domain",
to_json((__local_0__."domain2")) as "domain2",
to_json(
  (
    case when (__local_0__."text_array") is null then null when coalesce(
      array_length(
        (__local_0__."text_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_2__)
      from unnest((__local_0__."text_array")) as __local_2__
    ) end
  )
) as "textArray",
to_json((__local_0__."json")) as "json",
to_json((__local_0__."jsonb")) as "jsonb",
to_json(
  case when ((__local_0__."nullable_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."nullable_range"))
    ) end,
    'end',
    case when upper((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."nullable_range"))
    ) end
  ) end
) as "nullableRange",
to_json(
  case when ((__local_0__."numrange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."numrange"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."numrange"))
    ) end,
    'end',
    case when upper((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."numrange"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."numrange"))
    ) end
  ) end
) as "numrange",
to_json(
  case when ((__local_0__."daterange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      lower((__local_0__."daterange")),
      'inclusive',
      lower_inc((__local_0__."daterange"))
    ) end,
    'end',
    case when upper((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      upper((__local_0__."daterange")),
      'inclusive',
      upper_inc((__local_0__."daterange"))
    ) end
  ) end
) as "daterange",
to_json(
  case when ((__local_0__."an_int_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      lower((__local_0__."an_int_range")),
      'inclusive',
      lower_inc((__local_0__."an_int_range"))
    ) end,
    'end',
    case when upper((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      upper((__local_0__."an_int_range")),
      'inclusive',
      upper_inc((__local_0__."an_int_range"))
    ) end
  ) end
) as "anIntRange",
to_json((__local_0__."timestamp")) as "timestamp",
to_json((__local_0__."timestamptz")) as "timestamptz",
to_json((__local_0__."date")) as "date",
to_json((__local_0__."time")) as "time",
to_json((__local_0__."timetz")) as "timetz",
to_json(
  ((__local_0__."interval"))::text
) as "interval",
to_json(
  (
    case when (__local_0__."interval_array") is null then null when coalesce(
      array_length(
        (__local_0__."interval_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(
        (__local_3__)::text
      )
      from unnest((__local_0__."interval_array")) as __local_3__
    ) end
  )
) as "intervalArray",
to_json(
  ((__local_0__."money"))::numeric::text
) as "money",
to_json(
  (
    case when (
      (__local_0__."compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."compound_type")."foo_bar"
      )
    ) end
  )
) as "compoundType",
to_json(
  (
    case when (
      (__local_0__."nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nestedCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."nullable_compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."nullable_compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."nullable_compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."nullable_compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."nullable_compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."nullable_compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."nullable_compound_type")."foo_bar"
      )
    ) end
  )
) as "nullableCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nullable_nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nullableNestedCompoundType",
to_json((__local_0__."point")) as "point",
to_json((__local_0__."nullablePoint")) as "nullablePoint",
to_json((__local_0__."inet")) as "inet",
to_json((__local_0__."cidr")) as "cidr",
to_json((__local_0__."macaddr")) as "macaddr",
to_json((__local_0__."regproc")) as "regproc",
to_json((__local_0__."regprocedure")) as "regprocedure",
to_json((__local_0__."regoper")) as "regoper",
to_json((__local_0__."regoperator")) as "regoperator",
to_json((__local_0__."regclass")) as "regclass",
to_json((__local_0__."regtype")) as "regtype",
to_json((__local_0__."regconfig")) as "regconfig",
to_json((__local_0__."regdictionary")) as "regdictionary",
to_json((__local_0__."text_array_domain")) as "textArrayDomain",
to_json(
  ((__local_0__."int8_array_domain"))::text[]
) as "int8ArrayDomain",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_4__."id"),
      'id'::text,
      (__local_4__."id"),
      'headline'::text,
      (__local_4__."headline")
    ) as object
    from "a"."post" as __local_4__
    where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
  )
) as "@postBySmallint",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_5__."id"),
      'id'::text,
      (__local_5__."id"),
      'headline'::text,
      (__local_5__."headline")
    ) as object
    from "a"."post" as __local_5__
    where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
  )
) as "@postById"
from (
  select __local_0__.*
  from "b"."types" as __local_0__
  where (TRUE) and (TRUE)
  order by __local_0__."id" ASC
) __local_0__

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."smallint")) as "smallint",
to_json(
  ((__local_0__."bigint"))::text
) as "bigint",
to_json(
  ((__local_0__."numeric"))::text
) as "numeric",
to_json(
  ((__local_0__."decimal"))::text
) as "decimal",
to_json((__local_0__."boolean")) as "boolean",
to_json((__local_0__."varchar")) as "varchar",
to_json((__local_0__."enum")) as "enum",
to_json(
  (
    case when (__local_0__."enum_array") is null then null when coalesce(
      array_length(
        (__local_0__."enum_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_1__)
      from unnest((__local_0__."enum_array")) as __local_1__
    ) end
  )
) as "enumArray",
to_json((__local_0__."domain")) as "domain",
to_json((__local_0__."domain2")) as "domain2",
to_json(
  (
    case when (__local_0__."text_array") is null then null when coalesce(
      array_length(
        (__local_0__."text_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_2__)
      from unnest((__local_0__."text_array")) as __local_2__
    ) end
  )
) as "textArray",
to_json((__local_0__."json")) as "json",
to_json((__local_0__."jsonb")) as "jsonb",
to_json(
  case when ((__local_0__."nullable_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."nullable_range"))
    ) end,
    'end',
    case when upper((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."nullable_range"))
    ) end
  ) end
) as "nullableRange",
to_json(
  case when ((__local_0__."numrange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."numrange"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."numrange"))
    ) end,
    'end',
    case when upper((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."numrange"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."numrange"))
    ) end
  ) end
) as "numrange",
to_json(
  case when ((__local_0__."daterange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      lower((__local_0__."daterange")),
      'inclusive',
      lower_inc((__local_0__."daterange"))
    ) end,
    'end',
    case when upper((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      upper((__local_0__."daterange")),
      'inclusive',
      upper_inc((__local_0__."daterange"))
    ) end
  ) end
) as "daterange",
to_json(
  case when ((__local_0__."an_int_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      lower((__local_0__."an_int_range")),
      'inclusive',
      lower_inc((__local_0__."an_int_range"))
    ) end,
    'end',
    case when upper((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      upper((__local_0__."an_int_range")),
      'inclusive',
      upper_inc((__local_0__."an_int_range"))
    ) end
  ) end
) as "anIntRange",
to_json((__local_0__."timestamp")) as "timestamp",
to_json((__local_0__."timestamptz")) as "timestamptz",
to_json((__local_0__."date")) as "date",
to_json((__local_0__."time")) as "time",
to_json((__local_0__."timetz")) as "timetz",
to_json(
  ((__local_0__."interval"))::text
) as "interval",
to_json(
  (
    case when (__local_0__."interval_array") is null then null when coalesce(
      array_length(
        (__local_0__."interval_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(
        (__local_3__)::text
      )
      from unnest((__local_0__."interval_array")) as __local_3__
    ) end
  )
) as "intervalArray",
to_json(
  ((__local_0__."money"))::numeric::text
) as "money",
to_json(
  (
    case when (
      (__local_0__."compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."compound_type")."foo_bar"
      )
    ) end
  )
) as "compoundType",
to_json(
  (
    case when (
      (__local_0__."nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nestedCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."nullable_compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."nullable_compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."nullable_compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."nullable_compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."nullable_compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."nullable_compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."nullable_compound_type")."foo_bar"
      )
    ) end
  )
) as "nullableCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nullable_nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nullableNestedCompoundType",
to_json((__local_0__."point")) as "point",
to_json((__local_0__."nullablePoint")) as "nullablePoint",
to_json((__local_0__."inet")) as "inet",
to_json((__local_0__."cidr")) as "cidr",
to_json((__local_0__."macaddr")) as "macaddr",
to_json((__local_0__."regproc")) as "regproc",
to_json((__local_0__."regprocedure")) as "regprocedure",
to_json((__local_0__."regoper")) as "regoper",
to_json((__local_0__."regoperator")) as "regoperator",
to_json((__local_0__."regclass")) as "regclass",
to_json((__local_0__."regtype")) as "regtype",
to_json((__local_0__."regconfig")) as "regconfig",
to_json((__local_0__."regdictionary")) as "regdictionary",
to_json((__local_0__."text_array_domain")) as "textArrayDomain",
to_json(
  ((__local_0__."int8_array_domain"))::text[]
) as "int8ArrayDomain",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_4__."id"),
      'id'::text,
      (__local_4__."id"),
      'headline'::text,
      (__local_4__."headline")
    ) as object
    from "a"."post" as __local_4__
    where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
  )
) as "@postBySmallint",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_5__."id"),
      'id'::text,
      (__local_5__."id"),
      'headline'::text,
      (__local_5__."headline")
    ) as object
    from "a"."post" as __local_5__
    where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
  )
) as "@postById"
from "b"."types" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."smallint")) as "smallint",
to_json(
  ((__local_0__."bigint"))::text
) as "bigint",
to_json(
  ((__local_0__."numeric"))::text
) as "numeric",
to_json(
  ((__local_0__."decimal"))::text
) as "decimal",
to_json((__local_0__."boolean")) as "boolean",
to_json((__local_0__."varchar")) as "varchar",
to_json((__local_0__."enum")) as "enum",
to_json(
  (
    case when (__local_0__."enum_array") is null then null when coalesce(
      array_length(
        (__local_0__."enum_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_1__)
      from unnest((__local_0__."enum_array")) as __local_1__
    ) end
  )
) as "enumArray",
to_json((__local_0__."domain")) as "domain",
to_json((__local_0__."domain2")) as "domain2",
to_json(
  (
    case when (__local_0__."text_array") is null then null when coalesce(
      array_length(
        (__local_0__."text_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_2__)
      from unnest((__local_0__."text_array")) as __local_2__
    ) end
  )
) as "textArray",
to_json((__local_0__."json")) as "json",
to_json((__local_0__."jsonb")) as "jsonb",
to_json(
  case when ((__local_0__."nullable_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."nullable_range"))
    ) end,
    'end',
    case when upper((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."nullable_range"))
    ) end
  ) end
) as "nullableRange",
to_json(
  case when ((__local_0__."numrange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."numrange"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."numrange"))
    ) end,
    'end',
    case when upper((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."numrange"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."numrange"))
    ) end
  ) end
) as "numrange",
to_json(
  case when ((__local_0__."daterange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      lower((__local_0__."daterange")),
      'inclusive',
      lower_inc((__local_0__."daterange"))
    ) end,
    'end',
    case when upper((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      upper((__local_0__."daterange")),
      'inclusive',
      upper_inc((__local_0__."daterange"))
    ) end
  ) end
) as "daterange",
to_json(
  case when ((__local_0__."an_int_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      lower((__local_0__."an_int_range")),
      'inclusive',
      lower_inc((__local_0__."an_int_range"))
    ) end,
    'end',
    case when upper((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      upper((__local_0__."an_int_range")),
      'inclusive',
      upper_inc((__local_0__."an_int_range"))
    ) end
  ) end
) as "anIntRange",
to_json((__local_0__."timestamp")) as "timestamp",
to_json((__local_0__."timestamptz")) as "timestamptz",
to_json((__local_0__."date")) as "date",
to_json((__local_0__."time")) as "time",
to_json((__local_0__."timetz")) as "timetz",
to_json(
  ((__local_0__."interval"))::text
) as "interval",
to_json(
  (
    case when (__local_0__."interval_array") is null then null when coalesce(
      array_length(
        (__local_0__."interval_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(
        (__local_3__)::text
      )
      from unnest((__local_0__."interval_array")) as __local_3__
    ) end
  )
) as "intervalArray",
to_json(
  ((__local_0__."money"))::numeric::text
) as "money",
to_json(
  (
    case when (
      (__local_0__."compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."compound_type")."foo_bar"
      )
    ) end
  )
) as "compoundType",
to_json(
  (
    case when (
      (__local_0__."nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nestedCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."nullable_compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."nullable_compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."nullable_compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."nullable_compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."nullable_compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."nullable_compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."nullable_compound_type")."foo_bar"
      )
    ) end
  )
) as "nullableCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nullable_nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nullableNestedCompoundType",
to_json((__local_0__."point")) as "point",
to_json((__local_0__."nullablePoint")) as "nullablePoint",
to_json((__local_0__."inet")) as "inet",
to_json((__local_0__."cidr")) as "cidr",
to_json((__local_0__."macaddr")) as "macaddr",
to_json((__local_0__."regproc")) as "regproc",
to_json((__local_0__."regprocedure")) as "regprocedure",
to_json((__local_0__."regoper")) as "regoper",
to_json((__local_0__."regoperator")) as "regoperator",
to_json((__local_0__."regclass")) as "regclass",
to_json((__local_0__."regtype")) as "regtype",
to_json((__local_0__."regconfig")) as "regconfig",
to_json((__local_0__."regdictionary")) as "regdictionary",
to_json((__local_0__."text_array_domain")) as "textArrayDomain",
to_json(
  ((__local_0__."int8_array_domain"))::text[]
) as "int8ArrayDomain",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_4__."id"),
      'id'::text,
      (__local_4__."id"),
      'headline'::text,
      (__local_4__."headline")
    ) as object
    from "a"."post" as __local_4__
    where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
  )
) as "@postBySmallint",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_5__."id"),
      'id'::text,
      (__local_5__."id"),
      'headline'::text,
      (__local_5__."headline")
    ) as object
    from "a"."post" as __local_5__
    where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
  )
) as "@postById"
from "b"."types" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."smallint")) as "smallint",
to_json(
  ((__local_0__."bigint"))::text
) as "bigint",
to_json(
  ((__local_0__."numeric"))::text
) as "numeric",
to_json(
  ((__local_0__."decimal"))::text
) as "decimal",
to_json((__local_0__."boolean")) as "boolean",
to_json((__local_0__."varchar")) as "varchar",
to_json((__local_0__."enum")) as "enum",
to_json(
  (
    case when (__local_0__."enum_array") is null then null when coalesce(
      array_length(
        (__local_0__."enum_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_1__)
      from unnest((__local_0__."enum_array")) as __local_1__
    ) end
  )
) as "enumArray",
to_json((__local_0__."domain")) as "domain",
to_json((__local_0__."domain2")) as "domain2",
to_json(
  (
    case when (__local_0__."text_array") is null then null when coalesce(
      array_length(
        (__local_0__."text_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_2__)
      from unnest((__local_0__."text_array")) as __local_2__
    ) end
  )
) as "textArray",
to_json((__local_0__."json")) as "json",
to_json((__local_0__."jsonb")) as "jsonb",
to_json(
  case when ((__local_0__."nullable_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."nullable_range"))
    ) end,
    'end',
    case when upper((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."nullable_range"))
    ) end
  ) end
) as "nullableRange",
to_json(
  case when ((__local_0__."numrange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."numrange"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."numrange"))
    ) end,
    'end',
    case when upper((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."numrange"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."numrange"))
    ) end
  ) end
) as "numrange",
to_json(
  case when ((__local_0__."daterange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      lower((__local_0__."daterange")),
      'inclusive',
      lower_inc((__local_0__."daterange"))
    ) end,
    'end',
    case when upper((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      upper((__local_0__."daterange")),
      'inclusive',
      upper_inc((__local_0__."daterange"))
    ) end
  ) end
) as "daterange",
to_json(
  case when ((__local_0__."an_int_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      lower((__local_0__."an_int_range")),
      'inclusive',
      lower_inc((__local_0__."an_int_range"))
    ) end,
    'end',
    case when upper((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      upper((__local_0__."an_int_range")),
      'inclusive',
      upper_inc((__local_0__."an_int_range"))
    ) end
  ) end
) as "anIntRange",
to_json((__local_0__."timestamp")) as "timestamp",
to_json((__local_0__."timestamptz")) as "timestamptz",
to_json((__local_0__."date")) as "date",
to_json((__local_0__."time")) as "time",
to_json((__local_0__."timetz")) as "timetz",
to_json(
  ((__local_0__."interval"))::text
) as "interval",
to_json(
  (
    case when (__local_0__."interval_array") is null then null when coalesce(
      array_length(
        (__local_0__."interval_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(
        (__local_3__)::text
      )
      from unnest((__local_0__."interval_array")) as __local_3__
    ) end
  )
) as "intervalArray",
to_json(
  ((__local_0__."money"))::numeric::text
) as "money",
to_json(
  (
    case when (
      (__local_0__."compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."compound_type")."foo_bar"
      )
    ) end
  )
) as "compoundType",
to_json(
  (
    case when (
      (__local_0__."nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nestedCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."nullable_compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."nullable_compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."nullable_compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."nullable_compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."nullable_compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."nullable_compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."nullable_compound_type")."foo_bar"
      )
    ) end
  )
) as "nullableCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nullable_nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nullableNestedCompoundType",
to_json((__local_0__."point")) as "point",
to_json((__local_0__."nullablePoint")) as "nullablePoint",
to_json((__local_0__."inet")) as "inet",
to_json((__local_0__."cidr")) as "cidr",
to_json((__local_0__."macaddr")) as "macaddr",
to_json((__local_0__."regproc")) as "regproc",
to_json((__local_0__."regprocedure")) as "regprocedure",
to_json((__local_0__."regoper")) as "regoper",
to_json((__local_0__."regoperator")) as "regoperator",
to_json((__local_0__."regclass")) as "regclass",
to_json((__local_0__."regtype")) as "regtype",
to_json((__local_0__."regconfig")) as "regconfig",
to_json((__local_0__."regdictionary")) as "regdictionary",
to_json((__local_0__."text_array_domain")) as "textArrayDomain",
to_json(
  ((__local_0__."int8_array_domain"))::text[]
) as "int8ArrayDomain",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_4__."id"),
      'id'::text,
      (__local_4__."id"),
      'headline'::text,
      (__local_4__."headline")
    ) as object
    from "a"."post" as __local_4__
    where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
  )
) as "@postBySmallint",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_5__."id"),
      'id'::text,
      (__local_5__."id"),
      'headline'::text,
      (__local_5__."headline")
    ) as object
    from "a"."post" as __local_5__
    where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
  )
) as "@postById"
from "b"."types" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."smallint")) as "smallint",
to_json(
  ((__local_0__."bigint"))::text
) as "bigint",
to_json(
  ((__local_0__."numeric"))::text
) as "numeric",
to_json(
  ((__local_0__."decimal"))::text
) as "decimal",
to_json((__local_0__."boolean")) as "boolean",
to_json((__local_0__."varchar")) as "varchar",
to_json((__local_0__."enum")) as "enum",
to_json(
  (
    case when (__local_0__."enum_array") is null then null when coalesce(
      array_length(
        (__local_0__."enum_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_1__)
      from unnest((__local_0__."enum_array")) as __local_1__
    ) end
  )
) as "enumArray",
to_json((__local_0__."domain")) as "domain",
to_json((__local_0__."domain2")) as "domain2",
to_json(
  (
    case when (__local_0__."text_array") is null then null when coalesce(
      array_length(
        (__local_0__."text_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_2__)
      from unnest((__local_0__."text_array")) as __local_2__
    ) end
  )
) as "textArray",
to_json((__local_0__."json")) as "json",
to_json((__local_0__."jsonb")) as "jsonb",
to_json(
  case when ((__local_0__."nullable_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."nullable_range"))
    ) end,
    'end',
    case when upper((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."nullable_range"))
    ) end
  ) end
) as "nullableRange",
to_json(
  case when ((__local_0__."numrange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."numrange"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."numrange"))
    ) end,
    'end',
    case when upper((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."numrange"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."numrange"))
    ) end
  ) end
) as "numrange",
to_json(
  case when ((__local_0__."daterange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      lower((__local_0__."daterange")),
      'inclusive',
      lower_inc((__local_0__."daterange"))
    ) end,
    'end',
    case when upper((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      upper((__local_0__."daterange")),
      'inclusive',
      upper_inc((__local_0__."daterange"))
    ) end
  ) end
) as "daterange",
to_json(
  case when ((__local_0__."an_int_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      lower((__local_0__."an_int_range")),
      'inclusive',
      lower_inc((__local_0__."an_int_range"))
    ) end,
    'end',
    case when upper((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      upper((__local_0__."an_int_range")),
      'inclusive',
      upper_inc((__local_0__."an_int_range"))
    ) end
  ) end
) as "anIntRange",
to_json((__local_0__."timestamp")) as "timestamp",
to_json((__local_0__."timestamptz")) as "timestamptz",
to_json((__local_0__."date")) as "date",
to_json((__local_0__."time")) as "time",
to_json((__local_0__."timetz")) as "timetz",
to_json(
  ((__local_0__."interval"))::text
) as "interval",
to_json(
  (
    case when (__local_0__."interval_array") is null then null when coalesce(
      array_length(
        (__local_0__."interval_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(
        (__local_3__)::text
      )
      from unnest((__local_0__."interval_array")) as __local_3__
    ) end
  )
) as "intervalArray",
to_json(
  ((__local_0__."money"))::numeric::text
) as "money",
to_json(
  (
    case when (
      (__local_0__."compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."compound_type")."foo_bar"
      )
    ) end
  )
) as "compoundType",
to_json(
  (
    case when (
      (__local_0__."nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nestedCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."nullable_compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."nullable_compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."nullable_compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."nullable_compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."nullable_compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."nullable_compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."nullable_compound_type")."foo_bar"
      )
    ) end
  )
) as "nullableCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nullable_nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nullableNestedCompoundType",
to_json((__local_0__."point")) as "point",
to_json((__local_0__."nullablePoint")) as "nullablePoint",
to_json((__local_0__."inet")) as "inet",
to_json((__local_0__."cidr")) as "cidr",
to_json((__local_0__."macaddr")) as "macaddr",
to_json((__local_0__."regproc")) as "regproc",
to_json((__local_0__."regprocedure")) as "regprocedure",
to_json((__local_0__."regoper")) as "regoper",
to_json((__local_0__."regoperator")) as "regoperator",
to_json((__local_0__."regclass")) as "regclass",
to_json((__local_0__."regtype")) as "regtype",
to_json((__local_0__."regconfig")) as "regconfig",
to_json((__local_0__."regdictionary")) as "regdictionary",
to_json((__local_0__."text_array_domain")) as "textArrayDomain",
to_json(
  ((__local_0__."int8_array_domain"))::text[]
) as "int8ArrayDomain",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_4__."id"),
      'id'::text,
      (__local_4__."id"),
      'headline'::text,
      (__local_4__."headline")
    ) as object
    from "a"."post" as __local_4__
    where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
  )
) as "@postBySmallint",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_5__."id"),
      'id'::text,
      (__local_5__."id"),
      'headline'::text,
      (__local_5__."headline")
    ) as object
    from "a"."post" as __local_5__
    where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
  )
) as "@postById"
from "b"."type_function"(
  $1
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."smallint")) as "smallint",
to_json(
  ((__local_0__."bigint"))::text
) as "bigint",
to_json(
  ((__local_0__."numeric"))::text
) as "numeric",
to_json(
  ((__local_0__."decimal"))::text
) as "decimal",
to_json((__local_0__."boolean")) as "boolean",
to_json((__local_0__."varchar")) as "varchar",
to_json((__local_0__."enum")) as "enum",
to_json(
  (
    case when (__local_0__."enum_array") is null then null when coalesce(
      array_length(
        (__local_0__."enum_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_1__)
      from unnest((__local_0__."enum_array")) as __local_1__
    ) end
  )
) as "enumArray",
to_json((__local_0__."domain")) as "domain",
to_json((__local_0__."domain2")) as "domain2",
to_json(
  (
    case when (__local_0__."text_array") is null then null when coalesce(
      array_length(
        (__local_0__."text_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(__local_2__)
      from unnest((__local_0__."text_array")) as __local_2__
    ) end
  )
) as "textArray",
to_json((__local_0__."json")) as "json",
to_json((__local_0__."jsonb")) as "jsonb",
to_json(
  case when ((__local_0__."nullable_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."nullable_range"))
    ) end,
    'end',
    case when upper((__local_0__."nullable_range")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."nullable_range"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."nullable_range"))
    ) end
  ) end
) as "nullableRange",
to_json(
  case when ((__local_0__."numrange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        lower((__local_0__."numrange"))
      )::text,
      'inclusive',
      lower_inc((__local_0__."numrange"))
    ) end,
    'end',
    case when upper((__local_0__."numrange")) is null then null else json_build_object(
      'value',
      (
        upper((__local_0__."numrange"))
      )::text,
      'inclusive',
      upper_inc((__local_0__."numrange"))
    ) end
  ) end
) as "numrange",
to_json(
  case when ((__local_0__."daterange")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      lower((__local_0__."daterange")),
      'inclusive',
      lower_inc((__local_0__."daterange"))
    ) end,
    'end',
    case when upper((__local_0__."daterange")) is null then null else json_build_object(
      'value',
      upper((__local_0__."daterange")),
      'inclusive',
      upper_inc((__local_0__."daterange"))
    ) end
  ) end
) as "daterange",
to_json(
  case when ((__local_0__."an_int_range")) is null then null else json_build_object(
    'start',
    case when lower((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      lower((__local_0__."an_int_range")),
      'inclusive',
      lower_inc((__local_0__."an_int_range"))
    ) end,
    'end',
    case when upper((__local_0__."an_int_range")) is null then null else json_build_object(
      'value',
      upper((__local_0__."an_int_range")),
      'inclusive',
      upper_inc((__local_0__."an_int_range"))
    ) end
  ) end
) as "anIntRange",
to_json((__local_0__."timestamp")) as "timestamp",
to_json((__local_0__."timestamptz")) as "timestamptz",
to_json((__local_0__."date")) as "date",
to_json((__local_0__."time")) as "time",
to_json((__local_0__."timetz")) as "timetz",
to_json(
  ((__local_0__."interval"))::text
) as "interval",
to_json(
  (
    case when (__local_0__."interval_array") is null then null when coalesce(
      array_length(
        (__local_0__."interval_array"),
        1
      ),
      0
    ) = 0 then '[]'::json else (
      select json_agg(
        (__local_3__)::text
      )
      from unnest((__local_0__."interval_array")) as __local_3__
    ) end
  )
) as "intervalArray",
to_json(
  ((__local_0__."money"))::numeric::text
) as "money",
to_json(
  (
    case when (
      (__local_0__."compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."compound_type")."foo_bar"
      )
    ) end
  )
) as "compoundType",
to_json(
  (
    case when (
      (__local_0__."nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nestedCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        (__local_0__."nullable_compound_type")."a"
      ),
      'b'::text,
      (
        (__local_0__."nullable_compound_type")."b"
      ),
      'c'::text,
      (
        (__local_0__."nullable_compound_type")."c"
      ),
      'd'::text,
      (
        (__local_0__."nullable_compound_type")."d"
      ),
      'e'::text,
      (
        (__local_0__."nullable_compound_type")."e"
      ),
      'f'::text,
      (
        (__local_0__."nullable_compound_type")."f"
      ),
      'fooBar'::text,
      (
        (__local_0__."nullable_compound_type")."foo_bar"
      )
    ) end
  )
) as "nullableCompoundType",
to_json(
  (
    case when (
      (__local_0__."nullable_nested_compound_type") is not distinct
      from null
    ) then null else json_build_object(
      'a'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."a"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."a"
            )."foo_bar"
          )
        ) end
      ),
      'b'::text,
      (
        case when (
          (
            (__local_0__."nullable_nested_compound_type")."b"
          ) is not distinct
          from null
        ) then null else json_build_object(
          'a'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."a"
          ),
          'b'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."b"
          ),
          'c'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."c"
          ),
          'd'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."d"
          ),
          'e'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."e"
          ),
          'f'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."f"
          ),
          'fooBar'::text,
          (
            (
              (__local_0__."nullable_nested_compound_type")."b"
            )."foo_bar"
          )
        ) end
      ),
      'bazBuz'::text,
      (
        (__local_0__."nullable_nested_compound_type")."baz_buz"
      )
    ) end
  )
) as "nullableNestedCompoundType",
to_json((__local_0__."point")) as "point",
to_json((__local_0__."nullablePoint")) as "nullablePoint",
to_json((__local_0__."inet")) as "inet",
to_json((__local_0__."cidr")) as "cidr",
to_json((__local_0__."macaddr")) as "macaddr",
to_json((__local_0__."regproc")) as "regproc",
to_json((__local_0__."regprocedure")) as "regprocedure",
to_json((__local_0__."regoper")) as "regoper",
to_json((__local_0__."regoperator")) as "regoperator",
to_json((__local_0__."regclass")) as "regclass",
to_json((__local_0__."regtype")) as "regtype",
to_json((__local_0__."regconfig")) as "regconfig",
to_json((__local_0__."regdictionary")) as "regdictionary",
to_json((__local_0__."text_array_domain")) as "textArrayDomain",
to_json(
  ((__local_0__."int8_array_domain"))::text[]
) as "int8ArrayDomain",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_4__."id"),
      'id'::text,
      (__local_4__."id"),
      'headline'::text,
      (__local_4__."headline")
    ) as object
    from "a"."post" as __local_4__
    where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
  )
) as "@postBySmallint",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_5__."id"),
      'id'::text,
      (__local_5__."id"),
      'headline'::text,
      (__local_5__."headline")
    ) as object
    from "a"."post" as __local_5__
    where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
  )
) as "@postById"
from unnest(
  "b"."type_function_list"( )
) as __local_0__
where (TRUE) and (TRUE)

with __local_0__ as (
  select to_json(
    (
      json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'smallint'::text,
        (__local_1__."smallint"),
        'bigint'::text,
        ((__local_1__."bigint"))::text,
        'numeric'::text,
        ((__local_1__."numeric"))::text,
        'decimal'::text,
        ((__local_1__."decimal"))::text,
        'boolean'::text,
        (__local_1__."boolean"),
        'varchar'::text,
        (__local_1__."varchar"),
        'enum'::text,
        (__local_1__."enum"),
        'enumArray'::text,
        (
          case when (__local_1__."enum_array") is null then null when coalesce(
            array_length(
              (__local_1__."enum_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_2__)
            from unnest((__local_1__."enum_array")) as __local_2__
          ) end
        ),
        'domain'::text,
        (__local_1__."domain"),
        'domain2'::text,
        (__local_1__."domain2"),
        'textArray'::text,
        (
          case when (__local_1__."text_array") is null then null when coalesce(
            array_length(
              (__local_1__."text_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_3__)
            from unnest((__local_1__."text_array")) as __local_3__
          ) end
        ),
        'json'::text,
        (__local_1__."json"),
        'jsonb'::text,
        (__local_1__."jsonb"),
        'nullableRange'::text,
        case when ((__local_1__."nullable_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."nullable_range"))
          ) end,
          'end',
          case when upper((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."nullable_range"))
          ) end
        ) end,
        'numrange'::text,
        case when ((__local_1__."numrange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."numrange"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."numrange"))
          ) end,
          'end',
          case when upper((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."numrange"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."numrange"))
          ) end
        ) end,
        'daterange'::text,
        case when ((__local_1__."daterange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            lower((__local_1__."daterange")),
            'inclusive',
            lower_inc((__local_1__."daterange"))
          ) end,
          'end',
          case when upper((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            upper((__local_1__."daterange")),
            'inclusive',
            upper_inc((__local_1__."daterange"))
          ) end
        ) end,
        'anIntRange'::text,
        case when ((__local_1__."an_int_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            lower((__local_1__."an_int_range")),
            'inclusive',
            lower_inc((__local_1__."an_int_range"))
          ) end,
          'end',
          case when upper((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            upper((__local_1__."an_int_range")),
            'inclusive',
            upper_inc((__local_1__."an_int_range"))
          ) end
        ) end,
        'timestamp'::text,
        (__local_1__."timestamp"),
        'timestamptz'::text,
        (__local_1__."timestamptz"),
        'date'::text,
        (__local_1__."date"),
        'time'::text,
        (__local_1__."time"),
        'timetz'::text,
        (__local_1__."timetz"),
        'interval'::text,
        ((__local_1__."interval"))::text,
        'intervalArray'::text,
        (
          case when (__local_1__."interval_array") is null then null when coalesce(
            array_length(
              (__local_1__."interval_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(
              (__local_4__)::text
            )
            from unnest((__local_1__."interval_array")) as __local_4__
          ) end
        ),
        'money'::text,
        ((__local_1__."money"))::numeric::text,
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
            'b'::text,
            (
              (__local_1__."compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nested_compound_type")."baz_buz"
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
            'b'::text,
            (
              (__local_1__."nullable_compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."nullable_compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."nullable_compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."nullable_compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."nullable_compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."nullable_compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nullable_nested_compound_type")."baz_buz"
            )
          ) end
        ),
        'point'::text,
        (__local_1__."point"),
        'nullablePoint'::text,
        (__local_1__."nullablePoint"),
        'inet'::text,
        (__local_1__."inet"),
        'cidr'::text,
        (__local_1__."cidr"),
        'macaddr'::text,
        (__local_1__."macaddr"),
        'regproc'::text,
        (__local_1__."regproc"),
        'regprocedure'::text,
        (__local_1__."regprocedure"),
        'regoper'::text,
        (__local_1__."regoper"),
        'regoperator'::text,
        (__local_1__."regoperator"),
        'regclass'::text,
        (__local_1__."regclass"),
        'regtype'::text,
        (__local_1__."regtype"),
        'regconfig'::text,
        (__local_1__."regconfig"),
        'regdictionary'::text,
        (__local_1__."regdictionary"),
        'textArrayDomain'::text,
        (__local_1__."text_array_domain"),
        'int8ArrayDomain'::text,
        ((__local_1__."int8_array_domain"))::text[],
        '@postBySmallint'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_5__."id"),
            'id'::text,
            (__local_5__."id"),
            'headline'::text,
            (__local_5__."headline")
          ) as object
          from "a"."post" as __local_5__
          where (__local_1__."smallint" = __local_5__."id") and (TRUE) and (TRUE)
        ),
        '@postById'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_6__."id"),
            'id'::text,
            (__local_6__."id"),
            'headline'::text,
            (__local_6__."headline")
          ) as object
          from "a"."post" as __local_6__
          where (__local_1__."id" = __local_6__."id") and (TRUE) and (TRUE)
        )
      )
    )
  ) as "@nodes",
  to_json(
    (
      json_build_object(
        '@node'::text,
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_1__."id"),
            'id'::text,
            (__local_1__."id"),
            'smallint'::text,
            (__local_1__."smallint"),
            'bigint'::text,
            ((__local_1__."bigint"))::text,
            'numeric'::text,
            ((__local_1__."numeric"))::text,
            'decimal'::text,
            ((__local_1__."decimal"))::text,
            'boolean'::text,
            (__local_1__."boolean"),
            'varchar'::text,
            (__local_1__."varchar"),
            'enum'::text,
            (__local_1__."enum"),
            'enumArray'::text,
            (
              case when (__local_1__."enum_array") is null then null when coalesce(
                array_length(
                  (__local_1__."enum_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_7__)
                from unnest((__local_1__."enum_array")) as __local_7__
              ) end
            ),
            'domain'::text,
            (__local_1__."domain"),
            'domain2'::text,
            (__local_1__."domain2"),
            'textArray'::text,
            (
              case when (__local_1__."text_array") is null then null when coalesce(
                array_length(
                  (__local_1__."text_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_8__)
                from unnest((__local_1__."text_array")) as __local_8__
              ) end
            ),
            'json'::text,
            (__local_1__."json"),
            'jsonb'::text,
            (__local_1__."jsonb"),
            'nullableRange'::text,
            case when ((__local_1__."nullable_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_1__."nullable_range"))
                )::text,
                'inclusive',
                lower_inc((__local_1__."nullable_range"))
              ) end,
              'end',
              case when upper((__local_1__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_1__."nullable_range"))
                )::text,
                'inclusive',
                upper_inc((__local_1__."nullable_range"))
              ) end
            ) end,
            'numrange'::text,
            case when ((__local_1__."numrange")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."numrange")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_1__."numrange"))
                )::text,
                'inclusive',
                lower_inc((__local_1__."numrange"))
              ) end,
              'end',
              case when upper((__local_1__."numrange")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_1__."numrange"))
                )::text,
                'inclusive',
                upper_inc((__local_1__."numrange"))
              ) end
            ) end,
            'daterange'::text,
            case when ((__local_1__."daterange")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."daterange")) is null then null else json_build_object(
                'value',
                lower((__local_1__."daterange")),
                'inclusive',
                lower_inc((__local_1__."daterange"))
              ) end,
              'end',
              case when upper((__local_1__."daterange")) is null then null else json_build_object(
                'value',
                upper((__local_1__."daterange")),
                'inclusive',
                upper_inc((__local_1__."daterange"))
              ) end
            ) end,
            'anIntRange'::text,
            case when ((__local_1__."an_int_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_1__."an_int_range")) is null then null else json_build_object(
                'value',
                lower((__local_1__."an_int_range")),
                'inclusive',
                lower_inc((__local_1__."an_int_range"))
              ) end,
              'end',
              case when upper((__local_1__."an_int_range")) is null then null else json_build_object(
                'value',
                upper((__local_1__."an_int_range")),
                'inclusive',
                upper_inc((__local_1__."an_int_range"))
              ) end
            ) end,
            'timestamp'::text,
            (__local_1__."timestamp"),
            'timestamptz'::text,
            (__local_1__."timestamptz"),
            'date'::text,
            (__local_1__."date"),
            'time'::text,
            (__local_1__."time"),
            'timetz'::text,
            (__local_1__."timetz"),
            'interval'::text,
            ((__local_1__."interval"))::text,
            'intervalArray'::text,
            (
              case when (__local_1__."interval_array") is null then null when coalesce(
                array_length(
                  (__local_1__."interval_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(
                  (__local_9__)::text
                )
                from unnest((__local_1__."interval_array")) as __local_9__
              ) end
            ),
            'money'::text,
            ((__local_1__."money"))::numeric::text,
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
                'b'::text,
                (
                  (__local_1__."compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_1__."compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_1__."compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_1__."compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_1__."compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_1__."compound_type")."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."a"
                      )."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_1__."nested_compound_type")."baz_buz"
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
                'b'::text,
                (
                  (__local_1__."nullable_compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_1__."nullable_compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_1__."nullable_compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_1__."nullable_compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_1__."nullable_compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_1__."nullable_compound_type")."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."a"
                      )."foo_bar"
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
                    'b'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_1__."nullable_nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_1__."nullable_nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'point'::text,
            (__local_1__."point"),
            'nullablePoint'::text,
            (__local_1__."nullablePoint"),
            'inet'::text,
            (__local_1__."inet"),
            'cidr'::text,
            (__local_1__."cidr"),
            'macaddr'::text,
            (__local_1__."macaddr"),
            'regproc'::text,
            (__local_1__."regproc"),
            'regprocedure'::text,
            (__local_1__."regprocedure"),
            'regoper'::text,
            (__local_1__."regoper"),
            'regoperator'::text,
            (__local_1__."regoperator"),
            'regclass'::text,
            (__local_1__."regclass"),
            'regtype'::text,
            (__local_1__."regtype"),
            'regconfig'::text,
            (__local_1__."regconfig"),
            'regdictionary'::text,
            (__local_1__."regdictionary"),
            'textArrayDomain'::text,
            (__local_1__."text_array_domain"),
            'int8ArrayDomain'::text,
            ((__local_1__."int8_array_domain"))::text[],
            '@postBySmallint'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_10__."id"),
                'id'::text,
                (__local_10__."id"),
                'headline'::text,
                (__local_10__."headline")
              ) as object
              from "a"."post" as __local_10__
              where (__local_1__."smallint" = __local_10__."id") and (TRUE) and (TRUE)
            ),
            '@postById'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_11__."id"),
                'id'::text,
                (__local_11__."id"),
                'headline'::text,
                (__local_11__."headline")
              ) as object
              from "a"."post" as __local_11__
              where (__local_1__."id" = __local_11__."id") and (TRUE) and (TRUE)
            )
          )
        )
      )
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
  from "b"."type_function_connection"( ) as __local_1__
  where (TRUE) and (TRUE)
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
) as "data",
false as "hasNextPage",
false as "hasPreviousPage",
(
  select json_build_object(
    'totalCount'::text,
    count(1)
  )
  from "b"."type_function_connection"( ) as __local_1__
  where 1 = 1
) as "aggregates"

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json(
  (
    select (
      case when (__local_1__ is null) then null else json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'smallint'::text,
        (__local_1__."smallint"),
        'bigint'::text,
        ((__local_1__."bigint"))::text,
        'numeric'::text,
        ((__local_1__."numeric"))::text,
        'decimal'::text,
        ((__local_1__."decimal"))::text,
        'boolean'::text,
        (__local_1__."boolean"),
        'varchar'::text,
        (__local_1__."varchar"),
        'enum'::text,
        (__local_1__."enum"),
        'enumArray'::text,
        (
          case when (__local_1__."enum_array") is null then null when coalesce(
            array_length(
              (__local_1__."enum_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_2__)
            from unnest((__local_1__."enum_array")) as __local_2__
          ) end
        ),
        'domain'::text,
        (__local_1__."domain"),
        'domain2'::text,
        (__local_1__."domain2"),
        'textArray'::text,
        (
          case when (__local_1__."text_array") is null then null when coalesce(
            array_length(
              (__local_1__."text_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_3__)
            from unnest((__local_1__."text_array")) as __local_3__
          ) end
        ),
        'json'::text,
        (__local_1__."json"),
        'jsonb'::text,
        (__local_1__."jsonb"),
        'nullableRange'::text,
        case when ((__local_1__."nullable_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."nullable_range"))
          ) end,
          'end',
          case when upper((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."nullable_range"))
          ) end
        ) end,
        'numrange'::text,
        case when ((__local_1__."numrange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."numrange"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."numrange"))
          ) end,
          'end',
          case when upper((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."numrange"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."numrange"))
          ) end
        ) end,
        'daterange'::text,
        case when ((__local_1__."daterange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            lower((__local_1__."daterange")),
            'inclusive',
            lower_inc((__local_1__."daterange"))
          ) end,
          'end',
          case when upper((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            upper((__local_1__."daterange")),
            'inclusive',
            upper_inc((__local_1__."daterange"))
          ) end
        ) end,
        'anIntRange'::text,
        case when ((__local_1__."an_int_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            lower((__local_1__."an_int_range")),
            'inclusive',
            lower_inc((__local_1__."an_int_range"))
          ) end,
          'end',
          case when upper((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            upper((__local_1__."an_int_range")),
            'inclusive',
            upper_inc((__local_1__."an_int_range"))
          ) end
        ) end,
        'timestamp'::text,
        (__local_1__."timestamp"),
        'timestamptz'::text,
        (__local_1__."timestamptz"),
        'date'::text,
        (__local_1__."date"),
        'time'::text,
        (__local_1__."time"),
        'timetz'::text,
        (__local_1__."timetz"),
        'interval'::text,
        ((__local_1__."interval"))::text,
        'intervalArray'::text,
        (
          case when (__local_1__."interval_array") is null then null when coalesce(
            array_length(
              (__local_1__."interval_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(
              (__local_4__)::text
            )
            from unnest((__local_1__."interval_array")) as __local_4__
          ) end
        ),
        'money'::text,
        ((__local_1__."money"))::numeric::text,
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
            'b'::text,
            (
              (__local_1__."compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nested_compound_type")."baz_buz"
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
            'b'::text,
            (
              (__local_1__."nullable_compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."nullable_compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."nullable_compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."nullable_compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."nullable_compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."nullable_compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nullable_nested_compound_type")."baz_buz"
            )
          ) end
        ),
        'point'::text,
        (__local_1__."point"),
        'nullablePoint'::text,
        (__local_1__."nullablePoint"),
        'inet'::text,
        (__local_1__."inet"),
        'cidr'::text,
        (__local_1__."cidr"),
        'macaddr'::text,
        (__local_1__."macaddr"),
        'regproc'::text,
        (__local_1__."regproc"),
        'regprocedure'::text,
        (__local_1__."regprocedure"),
        'regoper'::text,
        (__local_1__."regoper"),
        'regoperator'::text,
        (__local_1__."regoperator"),
        'regclass'::text,
        (__local_1__."regclass"),
        'regtype'::text,
        (__local_1__."regtype"),
        'regconfig'::text,
        (__local_1__."regconfig"),
        'regdictionary'::text,
        (__local_1__."regdictionary"),
        'textArrayDomain'::text,
        (__local_1__."text_array_domain"),
        'int8ArrayDomain'::text,
        ((__local_1__."int8_array_domain"))::text[],
        '@postBySmallint'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_5__."id"),
            'id'::text,
            (__local_5__."id"),
            'headline'::text,
            (__local_5__."headline")
          ) as object
          from "a"."post" as __local_5__
          where (__local_1__."smallint" = __local_5__."id") and (TRUE) and (TRUE)
        ),
        '@postById'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_6__."id"),
            'id'::text,
            (__local_6__."id"),
            'headline'::text,
            (__local_6__."headline")
          ) as object
          from "a"."post" as __local_6__
          where (__local_1__."id" = __local_6__."id") and (TRUE) and (TRUE)
        )
      ) end
    ) as object
    from "c"."person_type_function"(
      __local_0__,
      $1
    ) as __local_1__
    where (
      not (__local_1__ is null)
    ) and (TRUE) and (TRUE)
  )
) as "@typeFunction",
to_json(
  (
    select coalesce(
      (
        select json_agg(__local_7__."object")
        from (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_8__."id"),
            'id'::text,
            (__local_8__."id"),
            'smallint'::text,
            (__local_8__."smallint"),
            'bigint'::text,
            ((__local_8__."bigint"))::text,
            'numeric'::text,
            ((__local_8__."numeric"))::text,
            'decimal'::text,
            ((__local_8__."decimal"))::text,
            'boolean'::text,
            (__local_8__."boolean"),
            'varchar'::text,
            (__local_8__."varchar"),
            'enum'::text,
            (__local_8__."enum"),
            'enumArray'::text,
            (
              case when (__local_8__."enum_array") is null then null when coalesce(
                array_length(
                  (__local_8__."enum_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_9__)
                from unnest((__local_8__."enum_array")) as __local_9__
              ) end
            ),
            'domain'::text,
            (__local_8__."domain"),
            'domain2'::text,
            (__local_8__."domain2"),
            'textArray'::text,
            (
              case when (__local_8__."text_array") is null then null when coalesce(
                array_length(
                  (__local_8__."text_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_10__)
                from unnest((__local_8__."text_array")) as __local_10__
              ) end
            ),
            'json'::text,
            (__local_8__."json"),
            'jsonb'::text,
            (__local_8__."jsonb"),
            'nullableRange'::text,
            case when ((__local_8__."nullable_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_8__."nullable_range"))
                )::text,
                'inclusive',
                lower_inc((__local_8__."nullable_range"))
              ) end,
              'end',
              case when upper((__local_8__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_8__."nullable_range"))
                )::text,
                'inclusive',
                upper_inc((__local_8__."nullable_range"))
              ) end
            ) end,
            'numrange'::text,
            case when ((__local_8__."numrange")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."numrange")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_8__."numrange"))
                )::text,
                'inclusive',
                lower_inc((__local_8__."numrange"))
              ) end,
              'end',
              case when upper((__local_8__."numrange")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_8__."numrange"))
                )::text,
                'inclusive',
                upper_inc((__local_8__."numrange"))
              ) end
            ) end,
            'daterange'::text,
            case when ((__local_8__."daterange")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."daterange")) is null then null else json_build_object(
                'value',
                lower((__local_8__."daterange")),
                'inclusive',
                lower_inc((__local_8__."daterange"))
              ) end,
              'end',
              case when upper((__local_8__."daterange")) is null then null else json_build_object(
                'value',
                upper((__local_8__."daterange")),
                'inclusive',
                upper_inc((__local_8__."daterange"))
              ) end
            ) end,
            'anIntRange'::text,
            case when ((__local_8__."an_int_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."an_int_range")) is null then null else json_build_object(
                'value',
                lower((__local_8__."an_int_range")),
                'inclusive',
                lower_inc((__local_8__."an_int_range"))
              ) end,
              'end',
              case when upper((__local_8__."an_int_range")) is null then null else json_build_object(
                'value',
                upper((__local_8__."an_int_range")),
                'inclusive',
                upper_inc((__local_8__."an_int_range"))
              ) end
            ) end,
            'timestamp'::text,
            (__local_8__."timestamp"),
            'timestamptz'::text,
            (__local_8__."timestamptz"),
            'date'::text,
            (__local_8__."date"),
            'time'::text,
            (__local_8__."time"),
            'timetz'::text,
            (__local_8__."timetz"),
            'interval'::text,
            ((__local_8__."interval"))::text,
            'intervalArray'::text,
            (
              case when (__local_8__."interval_array") is null then null when coalesce(
                array_length(
                  (__local_8__."interval_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(
                  (__local_11__)::text
                )
                from unnest((__local_8__."interval_array")) as __local_11__
              ) end
            ),
            'money'::text,
            ((__local_8__."money"))::numeric::text,
            'compoundType'::text,
            (
              case when (
                (__local_8__."compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (__local_8__."compound_type")."a"
                ),
                'b'::text,
                (
                  (__local_8__."compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_8__."compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_8__."compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_8__."compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_8__."compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_8__."compound_type")."foo_bar"
                )
              ) end
            ),
            'nestedCompoundType'::text,
            (
              case when (
                (__local_8__."nested_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  case when (
                    (
                      (__local_8__."nested_compound_type")."a"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."foo_bar"
                    )
                  ) end
                ),
                'b'::text,
                (
                  case when (
                    (
                      (__local_8__."nested_compound_type")."b"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_8__."nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'nullableCompoundType'::text,
            (
              case when (
                (__local_8__."nullable_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (__local_8__."nullable_compound_type")."a"
                ),
                'b'::text,
                (
                  (__local_8__."nullable_compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_8__."nullable_compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_8__."nullable_compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_8__."nullable_compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_8__."nullable_compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_8__."nullable_compound_type")."foo_bar"
                )
              ) end
            ),
            'nullableNestedCompoundType'::text,
            (
              case when (
                (__local_8__."nullable_nested_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  case when (
                    (
                      (__local_8__."nullable_nested_compound_type")."a"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."foo_bar"
                    )
                  ) end
                ),
                'b'::text,
                (
                  case when (
                    (
                      (__local_8__."nullable_nested_compound_type")."b"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_8__."nullable_nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'point'::text,
            (__local_8__."point"),
            'nullablePoint'::text,
            (__local_8__."nullablePoint"),
            'inet'::text,
            (__local_8__."inet"),
            'cidr'::text,
            (__local_8__."cidr"),
            'macaddr'::text,
            (__local_8__."macaddr"),
            'regproc'::text,
            (__local_8__."regproc"),
            'regprocedure'::text,
            (__local_8__."regprocedure"),
            'regoper'::text,
            (__local_8__."regoper"),
            'regoperator'::text,
            (__local_8__."regoperator"),
            'regclass'::text,
            (__local_8__."regclass"),
            'regtype'::text,
            (__local_8__."regtype"),
            'regconfig'::text,
            (__local_8__."regconfig"),
            'regdictionary'::text,
            (__local_8__."regdictionary"),
            'textArrayDomain'::text,
            (__local_8__."text_array_domain"),
            'int8ArrayDomain'::text,
            ((__local_8__."int8_array_domain"))::text[],
            '@postBySmallint'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_12__."id"),
                'id'::text,
                (__local_12__."id"),
                'headline'::text,
                (__local_12__."headline")
              ) as object
              from "a"."post" as __local_12__
              where (__local_8__."smallint" = __local_12__."id") and (TRUE) and (TRUE)
            ),
            '@postById'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_13__."id"),
                'id'::text,
                (__local_13__."id"),
                'headline'::text,
                (__local_13__."headline")
              ) as object
              from "a"."post" as __local_13__
              where (__local_8__."id" = __local_13__."id") and (TRUE) and (TRUE)
            )
          ) as object
          from unnest(
            "c"."person_type_function_list"(__local_0__)
          ) as __local_8__
          where (TRUE) and (TRUE)
        ) as __local_7__
      ),
      '[]'::json
    )
  )
) as "@typeFunctionList",
to_json(
  (
    with __local_14__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_15__."id"),
            'id'::text,
            (__local_15__."id"),
            'smallint'::text,
            (__local_15__."smallint"),
            'bigint'::text,
            ((__local_15__."bigint"))::text,
            'numeric'::text,
            ((__local_15__."numeric"))::text,
            'decimal'::text,
            ((__local_15__."decimal"))::text,
            'boolean'::text,
            (__local_15__."boolean"),
            'varchar'::text,
            (__local_15__."varchar"),
            'enum'::text,
            (__local_15__."enum"),
            'enumArray'::text,
            (
              case when (__local_15__."enum_array") is null then null when coalesce(
                array_length(
                  (__local_15__."enum_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_16__)
                from unnest((__local_15__."enum_array")) as __local_16__
              ) end
            ),
            'domain'::text,
            (__local_15__."domain"),
            'domain2'::text,
            (__local_15__."domain2"),
            'textArray'::text,
            (
              case when (__local_15__."text_array") is null then null when coalesce(
                array_length(
                  (__local_15__."text_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_17__)
                from unnest((__local_15__."text_array")) as __local_17__
              ) end
            ),
            'json'::text,
            (__local_15__."json"),
            'jsonb'::text,
            (__local_15__."jsonb"),
            'nullableRange'::text,
            case when ((__local_15__."nullable_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_15__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_15__."nullable_range"))
                )::text,
                'inclusive',
                lower_inc((__local_15__."nullable_range"))
              ) end,
              'end',
              case when upper((__local_15__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_15__."nullable_range"))
                )::text,
                'inclusive',
                upper_inc((__local_15__."nullable_range"))
              ) end
            ) end,
            'numrange'::text,
            case when ((__local_15__."numrange")) is null then null else json_build_object(
              'start',
              case when lower((__local_15__."numrange")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_15__."numrange"))
                )::text,
                'inclusive',
                lower_inc((__local_15__."numrange"))
              ) end,
              'end',
              case when upper((__local_15__."numrange")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_15__."numrange"))
                )::text,
                'inclusive',
                upper_inc((__local_15__."numrange"))
              ) end
            ) end,
            'daterange'::text,
            case when ((__local_15__."daterange")) is null then null else json_build_object(
              'start',
              case when lower((__local_15__."daterange")) is null then null else json_build_object(
                'value',
                lower((__local_15__."daterange")),
                'inclusive',
                lower_inc((__local_15__."daterange"))
              ) end,
              'end',
              case when upper((__local_15__."daterange")) is null then null else json_build_object(
                'value',
                upper((__local_15__."daterange")),
                'inclusive',
                upper_inc((__local_15__."daterange"))
              ) end
            ) end,
            'anIntRange'::text,
            case when ((__local_15__."an_int_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_15__."an_int_range")) is null then null else json_build_object(
                'value',
                lower((__local_15__."an_int_range")),
                'inclusive',
                lower_inc((__local_15__."an_int_range"))
              ) end,
              'end',
              case when upper((__local_15__."an_int_range")) is null then null else json_build_object(
                'value',
                upper((__local_15__."an_int_range")),
                'inclusive',
                upper_inc((__local_15__."an_int_range"))
              ) end
            ) end,
            'timestamp'::text,
            (__local_15__."timestamp"),
            'timestamptz'::text,
            (__local_15__."timestamptz"),
            'date'::text,
            (__local_15__."date"),
            'time'::text,
            (__local_15__."time"),
            'timetz'::text,
            (__local_15__."timetz"),
            'interval'::text,
            ((__local_15__."interval"))::text,
            'intervalArray'::text,
            (
              case when (__local_15__."interval_array") is null then null when coalesce(
                array_length(
                  (__local_15__."interval_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(
                  (__local_18__)::text
                )
                from unnest((__local_15__."interval_array")) as __local_18__
              ) end
            ),
            'money'::text,
            ((__local_15__."money"))::numeric::text,
            'compoundType'::text,
            (
              case when (
                (__local_15__."compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (__local_15__."compound_type")."a"
                ),
                'b'::text,
                (
                  (__local_15__."compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_15__."compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_15__."compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_15__."compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_15__."compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_15__."compound_type")."foo_bar"
                )
              ) end
            ),
            'nestedCompoundType'::text,
            (
              case when (
                (__local_15__."nested_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  case when (
                    (
                      (__local_15__."nested_compound_type")."a"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."a"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."a"
                      )."foo_bar"
                    )
                  ) end
                ),
                'b'::text,
                (
                  case when (
                    (
                      (__local_15__."nested_compound_type")."b"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."b"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_15__."nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_15__."nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'nullableCompoundType'::text,
            (
              case when (
                (__local_15__."nullable_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (__local_15__."nullable_compound_type")."a"
                ),
                'b'::text,
                (
                  (__local_15__."nullable_compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_15__."nullable_compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_15__."nullable_compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_15__."nullable_compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_15__."nullable_compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_15__."nullable_compound_type")."foo_bar"
                )
              ) end
            ),
            'nullableNestedCompoundType'::text,
            (
              case when (
                (__local_15__."nullable_nested_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  case when (
                    (
                      (__local_15__."nullable_nested_compound_type")."a"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."a"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."a"
                      )."foo_bar"
                    )
                  ) end
                ),
                'b'::text,
                (
                  case when (
                    (
                      (__local_15__."nullable_nested_compound_type")."b"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."b"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_15__."nullable_nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_15__."nullable_nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'point'::text,
            (__local_15__."point"),
            'nullablePoint'::text,
            (__local_15__."nullablePoint"),
            'inet'::text,
            (__local_15__."inet"),
            'cidr'::text,
            (__local_15__."cidr"),
            'macaddr'::text,
            (__local_15__."macaddr"),
            'regproc'::text,
            (__local_15__."regproc"),
            'regprocedure'::text,
            (__local_15__."regprocedure"),
            'regoper'::text,
            (__local_15__."regoper"),
            'regoperator'::text,
            (__local_15__."regoperator"),
            'regclass'::text,
            (__local_15__."regclass"),
            'regtype'::text,
            (__local_15__."regtype"),
            'regconfig'::text,
            (__local_15__."regconfig"),
            'regdictionary'::text,
            (__local_15__."regdictionary"),
            'textArrayDomain'::text,
            (__local_15__."text_array_domain"),
            'int8ArrayDomain'::text,
            ((__local_15__."int8_array_domain"))::text[],
            '@postBySmallint'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_19__."id"),
                'id'::text,
                (__local_19__."id"),
                'headline'::text,
                (__local_19__."headline")
              ) as object
              from "a"."post" as __local_19__
              where (__local_15__."smallint" = __local_19__."id") and (TRUE) and (TRUE)
            ),
            '@postById'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_20__."id"),
                'id'::text,
                (__local_20__."id"),
                'headline'::text,
                (__local_20__."headline")
              ) as object
              from "a"."post" as __local_20__
              where (__local_15__."id" = __local_20__."id") and (TRUE) and (TRUE)
            )
          )
        )
      ) as "@nodes",
      to_json(
        (
          json_build_object(
            '@node'::text,
            (
              json_build_object(
                '__identifiers'::text,
                json_build_array(__local_15__."id"),
                'id'::text,
                (__local_15__."id"),
                'smallint'::text,
                (__local_15__."smallint"),
                'bigint'::text,
                ((__local_15__."bigint"))::text,
                'numeric'::text,
                ((__local_15__."numeric"))::text,
                'decimal'::text,
                ((__local_15__."decimal"))::text,
                'boolean'::text,
                (__local_15__."boolean"),
                'varchar'::text,
                (__local_15__."varchar"),
                'enum'::text,
                (__local_15__."enum"),
                'enumArray'::text,
                (
                  case when (__local_15__."enum_array") is null then null when coalesce(
                    array_length(
                      (__local_15__."enum_array"),
                      1
                    ),
                    0
                  ) = 0 then '[]'::json else (
                    select json_agg(__local_21__)
                    from unnest((__local_15__."enum_array")) as __local_21__
                  ) end
                ),
                'domain'::text,
                (__local_15__."domain"),
                'domain2'::text,
                (__local_15__."domain2"),
                'textArray'::text,
                (
                  case when (__local_15__."text_array") is null then null when coalesce(
                    array_length(
                      (__local_15__."text_array"),
                      1
                    ),
                    0
                  ) = 0 then '[]'::json else (
                    select json_agg(__local_22__)
                    from unnest((__local_15__."text_array")) as __local_22__
                  ) end
                ),
                'json'::text,
                (__local_15__."json"),
                'jsonb'::text,
                (__local_15__."jsonb"),
                'nullableRange'::text,
                case when ((__local_15__."nullable_range")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_15__."nullable_range")) is null then null else json_build_object(
                    'value',
                    (
                      lower((__local_15__."nullable_range"))
                    )::text,
                    'inclusive',
                    lower_inc((__local_15__."nullable_range"))
                  ) end,
                  'end',
                  case when upper((__local_15__."nullable_range")) is null then null else json_build_object(
                    'value',
                    (
                      upper((__local_15__."nullable_range"))
                    )::text,
                    'inclusive',
                    upper_inc((__local_15__."nullable_range"))
                  ) end
                ) end,
                'numrange'::text,
                case when ((__local_15__."numrange")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_15__."numrange")) is null then null else json_build_object(
                    'value',
                    (
                      lower((__local_15__."numrange"))
                    )::text,
                    'inclusive',
                    lower_inc((__local_15__."numrange"))
                  ) end,
                  'end',
                  case when upper((__local_15__."numrange")) is null then null else json_build_object(
                    'value',
                    (
                      upper((__local_15__."numrange"))
                    )::text,
                    'inclusive',
                    upper_inc((__local_15__."numrange"))
                  ) end
                ) end,
                'daterange'::text,
                case when ((__local_15__."daterange")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_15__."daterange")) is null then null else json_build_object(
                    'value',
                    lower((__local_15__."daterange")),
                    'inclusive',
                    lower_inc((__local_15__."daterange"))
                  ) end,
                  'end',
                  case when upper((__local_15__."daterange")) is null then null else json_build_object(
                    'value',
                    upper((__local_15__."daterange")),
                    'inclusive',
                    upper_inc((__local_15__."daterange"))
                  ) end
                ) end,
                'anIntRange'::text,
                case when ((__local_15__."an_int_range")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_15__."an_int_range")) is null then null else json_build_object(
                    'value',
                    lower((__local_15__."an_int_range")),
                    'inclusive',
                    lower_inc((__local_15__."an_int_range"))
                  ) end,
                  'end',
                  case when upper((__local_15__."an_int_range")) is null then null else json_build_object(
                    'value',
                    upper((__local_15__."an_int_range")),
                    'inclusive',
                    upper_inc((__local_15__."an_int_range"))
                  ) end
                ) end,
                'timestamp'::text,
                (__local_15__."timestamp"),
                'timestamptz'::text,
                (__local_15__."timestamptz"),
                'date'::text,
                (__local_15__."date"),
                'time'::text,
                (__local_15__."time"),
                'timetz'::text,
                (__local_15__."timetz"),
                'interval'::text,
                ((__local_15__."interval"))::text,
                'intervalArray'::text,
                (
                  case when (__local_15__."interval_array") is null then null when coalesce(
                    array_length(
                      (__local_15__."interval_array"),
                      1
                    ),
                    0
                  ) = 0 then '[]'::json else (
                    select json_agg(
                      (__local_23__)::text
                    )
                    from unnest((__local_15__."interval_array")) as __local_23__
                  ) end
                ),
                'money'::text,
                ((__local_15__."money"))::numeric::text,
                'compoundType'::text,
                (
                  case when (
                    (__local_15__."compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (__local_15__."compound_type")."a"
                    ),
                    'b'::text,
                    (
                      (__local_15__."compound_type")."b"
                    ),
                    'c'::text,
                    (
                      (__local_15__."compound_type")."c"
                    ),
                    'd'::text,
                    (
                      (__local_15__."compound_type")."d"
                    ),
                    'e'::text,
                    (
                      (__local_15__."compound_type")."e"
                    ),
                    'f'::text,
                    (
                      (__local_15__."compound_type")."f"
                    ),
                    'fooBar'::text,
                    (
                      (__local_15__."compound_type")."foo_bar"
                    )
                  ) end
                ),
                'nestedCompoundType'::text,
                (
                  case when (
                    (__local_15__."nested_compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      case when (
                        (
                          (__local_15__."nested_compound_type")."a"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."a"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."a"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."a"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."a"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."a"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."a"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."a"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'b'::text,
                    (
                      case when (
                        (
                          (__local_15__."nested_compound_type")."b"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."b"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."b"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."b"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."b"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."b"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."b"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_15__."nested_compound_type")."b"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'bazBuz'::text,
                    (
                      (__local_15__."nested_compound_type")."baz_buz"
                    )
                  ) end
                ),
                'nullableCompoundType'::text,
                (
                  case when (
                    (__local_15__."nullable_compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (__local_15__."nullable_compound_type")."a"
                    ),
                    'b'::text,
                    (
                      (__local_15__."nullable_compound_type")."b"
                    ),
                    'c'::text,
                    (
                      (__local_15__."nullable_compound_type")."c"
                    ),
                    'd'::text,
                    (
                      (__local_15__."nullable_compound_type")."d"
                    ),
                    'e'::text,
                    (
                      (__local_15__."nullable_compound_type")."e"
                    ),
                    'f'::text,
                    (
                      (__local_15__."nullable_compound_type")."f"
                    ),
                    'fooBar'::text,
                    (
                      (__local_15__."nullable_compound_type")."foo_bar"
                    )
                  ) end
                ),
                'nullableNestedCompoundType'::text,
                (
                  case when (
                    (__local_15__."nullable_nested_compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      case when (
                        (
                          (__local_15__."nullable_nested_compound_type")."a"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."a"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."a"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."a"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."a"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."a"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."a"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."a"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'b'::text,
                    (
                      case when (
                        (
                          (__local_15__."nullable_nested_compound_type")."b"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."b"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."b"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."b"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."b"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."b"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."b"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_15__."nullable_nested_compound_type")."b"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'bazBuz'::text,
                    (
                      (__local_15__."nullable_nested_compound_type")."baz_buz"
                    )
                  ) end
                ),
                'point'::text,
                (__local_15__."point"),
                'nullablePoint'::text,
                (__local_15__."nullablePoint"),
                'inet'::text,
                (__local_15__."inet"),
                'cidr'::text,
                (__local_15__."cidr"),
                'macaddr'::text,
                (__local_15__."macaddr"),
                'regproc'::text,
                (__local_15__."regproc"),
                'regprocedure'::text,
                (__local_15__."regprocedure"),
                'regoper'::text,
                (__local_15__."regoper"),
                'regoperator'::text,
                (__local_15__."regoperator"),
                'regclass'::text,
                (__local_15__."regclass"),
                'regtype'::text,
                (__local_15__."regtype"),
                'regconfig'::text,
                (__local_15__."regconfig"),
                'regdictionary'::text,
                (__local_15__."regdictionary"),
                'textArrayDomain'::text,
                (__local_15__."text_array_domain"),
                'int8ArrayDomain'::text,
                ((__local_15__."int8_array_domain"))::text[],
                '@postBySmallint'::text,
                (
                  select json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_24__."id"),
                    'id'::text,
                    (__local_24__."id"),
                    'headline'::text,
                    (__local_24__."headline")
                  ) as object
                  from "a"."post" as __local_24__
                  where (__local_15__."smallint" = __local_24__."id") and (TRUE) and (TRUE)
                ),
                '@postById'::text,
                (
                  select json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_25__."id"),
                    'id'::text,
                    (__local_25__."id"),
                    'headline'::text,
                    (__local_25__."headline")
                  ) as object
                  from "a"."post" as __local_25__
                  where (__local_15__."id" = __local_25__."id") and (TRUE) and (TRUE)
                )
              )
            )
          )
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
      from "c"."person_type_function_connection"(__local_0__) as __local_15__
      where (TRUE) and (TRUE)
    ),
    __local_26__ as (
      select json_agg(
        to_json(__local_14__)
      ) as data
      from __local_14__
    )
    select json_build_object(
      'data'::text,
      coalesce(
        (
          select __local_26__.data
          from __local_26__
        ),
        '[]'::json
      ),
      'hasNextPage'::text,
      false,
      'hasPreviousPage'::text,
      false,
      'aggregates'::text,
      (
        select json_build_object(
          'totalCount'::text,
          count(1)
        )
        from "c"."person_type_function_connection"(__local_0__) as __local_15__
        where 1 = 1
      )
    )
  )
) as "@typeFunctionConnection"
from "c"."person" as __local_0__
where (
  __local_0__."id" = $2
) and (TRUE) and (TRUE)

select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."headline")) as "headline",
to_json(
  (
    select (
      case when (__local_1__ is null) then null else json_build_object(
        '__identifiers'::text,
        json_build_array(__local_1__."id"),
        'id'::text,
        (__local_1__."id"),
        'smallint'::text,
        (__local_1__."smallint"),
        'bigint'::text,
        ((__local_1__."bigint"))::text,
        'numeric'::text,
        ((__local_1__."numeric"))::text,
        'decimal'::text,
        ((__local_1__."decimal"))::text,
        'boolean'::text,
        (__local_1__."boolean"),
        'varchar'::text,
        (__local_1__."varchar"),
        'enum'::text,
        (__local_1__."enum"),
        'enumArray'::text,
        (
          case when (__local_1__."enum_array") is null then null when coalesce(
            array_length(
              (__local_1__."enum_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_2__)
            from unnest((__local_1__."enum_array")) as __local_2__
          ) end
        ),
        'domain'::text,
        (__local_1__."domain"),
        'domain2'::text,
        (__local_1__."domain2"),
        'textArray'::text,
        (
          case when (__local_1__."text_array") is null then null when coalesce(
            array_length(
              (__local_1__."text_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(__local_3__)
            from unnest((__local_1__."text_array")) as __local_3__
          ) end
        ),
        'json'::text,
        (__local_1__."json"),
        'jsonb'::text,
        (__local_1__."jsonb"),
        'nullableRange'::text,
        case when ((__local_1__."nullable_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."nullable_range"))
          ) end,
          'end',
          case when upper((__local_1__."nullable_range")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."nullable_range"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."nullable_range"))
          ) end
        ) end,
        'numrange'::text,
        case when ((__local_1__."numrange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              lower((__local_1__."numrange"))
            )::text,
            'inclusive',
            lower_inc((__local_1__."numrange"))
          ) end,
          'end',
          case when upper((__local_1__."numrange")) is null then null else json_build_object(
            'value',
            (
              upper((__local_1__."numrange"))
            )::text,
            'inclusive',
            upper_inc((__local_1__."numrange"))
          ) end
        ) end,
        'daterange'::text,
        case when ((__local_1__."daterange")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            lower((__local_1__."daterange")),
            'inclusive',
            lower_inc((__local_1__."daterange"))
          ) end,
          'end',
          case when upper((__local_1__."daterange")) is null then null else json_build_object(
            'value',
            upper((__local_1__."daterange")),
            'inclusive',
            upper_inc((__local_1__."daterange"))
          ) end
        ) end,
        'anIntRange'::text,
        case when ((__local_1__."an_int_range")) is null then null else json_build_object(
          'start',
          case when lower((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            lower((__local_1__."an_int_range")),
            'inclusive',
            lower_inc((__local_1__."an_int_range"))
          ) end,
          'end',
          case when upper((__local_1__."an_int_range")) is null then null else json_build_object(
            'value',
            upper((__local_1__."an_int_range")),
            'inclusive',
            upper_inc((__local_1__."an_int_range"))
          ) end
        ) end,
        'timestamp'::text,
        (__local_1__."timestamp"),
        'timestamptz'::text,
        (__local_1__."timestamptz"),
        'date'::text,
        (__local_1__."date"),
        'time'::text,
        (__local_1__."time"),
        'timetz'::text,
        (__local_1__."timetz"),
        'interval'::text,
        ((__local_1__."interval"))::text,
        'intervalArray'::text,
        (
          case when (__local_1__."interval_array") is null then null when coalesce(
            array_length(
              (__local_1__."interval_array"),
              1
            ),
            0
          ) = 0 then '[]'::json else (
            select json_agg(
              (__local_4__)::text
            )
            from unnest((__local_1__."interval_array")) as __local_4__
          ) end
        ),
        'money'::text,
        ((__local_1__."money"))::numeric::text,
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
            'b'::text,
            (
              (__local_1__."compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nested_compound_type")."baz_buz"
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
            'b'::text,
            (
              (__local_1__."nullable_compound_type")."b"
            ),
            'c'::text,
            (
              (__local_1__."nullable_compound_type")."c"
            ),
            'd'::text,
            (
              (__local_1__."nullable_compound_type")."d"
            ),
            'e'::text,
            (
              (__local_1__."nullable_compound_type")."e"
            ),
            'f'::text,
            (
              (__local_1__."nullable_compound_type")."f"
            ),
            'fooBar'::text,
            (
              (__local_1__."nullable_compound_type")."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."a"
                  )."foo_bar"
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
                'b'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."b"
                ),
                'c'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."c"
                ),
                'd'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."d"
                ),
                'e'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."e"
                ),
                'f'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."f"
                ),
                'fooBar'::text,
                (
                  (
                    (__local_1__."nullable_nested_compound_type")."b"
                  )."foo_bar"
                )
              ) end
            ),
            'bazBuz'::text,
            (
              (__local_1__."nullable_nested_compound_type")."baz_buz"
            )
          ) end
        ),
        'point'::text,
        (__local_1__."point"),
        'nullablePoint'::text,
        (__local_1__."nullablePoint"),
        'inet'::text,
        (__local_1__."inet"),
        'cidr'::text,
        (__local_1__."cidr"),
        'macaddr'::text,
        (__local_1__."macaddr"),
        'regproc'::text,
        (__local_1__."regproc"),
        'regprocedure'::text,
        (__local_1__."regprocedure"),
        'regoper'::text,
        (__local_1__."regoper"),
        'regoperator'::text,
        (__local_1__."regoperator"),
        'regclass'::text,
        (__local_1__."regclass"),
        'regtype'::text,
        (__local_1__."regtype"),
        'regconfig'::text,
        (__local_1__."regconfig"),
        'regdictionary'::text,
        (__local_1__."regdictionary"),
        'textArrayDomain'::text,
        (__local_1__."text_array_domain"),
        'int8ArrayDomain'::text,
        ((__local_1__."int8_array_domain"))::text[],
        '@postBySmallint'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_5__."id"),
            'id'::text,
            (__local_5__."id"),
            'headline'::text,
            (__local_5__."headline")
          ) as object
          from "a"."post" as __local_5__
          where (__local_1__."smallint" = __local_5__."id") and (TRUE) and (TRUE)
        ),
        '@postById'::text,
        (
          select json_build_object(
            '__identifiers'::text,
            json_build_array(__local_6__."id"),
            'id'::text,
            (__local_6__."id"),
            'headline'::text,
            (__local_6__."headline")
          ) as object
          from "a"."post" as __local_6__
          where (__local_1__."id" = __local_6__."id") and (TRUE) and (TRUE)
        )
      ) end
    ) as object
    from "b"."types" as __local_1__
    where (
      not (__local_1__ is null)
    )
    and (__local_1__."id" = __local_0__."id") and (TRUE) and (TRUE)
  )
) as "@typeById",
to_json(
  (
    with __local_7__ as (
      select to_json(
        (
          json_build_object(
            '__identifiers'::text,
            json_build_array(__local_8__."id"),
            'id'::text,
            (__local_8__."id"),
            'smallint'::text,
            (__local_8__."smallint"),
            'bigint'::text,
            ((__local_8__."bigint"))::text,
            'numeric'::text,
            ((__local_8__."numeric"))::text,
            'decimal'::text,
            ((__local_8__."decimal"))::text,
            'boolean'::text,
            (__local_8__."boolean"),
            'varchar'::text,
            (__local_8__."varchar"),
            'enum'::text,
            (__local_8__."enum"),
            'enumArray'::text,
            (
              case when (__local_8__."enum_array") is null then null when coalesce(
                array_length(
                  (__local_8__."enum_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_9__)
                from unnest((__local_8__."enum_array")) as __local_9__
              ) end
            ),
            'domain'::text,
            (__local_8__."domain"),
            'domain2'::text,
            (__local_8__."domain2"),
            'textArray'::text,
            (
              case when (__local_8__."text_array") is null then null when coalesce(
                array_length(
                  (__local_8__."text_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(__local_10__)
                from unnest((__local_8__."text_array")) as __local_10__
              ) end
            ),
            'json'::text,
            (__local_8__."json"),
            'jsonb'::text,
            (__local_8__."jsonb"),
            'nullableRange'::text,
            case when ((__local_8__."nullable_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_8__."nullable_range"))
                )::text,
                'inclusive',
                lower_inc((__local_8__."nullable_range"))
              ) end,
              'end',
              case when upper((__local_8__."nullable_range")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_8__."nullable_range"))
                )::text,
                'inclusive',
                upper_inc((__local_8__."nullable_range"))
              ) end
            ) end,
            'numrange'::text,
            case when ((__local_8__."numrange")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."numrange")) is null then null else json_build_object(
                'value',
                (
                  lower((__local_8__."numrange"))
                )::text,
                'inclusive',
                lower_inc((__local_8__."numrange"))
              ) end,
              'end',
              case when upper((__local_8__."numrange")) is null then null else json_build_object(
                'value',
                (
                  upper((__local_8__."numrange"))
                )::text,
                'inclusive',
                upper_inc((__local_8__."numrange"))
              ) end
            ) end,
            'daterange'::text,
            case when ((__local_8__."daterange")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."daterange")) is null then null else json_build_object(
                'value',
                lower((__local_8__."daterange")),
                'inclusive',
                lower_inc((__local_8__."daterange"))
              ) end,
              'end',
              case when upper((__local_8__."daterange")) is null then null else json_build_object(
                'value',
                upper((__local_8__."daterange")),
                'inclusive',
                upper_inc((__local_8__."daterange"))
              ) end
            ) end,
            'anIntRange'::text,
            case when ((__local_8__."an_int_range")) is null then null else json_build_object(
              'start',
              case when lower((__local_8__."an_int_range")) is null then null else json_build_object(
                'value',
                lower((__local_8__."an_int_range")),
                'inclusive',
                lower_inc((__local_8__."an_int_range"))
              ) end,
              'end',
              case when upper((__local_8__."an_int_range")) is null then null else json_build_object(
                'value',
                upper((__local_8__."an_int_range")),
                'inclusive',
                upper_inc((__local_8__."an_int_range"))
              ) end
            ) end,
            'timestamp'::text,
            (__local_8__."timestamp"),
            'timestamptz'::text,
            (__local_8__."timestamptz"),
            'date'::text,
            (__local_8__."date"),
            'time'::text,
            (__local_8__."time"),
            'timetz'::text,
            (__local_8__."timetz"),
            'interval'::text,
            ((__local_8__."interval"))::text,
            'intervalArray'::text,
            (
              case when (__local_8__."interval_array") is null then null when coalesce(
                array_length(
                  (__local_8__."interval_array"),
                  1
                ),
                0
              ) = 0 then '[]'::json else (
                select json_agg(
                  (__local_11__)::text
                )
                from unnest((__local_8__."interval_array")) as __local_11__
              ) end
            ),
            'money'::text,
            ((__local_8__."money"))::numeric::text,
            'compoundType'::text,
            (
              case when (
                (__local_8__."compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (__local_8__."compound_type")."a"
                ),
                'b'::text,
                (
                  (__local_8__."compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_8__."compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_8__."compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_8__."compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_8__."compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_8__."compound_type")."foo_bar"
                )
              ) end
            ),
            'nestedCompoundType'::text,
            (
              case when (
                (__local_8__."nested_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  case when (
                    (
                      (__local_8__."nested_compound_type")."a"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."a"
                      )."foo_bar"
                    )
                  ) end
                ),
                'b'::text,
                (
                  case when (
                    (
                      (__local_8__."nested_compound_type")."b"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_8__."nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'nullableCompoundType'::text,
            (
              case when (
                (__local_8__."nullable_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  (__local_8__."nullable_compound_type")."a"
                ),
                'b'::text,
                (
                  (__local_8__."nullable_compound_type")."b"
                ),
                'c'::text,
                (
                  (__local_8__."nullable_compound_type")."c"
                ),
                'd'::text,
                (
                  (__local_8__."nullable_compound_type")."d"
                ),
                'e'::text,
                (
                  (__local_8__."nullable_compound_type")."e"
                ),
                'f'::text,
                (
                  (__local_8__."nullable_compound_type")."f"
                ),
                'fooBar'::text,
                (
                  (__local_8__."nullable_compound_type")."foo_bar"
                )
              ) end
            ),
            'nullableNestedCompoundType'::text,
            (
              case when (
                (__local_8__."nullable_nested_compound_type") is not distinct
                from null
              ) then null else json_build_object(
                'a'::text,
                (
                  case when (
                    (
                      (__local_8__."nullable_nested_compound_type")."a"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."a"
                      )."foo_bar"
                    )
                  ) end
                ),
                'b'::text,
                (
                  case when (
                    (
                      (__local_8__."nullable_nested_compound_type")."b"
                    ) is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."a"
                    ),
                    'b'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."b"
                    ),
                    'c'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."c"
                    ),
                    'd'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."d"
                    ),
                    'e'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."e"
                    ),
                    'f'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."f"
                    ),
                    'fooBar'::text,
                    (
                      (
                        (__local_8__."nullable_nested_compound_type")."b"
                      )."foo_bar"
                    )
                  ) end
                ),
                'bazBuz'::text,
                (
                  (__local_8__."nullable_nested_compound_type")."baz_buz"
                )
              ) end
            ),
            'point'::text,
            (__local_8__."point"),
            'nullablePoint'::text,
            (__local_8__."nullablePoint"),
            'inet'::text,
            (__local_8__."inet"),
            'cidr'::text,
            (__local_8__."cidr"),
            'macaddr'::text,
            (__local_8__."macaddr"),
            'regproc'::text,
            (__local_8__."regproc"),
            'regprocedure'::text,
            (__local_8__."regprocedure"),
            'regoper'::text,
            (__local_8__."regoper"),
            'regoperator'::text,
            (__local_8__."regoperator"),
            'regclass'::text,
            (__local_8__."regclass"),
            'regtype'::text,
            (__local_8__."regtype"),
            'regconfig'::text,
            (__local_8__."regconfig"),
            'regdictionary'::text,
            (__local_8__."regdictionary"),
            'textArrayDomain'::text,
            (__local_8__."text_array_domain"),
            'int8ArrayDomain'::text,
            ((__local_8__."int8_array_domain"))::text[],
            '@postBySmallint'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_12__."id"),
                'id'::text,
                (__local_12__."id"),
                'headline'::text,
                (__local_12__."headline")
              ) as object
              from "a"."post" as __local_12__
              where (__local_8__."smallint" = __local_12__."id") and (TRUE) and (TRUE)
            ),
            '@postById'::text,
            (
              select json_build_object(
                '__identifiers'::text,
                json_build_array(__local_13__."id"),
                'id'::text,
                (__local_13__."id"),
                'headline'::text,
                (__local_13__."headline")
              ) as object
              from "a"."post" as __local_13__
              where (__local_8__."id" = __local_13__."id") and (TRUE) and (TRUE)
            )
          )
        )
      ) as "@nodes",
      to_json(
        (
          json_build_object(
            '@node'::text,
            (
              json_build_object(
                '__identifiers'::text,
                json_build_array(__local_8__."id"),
                'id'::text,
                (__local_8__."id"),
                'smallint'::text,
                (__local_8__."smallint"),
                'bigint'::text,
                ((__local_8__."bigint"))::text,
                'numeric'::text,
                ((__local_8__."numeric"))::text,
                'decimal'::text,
                ((__local_8__."decimal"))::text,
                'boolean'::text,
                (__local_8__."boolean"),
                'varchar'::text,
                (__local_8__."varchar"),
                'enum'::text,
                (__local_8__."enum"),
                'enumArray'::text,
                (
                  case when (__local_8__."enum_array") is null then null when coalesce(
                    array_length(
                      (__local_8__."enum_array"),
                      1
                    ),
                    0
                  ) = 0 then '[]'::json else (
                    select json_agg(__local_14__)
                    from unnest((__local_8__."enum_array")) as __local_14__
                  ) end
                ),
                'domain'::text,
                (__local_8__."domain"),
                'domain2'::text,
                (__local_8__."domain2"),
                'textArray'::text,
                (
                  case when (__local_8__."text_array") is null then null when coalesce(
                    array_length(
                      (__local_8__."text_array"),
                      1
                    ),
                    0
                  ) = 0 then '[]'::json else (
                    select json_agg(__local_15__)
                    from unnest((__local_8__."text_array")) as __local_15__
                  ) end
                ),
                'json'::text,
                (__local_8__."json"),
                'jsonb'::text,
                (__local_8__."jsonb"),
                'nullableRange'::text,
                case when ((__local_8__."nullable_range")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_8__."nullable_range")) is null then null else json_build_object(
                    'value',
                    (
                      lower((__local_8__."nullable_range"))
                    )::text,
                    'inclusive',
                    lower_inc((__local_8__."nullable_range"))
                  ) end,
                  'end',
                  case when upper((__local_8__."nullable_range")) is null then null else json_build_object(
                    'value',
                    (
                      upper((__local_8__."nullable_range"))
                    )::text,
                    'inclusive',
                    upper_inc((__local_8__."nullable_range"))
                  ) end
                ) end,
                'numrange'::text,
                case when ((__local_8__."numrange")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_8__."numrange")) is null then null else json_build_object(
                    'value',
                    (
                      lower((__local_8__."numrange"))
                    )::text,
                    'inclusive',
                    lower_inc((__local_8__."numrange"))
                  ) end,
                  'end',
                  case when upper((__local_8__."numrange")) is null then null else json_build_object(
                    'value',
                    (
                      upper((__local_8__."numrange"))
                    )::text,
                    'inclusive',
                    upper_inc((__local_8__."numrange"))
                  ) end
                ) end,
                'daterange'::text,
                case when ((__local_8__."daterange")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_8__."daterange")) is null then null else json_build_object(
                    'value',
                    lower((__local_8__."daterange")),
                    'inclusive',
                    lower_inc((__local_8__."daterange"))
                  ) end,
                  'end',
                  case when upper((__local_8__."daterange")) is null then null else json_build_object(
                    'value',
                    upper((__local_8__."daterange")),
                    'inclusive',
                    upper_inc((__local_8__."daterange"))
                  ) end
                ) end,
                'anIntRange'::text,
                case when ((__local_8__."an_int_range")) is null then null else json_build_object(
                  'start',
                  case when lower((__local_8__."an_int_range")) is null then null else json_build_object(
                    'value',
                    lower((__local_8__."an_int_range")),
                    'inclusive',
                    lower_inc((__local_8__."an_int_range"))
                  ) end,
                  'end',
                  case when upper((__local_8__."an_int_range")) is null then null else json_build_object(
                    'value',
                    upper((__local_8__."an_int_range")),
                    'inclusive',
                    upper_inc((__local_8__."an_int_range"))
                  ) end
                ) end,
                'timestamp'::text,
                (__local_8__."timestamp"),
                'timestamptz'::text,
                (__local_8__."timestamptz"),
                'date'::text,
                (__local_8__."date"),
                'time'::text,
                (__local_8__."time"),
                'timetz'::text,
                (__local_8__."timetz"),
                'interval'::text,
                ((__local_8__."interval"))::text,
                'intervalArray'::text,
                (
                  case when (__local_8__."interval_array") is null then null when coalesce(
                    array_length(
                      (__local_8__."interval_array"),
                      1
                    ),
                    0
                  ) = 0 then '[]'::json else (
                    select json_agg(
                      (__local_16__)::text
                    )
                    from unnest((__local_8__."interval_array")) as __local_16__
                  ) end
                ),
                'money'::text,
                ((__local_8__."money"))::numeric::text,
                'compoundType'::text,
                (
                  case when (
                    (__local_8__."compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (__local_8__."compound_type")."a"
                    ),
                    'b'::text,
                    (
                      (__local_8__."compound_type")."b"
                    ),
                    'c'::text,
                    (
                      (__local_8__."compound_type")."c"
                    ),
                    'd'::text,
                    (
                      (__local_8__."compound_type")."d"
                    ),
                    'e'::text,
                    (
                      (__local_8__."compound_type")."e"
                    ),
                    'f'::text,
                    (
                      (__local_8__."compound_type")."f"
                    ),
                    'fooBar'::text,
                    (
                      (__local_8__."compound_type")."foo_bar"
                    )
                  ) end
                ),
                'nestedCompoundType'::text,
                (
                  case when (
                    (__local_8__."nested_compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      case when (
                        (
                          (__local_8__."nested_compound_type")."a"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."a"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."a"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."a"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."a"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."a"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."a"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."a"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'b'::text,
                    (
                      case when (
                        (
                          (__local_8__."nested_compound_type")."b"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."b"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."b"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."b"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."b"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."b"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."b"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_8__."nested_compound_type")."b"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'bazBuz'::text,
                    (
                      (__local_8__."nested_compound_type")."baz_buz"
                    )
                  ) end
                ),
                'nullableCompoundType'::text,
                (
                  case when (
                    (__local_8__."nullable_compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      (__local_8__."nullable_compound_type")."a"
                    ),
                    'b'::text,
                    (
                      (__local_8__."nullable_compound_type")."b"
                    ),
                    'c'::text,
                    (
                      (__local_8__."nullable_compound_type")."c"
                    ),
                    'd'::text,
                    (
                      (__local_8__."nullable_compound_type")."d"
                    ),
                    'e'::text,
                    (
                      (__local_8__."nullable_compound_type")."e"
                    ),
                    'f'::text,
                    (
                      (__local_8__."nullable_compound_type")."f"
                    ),
                    'fooBar'::text,
                    (
                      (__local_8__."nullable_compound_type")."foo_bar"
                    )
                  ) end
                ),
                'nullableNestedCompoundType'::text,
                (
                  case when (
                    (__local_8__."nullable_nested_compound_type") is not distinct
                    from null
                  ) then null else json_build_object(
                    'a'::text,
                    (
                      case when (
                        (
                          (__local_8__."nullable_nested_compound_type")."a"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."a"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."a"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."a"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."a"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."a"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."a"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."a"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'b'::text,
                    (
                      case when (
                        (
                          (__local_8__."nullable_nested_compound_type")."b"
                        ) is not distinct
                        from null
                      ) then null else json_build_object(
                        'a'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."b"
                          )."a"
                        ),
                        'b'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."b"
                          )."b"
                        ),
                        'c'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."b"
                          )."c"
                        ),
                        'd'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."b"
                          )."d"
                        ),
                        'e'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."b"
                          )."e"
                        ),
                        'f'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."b"
                          )."f"
                        ),
                        'fooBar'::text,
                        (
                          (
                            (__local_8__."nullable_nested_compound_type")."b"
                          )."foo_bar"
                        )
                      ) end
                    ),
                    'bazBuz'::text,
                    (
                      (__local_8__."nullable_nested_compound_type")."baz_buz"
                    )
                  ) end
                ),
                'point'::text,
                (__local_8__."point"),
                'nullablePoint'::text,
                (__local_8__."nullablePoint"),
                'inet'::text,
                (__local_8__."inet"),
                'cidr'::text,
                (__local_8__."cidr"),
                'macaddr'::text,
                (__local_8__."macaddr"),
                'regproc'::text,
                (__local_8__."regproc"),
                'regprocedure'::text,
                (__local_8__."regprocedure"),
                'regoper'::text,
                (__local_8__."regoper"),
                'regoperator'::text,
                (__local_8__."regoperator"),
                'regclass'::text,
                (__local_8__."regclass"),
                'regtype'::text,
                (__local_8__."regtype"),
                'regconfig'::text,
                (__local_8__."regconfig"),
                'regdictionary'::text,
                (__local_8__."regdictionary"),
                'textArrayDomain'::text,
                (__local_8__."text_array_domain"),
                'int8ArrayDomain'::text,
                ((__local_8__."int8_array_domain"))::text[],
                '@postBySmallint'::text,
                (
                  select json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_17__."id"),
                    'id'::text,
                    (__local_17__."id"),
                    'headline'::text,
                    (__local_17__."headline")
                  ) as object
                  from "a"."post" as __local_17__
                  where (__local_8__."smallint" = __local_17__."id") and (TRUE) and (TRUE)
                ),
                '@postById'::text,
                (
                  select json_build_object(
                    '__identifiers'::text,
                    json_build_array(__local_18__."id"),
                    'id'::text,
                    (__local_18__."id"),
                    'headline'::text,
                    (__local_18__."headline")
                  ) as object
                  from "a"."post" as __local_18__
                  where (__local_8__."id" = __local_18__."id") and (TRUE) and (TRUE)
                )
              )
            )
          )
        )
      ) as "@edges",
      to_json(
        json_build_array(
          'primary_key_asc',
          json_build_array(__local_8__."id")
        )
      ) as "__cursor"
      from (
        select __local_8__.*
        from "b"."types" as __local_8__
        where (__local_8__."smallint" = __local_0__."id") and (TRUE) and (TRUE)
        order by __local_8__."id" ASC
      ) __local_8__
    ),
    __local_19__ as (
      select json_agg(
        to_json(__local_7__)
      ) as data
      from __local_7__
    )
    select json_build_object(
      'data'::text,
      coalesce(
        (
          select __local_19__.data
          from __local_19__
        ),
        '[]'::json
      ),
      'hasNextPage'::text,
      FALSE,
      'hasPreviousPage'::text,
      FALSE,
      'aggregates'::text,
      (
        select json_build_object(
          'totalCount'::text,
          count(1)
        )
        from "b"."types" as __local_8__
        where (__local_8__."smallint" = __local_0__."id")
      )
    )
  )
) as "@typesBySmallint"
from "a"."post" as __local_0__
where (
  __local_0__."id" = $1
) and (TRUE) and (TRUE)