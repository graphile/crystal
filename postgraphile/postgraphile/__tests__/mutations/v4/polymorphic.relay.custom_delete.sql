select
  case when (__relational_items__) is not distinct from null then null::text else json_build_array((((__relational_items__)."id"))::text, (((__relational_items__)."type"))::text, (((__relational_items__)."parent_id"))::text, (((__relational_items__)."root_topic_id"))::text, (((__relational_items__)."author_id"))::text, (((__relational_items__)."position"))::text, to_char(((__relational_items__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), to_char(((__relational_items__)."updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text), (((__relational_items__)."is_explicitly_archived"))::text, to_char(((__relational_items__)."archived_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text))::text end as "0",
  __relational_items__."type"::text as "1",
  __relational_items__."id"::text as "2"
from "polymorphic"."relational_items" as __relational_items__
where (
  __relational_items__."id" = $1::"int4"
);

select
  __custom_delete_relational_item__.v::text as "0"
from "polymorphic"."custom_delete_relational_item"($1::"polymorphic"."relational_items") as __custom_delete_relational_item__(v);

select
  __relational_items__."id"::text as "0",
  __relational_items__."type"::text as "1"
from "polymorphic"."relational_items" as __relational_items__
order by __relational_items__."id" asc
limit 1;

select
  __relational_topics__."topic_item_id"::text as "0"
from "polymorphic"."relational_topics" as __relational_topics__
where (
  __relational_topics__."topic_item_id" = $1::"int4"
);