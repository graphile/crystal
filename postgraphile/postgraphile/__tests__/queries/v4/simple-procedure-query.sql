select
  __compound_type_set_query__."a"::text as "0",
  __compound_type_set_query__."b" as "1",
  __compound_type_set_query__."c"::text as "2",
  __compound_type_set_query__."d" as "3",
  __compound_type_set_query__."e"::text as "4",
  __compound_type_set_query__."f"::text as "5",
  to_char(__compound_type_set_query__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
  (not (__compound_type_set_query__ is null))::text as "7"
from "c"."compound_type_set_query"() as __compound_type_set_query__
limit 5;

select
  __table_set_query__."person_full_name" as "0"
from "c"."table_set_query"() as __table_set_query__;

select
  __table_set_query__."person_full_name" as "0"
from "c"."table_set_query"() as __table_set_query__
limit 2
offset 2;

select
  __int_set_query__.v::text as "0"
from "c"."int_set_query"(
  $1::"int4",
  $2::"int4",
  $3::"int4"
) as __int_set_query__(v);

select
  __static_big_integer__.v::text as "0"
from "a"."static_big_integer"() as __static_big_integer__(v);

select
  to_char(__query_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "0"
from "a"."query_interval_set"() as __query_interval_set__(v);

select
  __post__."id"::text as "0",
  array(
    select array[
      to_char(__post_computed_interval_set__.v, 'YYYY_MM_DD_HH24_MI_SS.US'::text)
    ]::text[]
    from "a"."post_computed_interval_set"(__post__) as __post_computed_interval_set__(v)
  )::text as "1"
from "a"."post" as __post__
order by __post__."id" asc
limit 1;