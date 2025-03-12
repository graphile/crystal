select
  __forums__."id" as "0",
  array(
    select array[
      __forums_messages_list_set__."body",
      __forums_messages_list_set__."featured"::text,
      __forums_messages_list_set_idx__::text,
      __forums_messages_list_set__."id"
    ]::text[]
    from app_public.forums_messages_list_set(__forums__) with ordinality as __forums_messages_list_set_tmp__ (arr, __forums_messages_list_set_idx__) cross join lateral unnest (__forums_messages_list_set_tmp__.arr) as __forums_messages_list_set__
    where (
      true /* authorization checks */
    )
  )::text as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is null
  )
order by __forums__."id" asc;
