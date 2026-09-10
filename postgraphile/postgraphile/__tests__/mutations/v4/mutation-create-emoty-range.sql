insert into "b"."types" as __types__ ("id", "smallint", "bigint", "numeric", "decimal", "boolean", "varchar", "enum", "enum_array", "domain", "domain2", "text_array", "json", "jsonb", "numrange", "daterange", "an_int_range", "timestamp", "timestamptz", "date", "time", "timetz", "interval", "interval_array", "money", "compound_type", "nested_compound_type", "point", "cidr", "macaddr", "text_array_domain", "int8_array_domain") values ($1::"int4", $2::"int2", $3::"int8", $4::"numeric", $5::"numeric", $6::"bool", $7::"varchar", $8::"b"."color", $9::"b"."color"[], $10::"a"."an_int", $11::"b"."another_int", $12::"text"[], $13::"json", $14::"jsonb", $15::"pg_catalog"."numrange", $16::"pg_catalog"."daterange", $17::"a"."an_int_range", $18::"timestamp", $19::"timestamptz", $20::"date", $21::"time", $22::"timetz", $23::"interval", $24::"interval"[], $25::"money", $26::"c"."compound_type", $27::"b"."nested_compound_type", $28::"point", $29::"cidr", $30::"macaddr", $31::"c"."text_array_domain", $32::"c"."int8_array_domain") returning
  __types__."id"::text as "0",
  __types__."numrange"::text as "1",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange"),
    isempty(__types__."daterange")
  )::text as "2",
  __types__."an_int_range"::text as "3";