select 
  __forums__."name"::text as "0",
  array(
    select array[
      __messages__."body"::text
    ]::text[]
    from app_public.messages as __messages__
    where (
      (__messages__.archived_at is null) = (__forums__."archived_at" is null)
    ) and (
      __forums__."id"::"uuid" = __messages__."forum_id"
    )
    order by __messages__."id" asc
    limit 2
  ) as "1",
  __forums__."id"::text as "2",
  __forums__."archived_at"::text as "3"
from app_public.forums as __forums__
where (
  true /* authorization checks */
)
order by __forums__."id" asc