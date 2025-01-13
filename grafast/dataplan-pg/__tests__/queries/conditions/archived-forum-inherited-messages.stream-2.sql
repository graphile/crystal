select
  __forums__."name" as "0",
  (select json_agg(s) from (
    select
      (count(*))::text as "0"
    from app_public.messages as __messages__
    where
      (
        (__messages__.archived_at is null) = (__forums__."archived_at" is null)
      ) and (
        __forums__."id"::"uuid" = __messages__."forum_id"
      )
  ) s) as "1",
  __forums__."id" as "2",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "3"
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
select
  __messages__."body" as "0",
  __users__."username" as "1",
  __users__."gravatar_url" as "2"
from app_public.messages as __messages__
left outer join app_public.users as __users__
on (
  (
    __messages__."author_id"::"uuid" = __users__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
where
  (
    (__messages__.archived_at is null) = ($1::"timestamptz" is null)
  ) and (
    __messages__."forum_id" = $2::"uuid"
  )
order by __messages__."id" asc;

fetch forward 100 from __SNAPSHOT_CURSOR_0__

close __SNAPSHOT_CURSOR_0__

commit; /*fake*/

begin; /*fake*/

declare __SNAPSHOT_CURSOR_1__ insensitive no scroll cursor without hold for
select
  __messages__."id" as "0",
  __messages__."body" as "1",
  __users__."username" as "2",
  __users__."gravatar_url" as "3"
from app_public.messages as __messages__
left outer join app_public.users as __users__
on (
  (
    __messages__."author_id"::"uuid" = __users__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
where
  (
    (__messages__.archived_at is null) = ($1::"timestamptz" is null)
  ) and (
    __messages__."forum_id" = $2::"uuid"
  )
order by __messages__."id" asc;

fetch forward 100 from __SNAPSHOT_CURSOR_1__

close __SNAPSHOT_CURSOR_1__

commit; /*fake*/
