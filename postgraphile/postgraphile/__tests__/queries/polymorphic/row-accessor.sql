select
  __relational_items__."id"::text as "0",
  __relational_items__."type"::text as "1"
from "polymorphic"."relational_items" as __relational_items__
where (
  __relational_items__."id" = $1::"int4"
);

select
  __relational_items__."id"::text as "0",
  __relational_items__."type"::text as "1"
from "polymorphic"."relational_items" as __relational_items__
where (
  __relational_items__."id" = $1::"int4"
);

select
  __relational_items__."id"::text as "0",
  __relational_items__."type"::text as "1"
from "polymorphic"."relational_items" as __relational_items__
where (
  __relational_items__."id" = $1::"int4"
);

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
);

select
  __relational_topics__."topic_item_id"::text as "0"
from "polymorphic"."relational_topics" as __relational_topics__
where (
  __relational_topics__."topic_item_id" = $1::"int4"
);

select
  __relational_checklists__."checklist_item_id"::text as "0"
from "polymorphic"."relational_checklists" as __relational_checklists__
where (
  __relational_checklists__."checklist_item_id" = $1::"int4"
);