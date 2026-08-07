select
  __messages__."id" as "0"
from app_public.messages as __messages__
where
  (
    __messages__.id = any($1::"uuid"[])
  ) and (
    true /* authorization checks */
  )
order by __messages__."id" asc;

select
  __messages__."id" as "0"
from app_public.messages as __messages__
where
  (
    true /* connection */
  ) and (
    __messages__.id = any($1::"uuid"[])
  ) and (
    true /* authorization checks */
  )
order by __messages__."id" asc;

select
  (count(*))::text as "0"
from app_public.messages as __messages__
where
  (
    true /* connection */
  ) and (
    __messages__.id = any($1::"uuid"[])
  ) and (
    true /* authorization checks */
  );
