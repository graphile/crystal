select
  __similar_table_1__."id"::text as "0",
  __similar_table_1__."col2"::text as "1"
from "a"."similar_table_1" as __similar_table_1__
order by __similar_table_1__."col2" asc nulls last, __similar_table_1__."id" asc;

select
  __similar_table_1__."id"::text as "0",
  __similar_table_1__."col2"::text as "1"
from "a"."similar_table_1" as __similar_table_1__
order by __similar_table_1__."col2" desc nulls last, __similar_table_1__."id" asc;