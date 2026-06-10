insert into "polymorphic"."relational_item_relations" as __relational_item_relations__ ("child_id", "parent_id") values ($1::"int4", $2::"int4") returning
  __relational_item_relations__."id"::text as "0",
  __relational_item_relations__."child_id"::text as "1",
  __relational_item_relations__."parent_id"::text as "2";

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
  __relational_topics__."topic_item_id"::text as "0"
from "polymorphic"."relational_topics" as __relational_topics__
where (
  __relational_topics__."topic_item_id" = $1::"int4"
);

select
  __relational_topics__."topic_item_id"::text as "0"
from "polymorphic"."relational_topics" as __relational_topics__
where (
  __relational_topics__."topic_item_id" = $1::"int4"
);

insert into "polymorphic"."relational_item_relation_composite_pks" as __relational_item_relation_composite_pks__ ("child_id", "parent_id") values ($1::"int4", $2::"int4") returning
  __relational_item_relation_composite_pks__."parent_id"::text as "0",
  __relational_item_relation_composite_pks__."child_id"::text as "1";

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
  __relational_topics__."topic_item_id"::text as "0"
from "polymorphic"."relational_topics" as __relational_topics__
where (
  __relational_topics__."topic_item_id" = $1::"int4"
);

select
  __relational_topics__."topic_item_id"::text as "0"
from "polymorphic"."relational_topics" as __relational_topics__
where (
  __relational_topics__."topic_item_id" = $1::"int4"
);

insert into "polymorphic"."single_table_item_relations" as __single_table_item_relations__ ("child_id", "parent_id") values ($1::"int4", $2::"int4") returning
  __single_table_item_relations__."id"::text as "0",
  __single_table_item_relations__."child_id"::text as "1",
  __single_table_item_relations__."parent_id"::text as "2";

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
);

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
);

insert into "polymorphic"."single_table_item_relation_composite_pks" as __single_table_item_relation_composite_pks__ ("child_id", "parent_id") values ($1::"int4", $2::"int4") returning
  __single_table_item_relation_composite_pks__."parent_id"::text as "0",
  __single_table_item_relation_composite_pks__."child_id"::text as "1";

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
);

select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
);