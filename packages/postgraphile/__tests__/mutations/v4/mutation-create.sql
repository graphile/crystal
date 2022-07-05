SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "b"."types" (
    "id",
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
    "cidr",
    "macaddr",
    "text_array_domain",
    "int8_array_domain"
  ) values(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    array[$9,
    $10]::"b"."_color",
    $11,
    $12,
    array[$13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19,
    $20,
    $21]::"pg_catalog"."_text",
    $22,
    $23,
    "pg_catalog"."numrange"(
      $24,
      NULL,
      $25
    ),
    "pg_catalog"."daterange"(
      $26,
      $27,
      $28
    ),
    "a"."an_int_range"(
      NULL,
      $29,
      $30
    ),
    $31,
    $32,
    $33,
    $34,
    $35,
    $36,
    array[$37,
    $38]::"pg_catalog"."_interval",
    (
      $39
    )::money,
    row(
      $40::"pg_catalog"."int4",
      $41::"pg_catalog"."text",
      $42::"b"."color",
      $43::"pg_catalog"."uuid",
      $44::"b"."enum_caps",
      $45::"b"."enum_with_empty_string",
      NULL,
      $46::"pg_catalog"."int4"
    )::"c"."compound_type",
    row(
      row(
        $47::"pg_catalog"."int4",
        $48::"pg_catalog"."text",
        $49::"b"."color",
        $50::"pg_catalog"."uuid",
        $51::"b"."enum_caps",
        $52::"b"."enum_with_empty_string",
        NULL,
        $53::"pg_catalog"."int4"
      )::"c"."compound_type"::"c"."compound_type",
      row(
        $54::"pg_catalog"."int4",
        $55::"pg_catalog"."text",
        $56::"b"."color",
        $57::"pg_catalog"."uuid",
        $58::"b"."enum_caps",
        $59::"b"."enum_with_empty_string",
        NULL,
        $60::"pg_catalog"."int4"
      )::"c"."compound_type"::"c"."compound_type",
      $61::"pg_catalog"."int4"
    )::"b"."nested_compound_type",
    point(
      $62,
      $63
    ),
    $64,
    $65,
    array[$66,
    $67,
    $68]::"pg_catalog"."_text",
    array[$69,
    $70,
    $71]::"pg_catalog"."_int8"
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
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
      'textArrayDomain'::text,
      (__local_0__."text_array_domain"),
      'int8ArrayDomain'::text,
      ((__local_0__."int8_array_domain"))::text[]
    )
  )
) as "@type"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."person" (
    "id",
    "person_full_name",
    "about",
    "email",
    "config",
    "last_login_from_ip",
    "last_login_from_subnet",
    "user_mac"
  ) values(
    $1,
    $2,
    $3,
    $4,
    (
      $5::"public"."hstore"
    ),
    $6,
    $7,
    $8
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
    str::"c"."person"
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'name'::text,
      (__local_0__."person_full_name"),
      'email'::text,
      (__local_0__."email"),
      'about'::text,
      (__local_0__."about"),
      'config'::text,
      (__local_0__."config"),
      'lastLoginFromIp'::text,
      (__local_0__."last_login_from_ip"),
      'lastLoginFromSubnet'::text,
      (__local_0__."last_login_from_subnet"),
      'userMac'::text,
      (__local_0__."user_mac"),
      '@issue27UserExists'::text,
      (
        select to_json(__local_1__) as "value"
        from "c"."person_exists"(
          __local_0__,
          $2
        ) as __local_1__
        where (TRUE) and (TRUE)
      )
    )
  )
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@a",
to_json(
  (
    json_build_object(
      '__order_primary_key_desc'::text,
      json_build_array(
        'primary_key_desc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@b",
to_json(
  (
    json_build_object(
      '__order_id_asc'::text,
      json_build_array(
        'id_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@c",
to_json(
  (
    json_build_object(
      '__order_id_desc'::text,
      json_build_array(
        'id_desc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@d",
to_json(
  (
    json_build_object(
      '__order_email_asc'::text,
      json_build_array(
        'email_asc'::text,
        json_build_array(__local_0__."email")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@e",
to_json(
  (
    json_build_object(
      '__order_email_desc'::text,
      json_build_array(
        'email_desc'::text,
        json_build_array(__local_0__."email")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@f",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@g",
to_json(
  (
    json_build_object(
      '__order_email_desc__id_desc'::text,
      json_build_array(
        'email_desc'::text,
        'id_desc'::text,
        json_build_array(
          __local_0__."email",
          __local_0__."id"
        )
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@h"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."person" (
    "id",
    "person_full_name",
    "about",
    "email",
    "config",
    "last_login_from_ip",
    "last_login_from_subnet",
    "user_mac"
  ) values(
    $1,
    $2,
    $3,
    $4,
    NULL,
    $5,
    $6,
    $7
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
    str::"c"."person"
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'name'::text,
      (__local_0__."person_full_name"),
      'email'::text,
      (__local_0__."email"),
      'about'::text,
      (__local_0__."about"),
      'config'::text,
      (__local_0__."config"),
      'lastLoginFromIp'::text,
      (__local_0__."last_login_from_ip"),
      'lastLoginFromSubnet'::text,
      (__local_0__."last_login_from_subnet"),
      'userMac'::text,
      (__local_0__."user_mac"),
      '@issue27UserExists'::text,
      (
        select to_json(__local_1__) as "value"
        from "c"."person_exists"(
          __local_0__,
          $2
        ) as __local_1__
        where (TRUE) and (TRUE)
      )
    )
  )
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@a",
to_json(
  (
    json_build_object(
      '__order_primary_key_desc'::text,
      json_build_array(
        'primary_key_desc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@b",
to_json(
  (
    json_build_object(
      '__order_id_asc'::text,
      json_build_array(
        'id_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@c",
to_json(
  (
    json_build_object(
      '__order_id_desc'::text,
      json_build_array(
        'id_desc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@d",
to_json(
  (
    json_build_object(
      '__order_email_asc'::text,
      json_build_array(
        'email_asc'::text,
        json_build_array(__local_0__."email")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@e",
to_json(
  (
    json_build_object(
      '__order_email_desc'::text,
      json_build_array(
        'email_desc'::text,
        json_build_array(__local_0__."email")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@f",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@g",
to_json(
  (
    json_build_object(
      '__order_email_desc__id_desc'::text,
      json_build_array(
        'email_desc'::text,
        'id_desc'::text,
        json_build_array(
          __local_0__."email",
          __local_0__."id"
        )
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@h"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."compound_key" (
    "person_id_2",
    "person_id_1",
    "extra"
  ) values(
    $1,
    $2,
    $3
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
    str::"c"."compound_key"
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
      '__identifiers'::text,
      json_build_array(
        __local_0__."person_id_1",
        __local_0__."person_id_2"
      ),
      'personId1'::text,
      (__local_0__."person_id_1"),
      'personId2'::text,
      (__local_0__."person_id_2"),
      'extra'::text,
      (__local_0__."extra"),
      '@personByPersonId1'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_1__."id"),
          'name'::text,
          (__local_1__."person_full_name")
        ) as object
        from "c"."person" as __local_1__
        where (__local_0__."person_id_1" = __local_1__."id") and (TRUE) and (TRUE)
      ),
      '@personByPersonId2'::text,
      (
        select json_build_object(
          '__identifiers'::text,
          json_build_array(__local_2__."id"),
          'name'::text,
          (__local_2__."person_full_name")
        ) as object
        from "c"."person" as __local_2__
        where (__local_0__."person_id_2" = __local_2__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@compoundKey",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_3__."id"),
      'name'::text,
      (__local_3__."person_full_name")
    ) as object
    from "c"."person" as __local_3__
    where (__local_0__."person_id_1" = __local_3__."id") and (TRUE) and (TRUE)
  )
) as "@personByPersonId1",
to_json(
  (
    select json_build_object(
      '__identifiers'::text,
      json_build_array(__local_4__."id"),
      'name'::text,
      (__local_4__."person_full_name")
    ) as object
    from "c"."person" as __local_4__
    where (__local_0__."person_id_2" = __local_4__."id") and (TRUE) and (TRUE)
  )
) as "@personByPersonId2"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."edge_case" ("not_null_has_default") values(
    $1
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
    str::"c"."edge_case"
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
      'notNullHasDefault'::text,
      (__local_0__."not_null_has_default")
    )
  )
) as "@edgeCase"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."edge_case" default values returning *
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

with __local_0__ as (
  select (
    str::"c"."edge_case"
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
      'notNullHasDefault'::text,
      (__local_0__."not_null_has_default")
    )
  )
) as "@edgeCase"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."person" (
    "id",
    "person_full_name",
    "about",
    "email",
    "config",
    "last_login_from_ip",
    "last_login_from_subnet",
    "user_mac"
  ) values(
    $1,
    $2,
    NULL,
    $3,
    (
      $4::"public"."hstore"
    ),
    $5,
    $6,
    $7
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
    str::"c"."person"
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
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      'id'::text,
      (__local_0__."id"),
      'name'::text,
      (__local_0__."person_full_name"),
      'email'::text,
      (__local_0__."email"),
      'about'::text,
      (__local_0__."about"),
      'config'::text,
      (__local_0__."config"),
      'lastLoginFromIp'::text,
      (__local_0__."last_login_from_ip"),
      'lastLoginFromSubnet'::text,
      (__local_0__."last_login_from_subnet"),
      'userMac'::text,
      (__local_0__."user_mac"),
      '@issue27UserExists'::text,
      (
        select to_json(__local_1__) as "value"
        from "c"."person_exists"(
          __local_0__,
          $2
        ) as __local_1__
        where (TRUE) and (TRUE)
      )
    )
  )
) as "@person",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@a",
to_json(
  (
    json_build_object(
      '__order_primary_key_desc'::text,
      json_build_array(
        'primary_key_desc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@b",
to_json(
  (
    json_build_object(
      '__order_id_asc'::text,
      json_build_array(
        'id_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@c",
to_json(
  (
    json_build_object(
      '__order_id_desc'::text,
      json_build_array(
        'id_desc'::text,
        json_build_array(__local_0__."id")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@d",
to_json(
  (
    json_build_object(
      '__order_email_asc'::text,
      json_build_array(
        'email_asc'::text,
        json_build_array(__local_0__."email")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@e",
to_json(
  (
    json_build_object(
      '__order_email_desc'::text,
      json_build_array(
        'email_desc'::text,
        json_build_array(__local_0__."email")
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@f",
to_json(
  (
    json_build_object(
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@g",
to_json(
  (
    json_build_object(
      '__order_email_desc__id_desc'::text,
      json_build_array(
        'email_desc'::text,
        'id_desc'::text,
        json_build_array(
          __local_0__."email",
          __local_0__."id"
        )
      ),
      '__identifiers'::text,
      json_build_array(__local_0__."id"),
      '@node'::text,
      (
        json_build_object(
          '__identifiers'::text,
          json_build_array(__local_0__."id"),
          'name'::text,
          (__local_0__."person_full_name")
        )
      )
    )
  )
) as "@h"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "c"."person" (
    "id",
    "person_full_name",
    "about",
    "email"
  ) values(
    $1,
    $2,
    NULL,
    $3
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
    str::"c"."person"
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
      '@issue27UserExists'::text,
      (
        select to_json(__local_1__) as "value"
        from "c"."person_exists"(
          __local_0__,
          $2
        ) as __local_1__
        where (TRUE) and (TRUE)
      )
    )
  )
) as "@person"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "a"."default_value" (
    "id",
    "null_value"
  ) values(
    $1,
    NULL
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
    str::"a"."default_value"
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
      'nullValue'::text,
      (__local_0__."null_value")
    )
  )
) as "@defaultValue"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "a"."post" (
    "headline",
    "comptypes"
  ) values(
    $1,
    array[row(
      $2::"pg_catalog"."timestamptz",
      $3::"pg_catalog"."bool"
    )::"a"."comptype",
    row(
      $4::"pg_catalog"."timestamptz",
      $5::"pg_catalog"."bool"
    )::"a"."comptype",
    row(
      $6::"pg_catalog"."timestamptz",
      NULL
    )::"a"."comptype"]::"a"."_comptype"
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
    str::"a"."post"
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
      'headline'::text,
      (__local_0__."headline"),
      'comptypes'::text,
      (
        case when (__local_0__."comptypes") is null then null when coalesce(
          array_length(
            (__local_0__."comptypes"),
            1
          ),
          0
        ) = 0 then '[]'::json else (
          select json_agg(
            (
              case when (
                __local_1__ is not distinct
                from null
              ) then null else json_build_object(
                'schedule'::text,
                (__local_1__."schedule"),
                'isOptimised'::text,
                (__local_1__."is_optimised")
              ) end
            )
          )
          from unnest((__local_0__."comptypes")) as __local_1__
        ) end
      )
    )
  )
) as "@post"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation

SAVEPOINT graphql_mutation

with __local_0__ as (
  insert into "a"."post" (
    "headline",
    "author_id",
    "comptypes"
  ) values(
    $1,
    $2,
    array[row(
      $3::"pg_catalog"."timestamptz",
      $4::"pg_catalog"."bool"
    )::"a"."comptype",
    row(
      $5::"pg_catalog"."timestamptz",
      $6::"pg_catalog"."bool"
    )::"a"."comptype",
    row(
      $7::"pg_catalog"."timestamptz",
      NULL
    )::"a"."comptype"]::"a"."_comptype"
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
    str::"a"."post"
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
      'headline'::text,
      (__local_0__."headline"),
      'comptypes'::text,
      (
        case when (__local_0__."comptypes") is null then null when coalesce(
          array_length(
            (__local_0__."comptypes"),
            1
          ),
          0
        ) = 0 then '[]'::json else (
          select json_agg(
            (
              case when (
                __local_1__ is not distinct
                from null
              ) then null else json_build_object(
                'schedule'::text,
                (__local_1__."schedule"),
                'isOptimised'::text,
                (__local_1__."is_optimised")
              ) end
            )
          )
          from unnest((__local_0__."comptypes")) as __local_1__
        ) end
      ),
      '@personByAuthorId'::text,
      (
        select json_build_object(
          'id'::text,
          (__local_2__."id")
        ) as object
        from "c"."person" as __local_2__
        where (__local_0__."author_id" = __local_2__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@post",
to_json(
  (
    json_build_object(
      '@personByAuthorId'::text,
      (
        select json_build_object(
          'email'::text,
          (__local_3__."email")
        ) as object
        from "c"."person" as __local_3__
        where (__local_0__."author_id" = __local_3__."id") and (TRUE) and (TRUE)
      )
    )
  )
) as "@p2",
to_json(
  (
    json_build_object(
      '__order_primary_key_asc'::text,
      json_build_array(
        'primary_key_asc'::text,
        json_build_array(__local_0__."id")
      ),
      '@node'::text,
      (
        json_build_object(
          'id'::text,
          (__local_0__."id"),
          'headline'::text,
          (__local_0__."headline"),
          'comptypes'::text,
          (
            case when (__local_0__."comptypes") is null then null when coalesce(
              array_length(
                (__local_0__."comptypes"),
                1
              ),
              0
            ) = 0 then '[]'::json else (
              select json_agg(
                (
                  case when (
                    __local_4__ is not distinct
                    from null
                  ) then null else json_build_object(
                    'schedule'::text,
                    (__local_4__."schedule"),
                    'isOptimised'::text,
                    (__local_4__."is_optimised")
                  ) end
                )
              )
              from unnest((__local_0__."comptypes")) as __local_4__
            ) end
          ),
          '@personByAuthorId'::text,
          (
            select json_build_object(
              'name'::text,
              (__local_5__."person_full_name")
            ) as object
            from "c"."person" as __local_5__
            where (__local_0__."author_id" = __local_5__."id") and (TRUE) and (TRUE)
          )
        )
      )
    )
  )
) as "@postEdge",
to_json(
  (
    select json_build_object(
      'createdAt'::text,
      (__local_6__."created_at")
    ) as object
    from "c"."person" as __local_6__
    where (__local_0__."author_id" = __local_6__."id") and (TRUE) and (TRUE)
  )
) as "@personByAuthorId"
from __local_0__ as __local_0__
where (TRUE) and (TRUE)

RELEASE SAVEPOINT graphql_mutation