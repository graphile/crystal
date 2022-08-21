insert into "enum_tables"."referencing_table" as __referencing_table__ ("enum_1", "enum_2") values ($1::"text", $2::"varchar") returning
  __referencing_table__."id"::text as "0",
  __referencing_table__."enum_1"::text as "1",
  __referencing_table__."enum_2"::text as "2",
  __referencing_table__."enum_3"::text as "3"
