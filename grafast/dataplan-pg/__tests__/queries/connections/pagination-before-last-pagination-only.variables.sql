select /* NOTHING?! */
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__.archived_at is null
  ) and (
    __messages__."id" < $1::"uuid"
  )
order by __messages__."id" desc
limit 4;

select
  (count(*))::text as "0"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__.archived_at is null
  );
