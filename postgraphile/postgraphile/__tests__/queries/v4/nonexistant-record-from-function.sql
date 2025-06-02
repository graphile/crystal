select
  __table_query__."id"::text as "0",
  __table_query__."headline" as "1"
from "c"."table_query"($1::"int4") as __table_query__;