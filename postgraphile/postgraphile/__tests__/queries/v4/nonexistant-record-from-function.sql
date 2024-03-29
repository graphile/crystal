select __table_query_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __table_query_identifiers__,
lateral (
  select
    __table_query__."id"::text as "0",
    __table_query__."headline" as "1",
    __table_query_identifiers__.idx as "2"
  from "c"."table_query"(__table_query_identifiers__."id0") as __table_query__
) as __table_query_result__;