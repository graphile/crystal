SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "b"."type_function_mutation"(
    $1
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"b"."types"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'smallint'::text,
      (__local_0__."smallint"),
      'bigint'::text,
      ((__local_0__."bigint"))::text,
      'numeric'::text,
      ((__local_0__."numeric"))::text,
      'decimal'::text,
      ((__local_0__."decimal"))::text,
      'boolean'::text,
      (__local_0__."boolean"),
      'varchar'::text,
      (__local_0__."varchar"),
      'enum'::text,
      (__local_0__."enum"),
      'enumArray'::text,
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
      ),
      'domain'::text,
      (__local_0__."domain"),
      'domain2'::text,
      (__local_0__."domain2"),
      'textArray'::text,
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
      ),
      'json'::text,
      (__local_0__."json"),
      'jsonb'::text,
      (__local_0__."jsonb"),
      'nullableRange'::text,
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
      ) end,
      'numrange'::text,
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
      ) end,
      'daterange'::text,
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
      ) end,
      'anIntRange'::text,
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
      ) end,
      'timestamp'::text,
      (__local_0__."timestamp"),
      'timestamptz'::text,
      (__local_0__."timestamptz"),
      'date'::text,
      (__local_0__."date"),
      'time'::text,
      (__local_0__."time"),
      'timetz'::text,
      (__local_0__."timetz"),
      'interval'::text,
      ((__local_0__."interval"))::text,
      'intervalArray'::text,
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
      ),
      'money'::text,
      ((__local_0__."money"))::numeric::text,
      'compoundType'::text,
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
      ),
      'nestedCompoundType'::text,
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
      ),
      'nullableCompoundType'::text,
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
      ),
      'nullableNestedCompoundType'::text,
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
      ),
      'point'::text,
      (__local_0__."point"),
      'nullablePoint'::text,
      (__local_0__."nullablePoint"),
      'inet'::text,
      (__local_0__."inet"),
      'cidr'::text,
      (__local_0__."cidr"),
      'macaddr'::text,
      (__local_0__."macaddr"),
      'regproc'::text,
      (__local_0__."regproc"),
      'regprocedure'::text,
      (__local_0__."regprocedure"),
      'regoper'::text,
      (__local_0__."regoper"),
      'regoperator'::text,
      (__local_0__."regoperator"),
      'regclass'::text,
      (__local_0__."regclass"),
      'regtype'::text,
      (__local_0__."regtype"),
      'regconfig'::text,
      (__local_0__."regconfig"),
      'regdictionary'::text,
      (__local_0__."regdictionary"),
      'textArrayDomain'::text,
      (__local_0__."text_array_domain"),
      'int8ArrayDomain'::text,
      ((__local_0__."int8_array_domain"))::text[],
      '@postBySmallint'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_4__."id"),
          'headline'::text,
          (__local_4__."headline")
        ) as object
        from "a"."post" as __local_4__
        where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
      ),
      '@postById'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_5__."id"),
          'headline'::text,
          (__local_5__."headline")
        ) as object
        from "a"."post" as __local_5__
        where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@type"
from __local_0__ as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from unnest(
    "b"."type_function_list_mutation"( )
  ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"b"."types"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'smallint'::text,
      (__local_0__."smallint"),
      'bigint'::text,
      ((__local_0__."bigint"))::text,
      'numeric'::text,
      ((__local_0__."numeric"))::text,
      'decimal'::text,
      ((__local_0__."decimal"))::text,
      'boolean'::text,
      (__local_0__."boolean"),
      'varchar'::text,
      (__local_0__."varchar"),
      'enum'::text,
      (__local_0__."enum"),
      'enumArray'::text,
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
      ),
      'domain'::text,
      (__local_0__."domain"),
      'domain2'::text,
      (__local_0__."domain2"),
      'textArray'::text,
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
      ),
      'json'::text,
      (__local_0__."json"),
      'jsonb'::text,
      (__local_0__."jsonb"),
      'nullableRange'::text,
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
      ) end,
      'numrange'::text,
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
      ) end,
      'daterange'::text,
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
      ) end,
      'anIntRange'::text,
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
      ) end,
      'timestamp'::text,
      (__local_0__."timestamp"),
      'timestamptz'::text,
      (__local_0__."timestamptz"),
      'date'::text,
      (__local_0__."date"),
      'time'::text,
      (__local_0__."time"),
      'timetz'::text,
      (__local_0__."timetz"),
      'interval'::text,
      ((__local_0__."interval"))::text,
      'intervalArray'::text,
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
      ),
      'money'::text,
      ((__local_0__."money"))::numeric::text,
      'compoundType'::text,
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
      ),
      'nestedCompoundType'::text,
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
      ),
      'nullableCompoundType'::text,
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
      ),
      'nullableNestedCompoundType'::text,
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
      ),
      'point'::text,
      (__local_0__."point"),
      'nullablePoint'::text,
      (__local_0__."nullablePoint"),
      'inet'::text,
      (__local_0__."inet"),
      'cidr'::text,
      (__local_0__."cidr"),
      'macaddr'::text,
      (__local_0__."macaddr"),
      'regproc'::text,
      (__local_0__."regproc"),
      'regprocedure'::text,
      (__local_0__."regprocedure"),
      'regoper'::text,
      (__local_0__."regoper"),
      'regoperator'::text,
      (__local_0__."regoperator"),
      'regclass'::text,
      (__local_0__."regclass"),
      'regtype'::text,
      (__local_0__."regtype"),
      'regconfig'::text,
      (__local_0__."regconfig"),
      'regdictionary'::text,
      (__local_0__."regdictionary"),
      'textArrayDomain'::text,
      (__local_0__."text_array_domain"),
      'int8ArrayDomain'::text,
      ((__local_0__."int8_array_domain"))::text[],
      '@postBySmallint'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_4__."id"),
          'headline'::text,
          (__local_4__."headline")
        ) as object
        from "a"."post" as __local_4__
        where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
      ),
      '@postById'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_5__."id"),
          'headline'::text,
          (__local_5__."headline")
        ) as object
        from "a"."post" as __local_5__
        where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@types"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "b"."type_function_connection_mutation"( ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"b"."types"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'smallint'::text,
      (__local_0__."smallint"),
      'bigint'::text,
      ((__local_0__."bigint"))::text,
      'numeric'::text,
      ((__local_0__."numeric"))::text,
      'decimal'::text,
      ((__local_0__."decimal"))::text,
      'boolean'::text,
      (__local_0__."boolean"),
      'varchar'::text,
      (__local_0__."varchar"),
      'enum'::text,
      (__local_0__."enum"),
      'enumArray'::text,
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
      ),
      'domain'::text,
      (__local_0__."domain"),
      'domain2'::text,
      (__local_0__."domain2"),
      'textArray'::text,
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
      ),
      'json'::text,
      (__local_0__."json"),
      'jsonb'::text,
      (__local_0__."jsonb"),
      'nullableRange'::text,
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
      ) end,
      'numrange'::text,
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
      ) end,
      'daterange'::text,
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
      ) end,
      'anIntRange'::text,
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
      ) end,
      'timestamp'::text,
      (__local_0__."timestamp"),
      'timestamptz'::text,
      (__local_0__."timestamptz"),
      'date'::text,
      (__local_0__."date"),
      'time'::text,
      (__local_0__."time"),
      'timetz'::text,
      (__local_0__."timetz"),
      'interval'::text,
      ((__local_0__."interval"))::text,
      'intervalArray'::text,
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
      ),
      'money'::text,
      ((__local_0__."money"))::numeric::text,
      'compoundType'::text,
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
      ),
      'nestedCompoundType'::text,
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
      ),
      'nullableCompoundType'::text,
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
      ),
      'nullableNestedCompoundType'::text,
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
      ),
      'point'::text,
      (__local_0__."point"),
      'nullablePoint'::text,
      (__local_0__."nullablePoint"),
      'inet'::text,
      (__local_0__."inet"),
      'cidr'::text,
      (__local_0__."cidr"),
      'macaddr'::text,
      (__local_0__."macaddr"),
      'regproc'::text,
      (__local_0__."regproc"),
      'regprocedure'::text,
      (__local_0__."regprocedure"),
      'regoper'::text,
      (__local_0__."regoper"),
      'regoperator'::text,
      (__local_0__."regoperator"),
      'regclass'::text,
      (__local_0__."regclass"),
      'regtype'::text,
      (__local_0__."regtype"),
      'regconfig'::text,
      (__local_0__."regconfig"),
      'regdictionary'::text,
      (__local_0__."regdictionary"),
      'textArrayDomain'::text,
      (__local_0__."text_array_domain"),
      'int8ArrayDomain'::text,
      ((__local_0__."int8_array_domain"))::text[],
      '@postBySmallint'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_4__."id"),
          'headline'::text,
          (__local_4__."headline")
        ) as object
        from "a"."post" as __local_4__
        where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
      ),
      '@postById'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_5__."id"),
          'headline'::text,
          (__local_5__."headline")
        ) as object
        from "a"."post" as __local_5__
        where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@types"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  update "b"."types" set "smallint" = $1,
  "bigint" = $2,
  "numeric" = $3,
  "decimal" = $4,
  "boolean" = $5,
  "varchar" = $6,
  "enum" = $7,
  "enum_array" = array[$8,
  $9,
  $10]::"b"."_color",
  "domain" = $11,
  "domain2" = $12,
  "text_array" = array[$13]::"pg_catalog"."_text",
  "json" = $14,
  "jsonb" = $15,
  "numrange" = "pg_catalog"."numrange"(
    $16,
    $17,
    $18
  ),
  "daterange" = "pg_catalog"."daterange"(
    $19,
    $20,
    $21
  ),
  "an_int_range" = "a"."an_int_range"(
    $22,
    $23,
    $24
  ),
  "timestamp" = $25,
  "timestamptz" = $26,
  "date" = $27,
  "time" = $28,
  "timetz" = $29,
  "interval" = $30,
  "interval_array" = array[$31]::"pg_catalog"."_interval",
  "money" = (
    $32
  )::money,
  "compound_type" = row(
    $33::"pg_catalog"."int4",
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  )::"c"."compound_type",
  "nested_compound_type" = row(
    row(
      $34::"pg_catalog"."int4",
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL
    )::"c"."compound_type"::"c"."compound_type",
    NULL,
    NULL
  )::"b"."nested_compound_type",
  "point" = point(
    $35,
    $36
  ),
  "nullablePoint" = point(
    $37,
    $38
  ),
  "inet" = $39,
  "cidr" = $40,
  "macaddr" = $41,
  "regproc" = $42,
  "regprocedure" = $43,
  "regoper" = $44,
  "regoperator" = $45,
  "regclass" = $46,
  "regtype" = $47,
  "regconfig" = $48,
  "regdictionary" = $49,
  "text_array_domain" = array[$50,
  $51,
  $52]::"pg_catalog"."_text",
  "int8_array_domain" = array[$53,
  $54,
  $55]::"pg_catalog"."_int8"
  where (
    "id" = $56
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"b"."types"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'smallint'::text,
      (__local_0__."smallint"),
      'bigint'::text,
      ((__local_0__."bigint"))::text,
      'numeric'::text,
      ((__local_0__."numeric"))::text,
      'decimal'::text,
      ((__local_0__."decimal"))::text,
      'boolean'::text,
      (__local_0__."boolean"),
      'varchar'::text,
      (__local_0__."varchar"),
      'enum'::text,
      (__local_0__."enum"),
      'enumArray'::text,
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
      ),
      'domain'::text,
      (__local_0__."domain"),
      'domain2'::text,
      (__local_0__."domain2"),
      'textArray'::text,
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
      ),
      'json'::text,
      (__local_0__."json"),
      'jsonb'::text,
      (__local_0__."jsonb"),
      'nullableRange'::text,
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
      ) end,
      'numrange'::text,
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
      ) end,
      'daterange'::text,
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
      ) end,
      'anIntRange'::text,
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
      ) end,
      'timestamp'::text,
      (__local_0__."timestamp"),
      'timestamptz'::text,
      (__local_0__."timestamptz"),
      'date'::text,
      (__local_0__."date"),
      'time'::text,
      (__local_0__."time"),
      'timetz'::text,
      (__local_0__."timetz"),
      'interval'::text,
      ((__local_0__."interval"))::text,
      'intervalArray'::text,
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
      ),
      'money'::text,
      ((__local_0__."money"))::numeric::text,
      'compoundType'::text,
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
      ),
      'nestedCompoundType'::text,
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
      ),
      'nullableCompoundType'::text,
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
      ),
      'nullableNestedCompoundType'::text,
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
      ),
      'point'::text,
      (__local_0__."point"),
      'nullablePoint'::text,
      (__local_0__."nullablePoint"),
      'inet'::text,
      (__local_0__."inet"),
      'cidr'::text,
      (__local_0__."cidr"),
      'macaddr'::text,
      (__local_0__."macaddr"),
      'regproc'::text,
      (__local_0__."regproc"),
      'regprocedure'::text,
      (__local_0__."regprocedure"),
      'regoper'::text,
      (__local_0__."regoper"),
      'regoperator'::text,
      (__local_0__."regoperator"),
      'regclass'::text,
      (__local_0__."regclass"),
      'regtype'::text,
      (__local_0__."regtype"),
      'regconfig'::text,
      (__local_0__."regconfig"),
      'regdictionary'::text,
      (__local_0__."regdictionary"),
      'textArrayDomain'::text,
      (__local_0__."text_array_domain"),
      'int8ArrayDomain'::text,
      ((__local_0__."int8_array_domain"))::text[],
      '@postBySmallint'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_4__."id"),
          'headline'::text,
          (__local_4__."headline")
        ) as object
        from "a"."post" as __local_4__
        where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
      ),
      '@postById'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_5__."id"),
          'headline'::text,
          (__local_5__."headline")
        ) as object
        from "a"."post" as __local_5__
        where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@type"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "b"."types" (
    "smallint",
    "bigint",
    "numeric",
    "decimal",
    "boolean",
    "varchar",
    "enum",
    "enum_array",
    "domain",
    "domain2",
    "text_array",
    "json",
    "jsonb",
    "numrange",
    "daterange",
    "an_int_range",
    "timestamp",
    "timestamptz",
    "date",
    "time",
    "timetz",
    "interval",
    "interval_array",
    "money",
    "compound_type",
    "nested_compound_type",
    "point",
    "regproc",
    "regprocedure",
    "regoper",
    "regoperator",
    "regclass",
    "regtype",
    "regconfig",
    "regdictionary"
  ) values(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    array[$8,
    $9,
    $10]::"b"."_color",
    $11,
    $12,
    array[$13]::"pg_catalog"."_text",
    $14,
    $15,
    "pg_catalog"."numrange"(
      $16,
      $17,
      $18
    ),
    "pg_catalog"."daterange"(
      $19,
      $20,
      $21
    ),
    "a"."an_int_range"(
      $22,
      $23,
      $24
    ),
    $25,
    $26,
    $27,
    $28,
    $29,
    $30,
    array[$31]::"pg_catalog"."_interval",
    (
      $32
    )::money,
    row(
      $33::"pg_catalog"."int4",
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      NULL
    )::"c"."compound_type",
    row(
      row(
        $34::"pg_catalog"."int4",
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
      )::"c"."compound_type"::"c"."compound_type",
      NULL,
      NULL
    )::"b"."nested_compound_type",
    point(
      $35,
      $36
    ),
    $37,
    $38,
    $39,
    $40,
    $41,
    $42,
    $43,
    $44
  ) returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"b"."types"
  ).*
  from unnest(
    (
      $1
    )::text[]
  ) str
)
select to_json(
  (
    json_build_object(
      'id'::text,
      (__local_0__."id"),
      'smallint'::text,
      (__local_0__."smallint"),
      'bigint'::text,
      ((__local_0__."bigint"))::text,
      'numeric'::text,
      ((__local_0__."numeric"))::text,
      'decimal'::text,
      ((__local_0__."decimal"))::text,
      'boolean'::text,
      (__local_0__."boolean"),
      'varchar'::text,
      (__local_0__."varchar"),
      'enum'::text,
      (__local_0__."enum"),
      'enumArray'::text,
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
      ),
      'domain'::text,
      (__local_0__."domain"),
      'domain2'::text,
      (__local_0__."domain2"),
      'textArray'::text,
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
      ),
      'json'::text,
      (__local_0__."json"),
      'jsonb'::text,
      (__local_0__."jsonb"),
      'nullableRange'::text,
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
      ) end,
      'numrange'::text,
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
      ) end,
      'daterange'::text,
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
      ) end,
      'anIntRange'::text,
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
      ) end,
      'timestamp'::text,
      (__local_0__."timestamp"),
      'timestamptz'::text,
      (__local_0__."timestamptz"),
      'date'::text,
      (__local_0__."date"),
      'time'::text,
      (__local_0__."time"),
      'timetz'::text,
      (__local_0__."timetz"),
      'interval'::text,
      ((__local_0__."interval"))::text,
      'intervalArray'::text,
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
      ),
      'money'::text,
      ((__local_0__."money"))::numeric::text,
      'compoundType'::text,
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
      ),
      'nestedCompoundType'::text,
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
      ),
      'nullableCompoundType'::text,
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
      ),
      'nullableNestedCompoundType'::text,
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
      ),
      'point'::text,
      (__local_0__."point"),
      'nullablePoint'::text,
      (__local_0__."nullablePoint"),
      'inet'::text,
      (__local_0__."inet"),
      'cidr'::text,
      (__local_0__."cidr"),
      'macaddr'::text,
      (__local_0__."macaddr"),
      'regproc'::text,
      (__local_0__."regproc"),
      'regprocedure'::text,
      (__local_0__."regprocedure"),
      'regoper'::text,
      (__local_0__."regoper"),
      'regoperator'::text,
      (__local_0__."regoperator"),
      'regclass'::text,
      (__local_0__."regclass"),
      'regtype'::text,
      (__local_0__."regtype"),
      'regconfig'::text,
      (__local_0__."regconfig"),
      'regdictionary'::text,
      (__local_0__."regdictionary"),
      'textArrayDomain'::text,
      (__local_0__."text_array_domain"),
      'int8ArrayDomain'::text,
      ((__local_0__."int8_array_domain"))::text[],
      '@postBySmallint'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_4__."id"),
          'headline'::text,
          (__local_4__."headline")
        ) as object
        from "a"."post" as __local_4__
        where (__local_0__."smallint" = __local_4__."id") and (TRUE) and (TRUE)
      ),
      '@postById'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_5__."id"),
          'headline'::text,
          (__local_5__."headline")
        ) as object
        from "a"."post" as __local_5__
        where (__local_0__."id" = __local_5__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@type"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation