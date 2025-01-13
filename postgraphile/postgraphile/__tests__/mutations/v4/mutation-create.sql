insert into "b"."types" as __types__ ("id", "smallint", "bigint", "numeric", "decimal", "boolean", "varchar", "enum", "enum_array", "domain", "domain2", "text_array", "json", "jsonb", "numrange", "daterange", "an_int_range", "timestamp", "timestamptz", "date", "time", "timetz", "interval", "interval_array", "money", "compound_type", "nested_compound_type", "point", "cidr", "macaddr", "text_array_domain", "int8_array_domain") values ($1::"int4", $2::"int2", $3::"int8", $4::"numeric", $5::"numeric", $6::"bool", $7::"varchar", $8::"b"."color", $9::"b"."color"[], $10::"a"."an_int", $11::"b"."another_int", $12::"text"[], $13::"json", $14::"jsonb", $15::"pg_catalog"."numrange", $16::"pg_catalog"."daterange", $17::"a"."an_int_range", $18::"timestamp", $19::"timestamptz", $20::"date", $21::"time", $22::"timetz", $23::"interval", $24::"interval"[], $25::"money", $26::"c"."compound_type", $27::"b"."nested_compound_type", $28::"point", $29::"cidr", $30::"macaddr", $31::"c"."text_array_domain", $32::"c"."int8_array_domain") returning
  __types__."id"::text as "0",
  __types__."smallint"::text as "1",
  __types__."bigint"::text as "2",
  __types__."numeric"::text as "3",
  __types__."decimal"::text as "4",
  __types__."boolean"::text as "5",
  __types__."varchar" as "6",
  __types__."enum"::text as "7",
  __types__."enum_array"::text as "8",
  __types__."domain"::text as "9",
  __types__."domain2"::text as "10",
  __types__."text_array"::text as "11",
  __types__."json"::text as "12",
  __types__."jsonb"::text as "13",
  __types__."numrange"::text as "14",
  json_build_array(
    lower_inc(__types__."daterange"),
    to_char(lower(__types__."daterange"), 'YYYY-MM-DD'::text),
    to_char(upper(__types__."daterange"), 'YYYY-MM-DD'::text),
    upper_inc(__types__."daterange")
  )::text as "15",
  __types__."an_int_range"::text as "16",
  to_char(__types__."timestamp", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "17",
  to_char(__types__."timestamptz", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "18",
  to_char(__types__."date", 'YYYY-MM-DD'::text) as "19",
  to_char(date '1970-01-01' + __types__."time", 'HH24:MI:SS.US'::text) as "20",
  to_char(date '1970-01-01' + __types__."timetz", 'HH24:MI:SS.USTZH:TZM'::text) as "21",
  to_char(__types__."interval", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "22",
  array(
    select to_char(__entry__, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    from unnest(__types__."interval_array") __entry__
  )::text as "23",
  __types__."money"::numeric::text as "24",
  case when (__types__."compound_type") is not distinct from null then null::text else json_build_array((((__types__."compound_type")."a"))::text, ((__types__."compound_type")."b"), (((__types__."compound_type")."c"))::text, ((__types__."compound_type")."d"), (((__types__."compound_type")."e"))::text, (((__types__."compound_type")."f"))::text, to_char(((__types__."compound_type")."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((__types__."compound_type")."foo_bar"))::text)::text end as "25",
  case when (__types__."nested_compound_type") is not distinct from null then null::text else json_build_array(case when (((__types__."nested_compound_type")."a")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."a"))."a"))::text, ((((__types__."nested_compound_type")."a"))."b"), (((((__types__."nested_compound_type")."a"))."c"))::text, ((((__types__."nested_compound_type")."a"))."d"), (((((__types__."nested_compound_type")."a"))."e"))::text, (((((__types__."nested_compound_type")."a"))."f"))::text, to_char(((((__types__."nested_compound_type")."a"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."a"))."foo_bar"))::text)::text end, case when (((__types__."nested_compound_type")."b")) is not distinct from null then null::text else json_build_array((((((__types__."nested_compound_type")."b"))."a"))::text, ((((__types__."nested_compound_type")."b"))."b"), (((((__types__."nested_compound_type")."b"))."c"))::text, ((((__types__."nested_compound_type")."b"))."d"), (((((__types__."nested_compound_type")."b"))."e"))::text, (((((__types__."nested_compound_type")."b"))."f"))::text, to_char(((((__types__."nested_compound_type")."b"))."g"), 'YYYY_MM_DD_HH24_MI_SS.US'::text), (((((__types__."nested_compound_type")."b"))."foo_bar"))::text)::text end, (((__types__."nested_compound_type")."baz_buz"))::text)::text end as "26",
  __types__."point"::text as "27",
  __types__."nullablePoint"::text as "28",
  __types__."inet"::text as "29",
  __types__."cidr"::text as "30",
  __types__."macaddr"::text as "31",
  __types__."text_array_domain"::text as "32",
  __types__."int8_array_domain"::text as "33";

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7"
from (select ($1::"c"."compound_type").*) as __frmcdc_compound_type__;

select
  __frmcdc_compound_type__."a"::text as "0",
  __frmcdc_compound_type__."b" as "1",
  __frmcdc_compound_type__."c"::text as "2",
  __frmcdc_compound_type__."d" as "3",
  __frmcdc_compound_type__."e"::text as "4",
  __frmcdc_compound_type__."f"::text as "5",
  __frmcdc_compound_type__."foo_bar"::text as "6",
  (not (__frmcdc_compound_type__ is null))::text as "7",
  __frmcdc_compound_type_2."a"::text as "8",
  __frmcdc_compound_type_2."b" as "9",
  __frmcdc_compound_type_2."c"::text as "10",
  __frmcdc_compound_type_2."d" as "11",
  __frmcdc_compound_type_2."e"::text as "12",
  __frmcdc_compound_type_2."f"::text as "13",
  __frmcdc_compound_type_2."foo_bar"::text as "14",
  (not (__frmcdc_compound_type_2 is null))::text as "15",
  __frmcdc_nested_compound_type__."baz_buz"::text as "16",
  (not (__frmcdc_nested_compound_type__ is null))::text as "17"
from (select ($1::"b"."nested_compound_type").*) as __frmcdc_nested_compound_type__
left outer join lateral (select (__frmcdc_nested_compound_type__."a").*) as __frmcdc_compound_type__
on TRUE
left outer join lateral (select (__frmcdc_nested_compound_type__."b").*) as __frmcdc_compound_type_2
on TRUE;

insert into "c"."person" as __person__ ("id", "person_full_name", "about", "email", "config", "last_login_from_ip", "last_login_from_subnet", "user_mac") values ($1::"int4", $2::"varchar", $3::"text", $4::"b"."email", $5::"hstore", $6::"inet", $7::"cidr", $8::"macaddr") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "7",
  __person__."id"::text as "8";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" desc, __person__."id" desc
) as __person_result__;

select
  ("c"."person_exists"(
    __person__,
    $1::"b"."email"
  ))::text as "0",
  __person__."id"::text as "1"
from (select ($2::"c"."person").*) as __person__;

insert into "c"."person" as __person__ ("id", "person_full_name", "about", "email", "config", "last_login_from_ip", "last_login_from_subnet", "user_mac") values ($1::"int4", $2::"varchar", $3::"text", $4::"b"."email", $5::"hstore", $6::"inet", $7::"cidr", $8::"macaddr") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "7",
  __person__."id"::text as "8";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" desc, __person__."id" desc
) as __person_result__;

select
  ("c"."person_exists"(
    __person__,
    $1::"b"."email"
  ))::text as "0",
  __person__."id"::text as "1"
from (select ($2::"c"."person").*) as __person__;

insert into "c"."compound_key" as __compound_key__ ("person_id_2", "person_id_1", "extra") values ($1::"int4", $2::"int4", $3::"bool") returning
  __compound_key__."extra"::text as "0",
  __compound_key__."person_id_1"::text as "1",
  __compound_key__."person_id_2"::text as "2";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

insert into "c"."edge_case" as __edge_case__ ("not_null_has_default") values ($1::"bool") returning
  __edge_case__."not_null_has_default"::text as "0";

insert into "c"."edge_case" as __edge_case__ default values returning
  __edge_case__."not_null_has_default"::text as "0";

insert into "c"."person" as __person__ ("id", "person_full_name", "about", "email", "config", "last_login_from_ip", "last_login_from_subnet", "user_mac") values ($1::"int4", $2::"varchar", $3::"text", $4::"b"."email", $5::"hstore", $6::"inet", $7::"cidr", $8::"macaddr") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6",
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "7",
  __person__."id"::text as "8";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" desc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."email" as "0",
    __person__."id"::text as "1",
    __person__."person_full_name" as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."email" desc, __person__."id" desc
) as __person_result__;

select
  ("c"."person_exists"(
    __person__,
    $1::"b"."email"
  ))::text as "0",
  __person__."id"::text as "1"
from (select ($2::"c"."person").*) as __person__;

insert into "c"."person" as __person__ ("id", "person_full_name", "about", "email") values ($1::"int4", $2::"varchar", $3::"text", $4::"b"."email") returning
  case when (__person__) is not distinct from null then null::text else json_build_array((((__person__)."id"))::text, ((__person__)."person_full_name"), (((__person__)."aliases"))::text, ((__person__)."about"), ((__person__)."email"), case when (((__person__)."site")) is not distinct from null then null::text else json_build_array(((((__person__)."site"))."url"))::text end, (((__person__)."config"))::text, (((__person__)."last_login_from_ip"))::text, (((__person__)."last_login_from_subnet"))::text, (((__person__)."user_mac"))::text, to_char(((__person__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.US'::text))::text end as "0";

select
  ("c"."person_exists"(
    __person__,
    $1::"b"."email"
  ))::text as "0",
  __person__."id"::text as "1"
from (select ($2::"c"."person").*) as __person__;

insert into "a"."default_value" as __default_value__ ("id", "null_value") values ($1::"int4", $2::"text") returning
  __default_value__."id"::text as "0",
  __default_value__."null_value" as "1";

insert into "a"."post" as __post__ ("headline", "comptypes") values ($1::"text", $2::"a"."comptype"[]) returning
  __post__."id"::text as "0",
  __post__."headline" as "1",
  (case when (__post__."comptypes") is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(__post__."comptypes") __comptype__
  )::text end) as "2";

select
  to_char(__frmcdc_comptype__."schedule", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
  __frmcdc_comptype__."is_optimised"::text as "1",
  (not (__frmcdc_comptype__ is null))::text as "2"
from unnest($1::"a"."comptype"[]) as __frmcdc_comptype__;

insert into "a"."post" as __post__ ("headline", "author_id", "comptypes") values ($1::"text", $2::"int4", $3::"a"."comptype"[]) returning
  __post__."headline" as "0",
  (case when (__post__."comptypes") is not distinct from null then null::text else array(
    select case when (__comptype__) is not distinct from null then null::text else json_build_array(to_char(((__comptype__)."schedule"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__comptype__)."is_optimised"))::text)::text end
    from unnest(__post__."comptypes") __comptype__
  )::text end) as "1",
  __post__."id"::text as "2",
  __post__."author_id"::text as "3";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."email" as "1",
    to_char(__person__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.US'::text) as "2",
    __person_identifiers__.idx as "3"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __post_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __post_identifiers__,
lateral (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    (select json_agg(s) from (
      select
        to_char(__frmcdc_comptype__."schedule", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
        __frmcdc_comptype__."is_optimised"::text as "1",
        (not (__frmcdc_comptype__ is null))::text as "2"
      from unnest(__post__."comptypes") as __frmcdc_comptype__
    ) s) as "2",
    __person__."person_full_name" as "3",
    __post_identifiers__.idx as "4"
  from "a"."post" as __post__
  left outer join "c"."person" as __person__
  on (__post__."author_id"::"int4" = __person__."id")
  where (
    __post__."id" = __post_identifiers__."id0"
  )
  order by __post__."id" asc
) as __post_result__;

select
  to_char(__frmcdc_comptype__."schedule", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "0",
  __frmcdc_comptype__."is_optimised"::text as "1",
  (not (__frmcdc_comptype__ is null))::text as "2"
from unnest($1::"a"."comptype"[]) as __frmcdc_comptype__;