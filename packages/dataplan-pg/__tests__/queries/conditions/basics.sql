select
  __forums__."name" as "0",
  (select json_agg(_) from (
    select
      __messages__."body" as "0"
    from app_public.messages as __messages__
    where
      (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      ) and (
        __forums__."id"::"uuid" = __messages__."forum_id"
      )
    order by __messages__."id" asc
    limit 2
  ) _) as "1",
  __forums__."id" as "2",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZHTZM'::text) as "3"
from app_public.forums as __forums__
where (
  true /* authorization checks */
)
order by __forums__."id" asc