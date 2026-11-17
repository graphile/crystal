select
  __messages__."body" as "0",
  __messages__."author_id" as "1",
  __messages__."id" as "2"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__.archived_at is null
  )
order by __messages__."id" asc
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

with __users_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, ids.id0 from rows from (json_to_recordset($1::json) as (id0 "uuid")) with ordinality as ids
)
select __users_result__.*
from __users_identifiers__,
lateral (
  select
    __users__."username" as "0",
    __users__."gravatar_url" as "1",
    __users_identifiers__.idx as "2"
  from app_public.users as __users__
  where
    (
      __users__."id" = __users_identifiers__."id0"
    ) and (
      true /* authorization checks */
    )
) as __users_result__;
