update "a"."similar_table_1" as __similar_table_1__ set "col1" = $1::"int4" where (__similar_table_1__."id" = $2::"int4") returning
  __similar_table_1__."id"::text as "0",
  __similar_table_1__."col1"::text as "1",
  __similar_table_1__."col2"::text as "2",
  __similar_table_1__."col3"::text as "3";