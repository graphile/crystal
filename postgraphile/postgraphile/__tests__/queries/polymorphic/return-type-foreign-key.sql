select
  __foreign_key_return_type_tests__."id"::text as "0",
  __single_table_items__."id"::text as "1",
  __single_table_items__."title" as "2"
from "polymorphic"."foreign_key_return_type_tests" as __foreign_key_return_type_tests__
left outer join "polymorphic"."single_table_items" as __single_table_items__
on (
/* WHERE becoming ON */ (
  __single_table_items__."id" = __foreign_key_return_type_tests__."topic_id"
))
order by __foreign_key_return_type_tests__."id" asc;