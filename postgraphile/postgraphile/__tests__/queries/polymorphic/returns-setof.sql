select
  (count(*))::text as "0",
  __all_single_tables__."type"::text as "1"
from "polymorphic"."all_single_tables"() as __all_single_tables__;