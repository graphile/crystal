select
  (select json_agg(s) from (
    select
      __forums_messages_list_set__."body" as "0",
      __forums_messages_list_set__."featured"::text as "1",
      __forums_messages_list_set_idx__::text as "2",
      __forums_messages_list_set__."id" as "3"
    from app_public.forums_messages_list_set(__forums__) with ordinality as __forums_messages_list_set_tmp__ (arr, __forums_messages_list_set_idx__) cross join lateral unnest (__forums_messages_list_set_tmp__.arr) as __forums_messages_list_set__
    where (
      true /* authorization checks */
    )
  ) s) as "0",
  __forums__."id" as "1"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc;
