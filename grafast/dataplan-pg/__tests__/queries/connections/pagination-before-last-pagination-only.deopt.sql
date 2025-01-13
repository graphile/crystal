select __messages_result__.*
from (select 0 as idx) as __messages_identifiers__,
lateral (
  select
    __messages_identifiers__.idx as "0"
  from app_public.messages as __messages__
  where
    (
      __messages__.archived_at is null
    ) and (
      true /* authorization checks */
    ) and (
      __messages__."id" < $1::"uuid"
    )
  order by __messages__."id" desc
  limit 4
) as __messages_result__;

select
  (count(*))::text as "0"
from app_public.messages as __messages__
where
  (
    __messages__.archived_at is null
  ) and (
    true /* authorization checks */
  );
