select
  __single_table_items__."id"::text as "0",
  __single_table_items__."type"::text as "1",
  case when (__single_table_items__) is not distinct from null then null::text else json_build_array(
    (((__single_table_items__)."id"))::text,
    (((__single_table_items__)."type"))::text,
    (((__single_table_items__)."parent_id"))::text,
    (((__single_table_items__)."root_topic_id"))::text,
    (((__single_table_items__)."author_id"))::text,
    (((__single_table_items__)."position"))::text,
    to_char(((__single_table_items__)."created_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
    to_char(((__single_table_items__)."updated_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
    (((__single_table_items__)."is_explicitly_archived"))::text,
    to_char(((__single_table_items__)."archived_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text),
    ((__single_table_items__)."title"),
    ((__single_table_items__)."description"),
    ((__single_table_items__)."note"),
    ((__single_table_items__)."color"),
    (((__single_table_items__)."priority_id"))::text
  )::text end as "2"
from "polymorphic"."single_table_items" as __single_table_items__
where (
  __single_table_items__."id" = $1::"int4"
)
order by __single_table_items__."id" asc;

select
  __single_table_items_topics__."id"::text as "0",
  __single_table_items_topics__."title" as "1"
from "polymorphic"."single_table_items_topics"($1::"polymorphic"."single_table_items") as __single_table_items_topics__
limit 2;

select
  __single_table_items_topics__."id"::text as "0",
  __single_table_items_topics__."title" as "1"
from "polymorphic"."single_table_items_topics"($1::"polymorphic"."single_table_items") as __single_table_items_topics__;