update "d"."person" as __person__ set "last_name" = $1::"varchar", "col_no_create" = $2::"text", "col_no_order" = $3::"text", "col_no_filter" = $4::"text" where (__person__."id" = $5::"int4") returning
  __person__."col_no_create_update_order_filter" as "0",
  __person__."col_no_create_update" as "1",
  __person__."col_no_filter" as "2",
  __person__."col_no_order" as "3",
  __person__."col_no_update" as "4",
  __person__."col_no_create" as "5",
  __person__."last_name" as "6",
  __person__."first_name" as "7",
  __person__."id"::text as "8"
