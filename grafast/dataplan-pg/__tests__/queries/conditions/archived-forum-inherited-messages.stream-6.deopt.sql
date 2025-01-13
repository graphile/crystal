select
  __forums__."name" as "0",
  __forums__."id" as "1",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2"
from app_public.forums as __forums__
where
  (
    __forums__.archived_at is not null
  ) and (
    true /* authorization checks */
  )
order by __forums__."id" asc;

begin; /*fake*/

declare __SNAPSHOT_CURSOR_0__ insensitive no scroll cursor without hold for
select __messages_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0" from json_array_elements($2::json) with ordinality as ids) as __messages_identifiers__,
lateral (
  select *
  from (
    select
      __messages__."body" as "0",
      __messages__."author_id" as "1",
      __messages_identifiers__.idx as "2",
      row_number() over (
        order by __messages__."id" asc
      ) as "3"
    from app_public.messages as __messages__
    where
      (
        (__messages__.archived_at is null) = ($1::"timestamptz" is null)
      ) and (
        __messages__."forum_id" = __messages_identifiers__."id0"
      )
    order by __messages__."id" asc
  ) __stream_wrapped__
  order by __stream_wrapped__."3"
) as __messages_result__;

fetch forward 100 from __SNAPSHOT_CURSOR_0__

close __SNAPSHOT_CURSOR_0__

commit; /*fake*/

begin; /*fake*/

declare __SNAPSHOT_CURSOR_1__ insensitive no scroll cursor without hold for
select __messages_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0" from json_array_elements($2::json) with ordinality as ids) as __messages_identifiers__,
lateral (
  select *
  from (
    select
      __messages__."id" as "0",
      __messages__."body" as "1",
      __messages__."author_id" as "2",
      __messages_identifiers__.idx as "3",
      row_number() over (
        order by __messages__."id" asc
      ) as "4"
    from app_public.messages as __messages__
    where
      (
        (__messages__.archived_at is null) = ($1::"timestamptz" is null)
      ) and (
        __messages__."forum_id" = __messages_identifiers__."id0"
      )
    order by __messages__."id" asc
  ) __stream_wrapped__
  order by __stream_wrapped__."4"
) as __messages_result__;

fetch forward 100 from __SNAPSHOT_CURSOR_1__

close __SNAPSHOT_CURSOR_1__

commit; /*fake*/

select __messages_result__.*
from (select 0 as idx, $2::"uuid" as "id0") as __messages_identifiers__,
lateral (
  select
    (count(*))::text as "0",
    __messages_identifiers__.idx as "1"
  from app_public.messages as __messages__
  where
    (
      (__messages__.archived_at is null) = ($1::"timestamptz" is null)
    ) and (
      __messages__."forum_id" = __messages_identifiers__."id0"
    )
) as __messages_result__;

select __users_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"uuid" as "id0" from json_array_elements($1::json) with ordinality as ids) as __users_identifiers__,
lateral (
  select
    __users__."username" as "0",
    __users__."gravatar_url" as "1",
    __users_identifiers__.idx as "2"
  from app_public.users as __users__
  where
    (
      true /* authorization checks */
    ) and (
      __users__."id" = __users_identifiers__."id0"
    )
) as __users_result__;
