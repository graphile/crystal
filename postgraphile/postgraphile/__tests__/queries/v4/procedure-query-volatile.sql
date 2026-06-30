select
  __table_set_query_volatile__."person_full_name" as "0",
  (row_number() over (partition by 1))::text as "1"
from "c"."table_set_query_volatile"() as __table_set_query_volatile__
where (
  __table_set_query_volatile__."person_full_name" = $1::"varchar"
)
limit 3;

select
  __table_set_query_volatile__."person_full_name" as "0"
from "c"."table_set_query_volatile"() as __table_set_query_volatile__
where (
  __table_set_query_volatile__."person_full_name" = $1::"varchar"
)
limit 2;