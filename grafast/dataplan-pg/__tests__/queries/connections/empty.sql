select
  __forums__."name" as "0",
  (select json_agg(s) from (
    select /* NOTHING?! */
    from app_public.messages as __messages__
    where
      (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      ) and (
        __forums__."id"::"uuid" = __messages__."forum_id"
      )
    order by __messages__."id" asc
  ) s) as "1"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc;
