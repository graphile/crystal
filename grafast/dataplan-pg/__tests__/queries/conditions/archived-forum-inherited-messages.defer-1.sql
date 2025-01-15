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

select
  __messages__."body" as "0",
  __users__."username" as "1",
  __users__."gravatar_url" as "2",
  __messages__."id" as "3",
  __users_2."username" as "4",
  __users_2."gravatar_url" as "5"
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
left outer join app_public.users as __users_2
on (
  (
    __messages__."author_id"::"uuid" = __users_2."id"
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
