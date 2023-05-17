select
  __referencing_table__."id"::text as "0",
  __referencing_table__."enum_1"::text as "1",
  __referencing_table__."enum_2"::text as "2",
  __referencing_table__."enum_3"::text as "3",
  __referencing_table__."simple_enum"::text as "4"
from "enum_tables"."referencing_table" as __referencing_table__
order by __referencing_table__."id" asc;