select
  __list_of_compound_types_mutation__."a"::text as "0",
  __list_of_compound_types_mutation__."b" as "1",
  __list_of_compound_types_mutation__."c"::text as "2",
  __list_of_compound_types_mutation__."d" as "3",
  __list_of_compound_types_mutation__."e"::text as "4",
  __list_of_compound_types_mutation__."f"::text as "5",
  to_char(__list_of_compound_types_mutation__."g", 'YYYY_MM_DD_HH24_MI_SS.US'::text) as "6",
  __list_of_compound_types_mutation__."foo_bar"::text as "7",
  (not (__list_of_compound_types_mutation__ is null))::text as "8"
from "c"."list_of_compound_types_mutation"($1::"c"."compound_type"[]) as __list_of_compound_types_mutation__;