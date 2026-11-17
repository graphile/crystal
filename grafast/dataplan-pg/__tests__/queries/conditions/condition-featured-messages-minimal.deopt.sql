select
  __forums__."id" as "0",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is null
  )
order by __forums__."id" asc;

with __messages_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, ids.id0, ids.id1 from rows from (json_to_recordset($2::json) as (id0 "uuid", id1 "timestamptz")) with ordinality as ids
)
select __messages_result__.*
from __messages_identifiers__,
lateral (
  select
    __messages_identifiers__.idx as "0"
  from app_public.messages as __messages__
  where
    (
      __messages__."forum_id" = __messages_identifiers__."id0"
    ) and (
      __messages__.featured = $1::"bool"
    ) and (
      (__messages__.archived_at is null) = (__messages_identifiers__."id1" is null)
    )
  order by __messages__."id" asc
  limit 6
) as __messages_result__;

with __messages_identifiers__ as materialized (
  select ids.ordinality - 1 as idx, ids.id0, ids.id1 from rows from (json_to_recordset($2::json) as (id0 "uuid", id1 "timestamptz")) with ordinality as ids
)
select __messages_result__.*
from __messages_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __messages_identifiers__.idx as "1"
  from app_public.messages as __messages__
  where
    (
      __messages__."forum_id" = __messages_identifiers__."id0"
    ) and (
      __messages__.featured = $1::"bool"
    ) and (
      (__messages__.archived_at is null) = (__messages_identifiers__."id1" is null)
    )
) as __messages_result__;
