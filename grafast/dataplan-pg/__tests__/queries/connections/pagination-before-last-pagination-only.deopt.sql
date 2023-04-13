select __messages_result__.*
from (select 0 as idx, $1::"uuid" as "id0") as __messages_identifiers__,
lateral (
  select
    __messages_identifiers__.idx as "0"
  from app_public.messages as __messages__
  where
    (
      __messages__.archived_at is null
    ) and (
      __messages__."id" < __messages_identifiers__."id0"
    ) and (
      true /* authorization checks */
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
