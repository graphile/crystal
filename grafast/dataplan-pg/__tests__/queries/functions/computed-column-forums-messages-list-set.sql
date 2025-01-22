select
  case when (__forums__) is not distinct from null then null::text else json_build_array(((__forums__)."id"), ((__forums__)."name"), to_char(((__forums__)."archived_at"), 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text))::text end as "0",
  __forums__."id" as "1"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc;

select __forums_messages_list_set_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::app_public.forums as "id0" from json_array_elements($1::json) with ordinality as ids) as __forums_messages_list_set_identifiers__,
lateral (
  select
    __forums_messages_list_set__."body" as "0",
    __forums_messages_list_set__."featured"::text as "1",
    __forums_messages_list_set_idx__::text as "2",
    __forums_messages_list_set__."id" as "3",
    __forums_messages_list_set_identifiers__.idx as "4"
  from app_public.forums_messages_list_set(__forums_messages_list_set_identifiers__."id0") with ordinality as __forums_messages_list_set_tmp__ (arr, __forums_messages_list_set_idx__) cross join lateral unnest (__forums_messages_list_set_tmp__.arr) as __forums_messages_list_set__
  where (
    true /* authorization checks */
  )
) as __forums_messages_list_set_result__;
