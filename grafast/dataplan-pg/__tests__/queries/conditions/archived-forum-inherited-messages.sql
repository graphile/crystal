select
  __forums__."name" as "0",
  __forums__."id" as "1",
  to_char(__forums__."archived_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "2"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__.archived_at is not null
  )
order by __forums__."id" asc;

select
  __messages__."body" as "0",
  __users__."username" as "1",
  __users__."gravatar_url" as "2",
  __messages__."id" as "3"
from app_public.messages as __messages__
left outer join app_public.users as __users__
on (
/* WHERE becoming ON */
  (
    __users__."id" = __messages__."author_id"
  ) and (
    true /* authorization checks */
  )
)
where
  (
    __messages__."forum_id" = $1::"uuid"
  ) and (
    (__messages__.archived_at is null) = ($2::"timestamptz" is null)
  )
order by __messages__."id" asc;

select
  (count(*))::text as "0"
from app_public.messages as __messages__
where
  (
    __messages__."forum_id" = $1::"uuid"
  ) and (
    (__messages__.archived_at is null) = ($2::"timestamptz" is null)
  );
