select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __forums__."name" as "5",
  (__forums__.archived_at is not null)::text as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
/* WHERE becoming ON */
  (
    __forums__."id" = __messages__."forum_id"
  ) and (
    true /* authorization checks */
  )
)
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
    __messages__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __forums__."name" as "5",
  (__forums__.archived_at is not null)::text as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
/* WHERE becoming ON */
  (
    __forums__."id" = __messages__."forum_id"
  ) and (
    true /* authorization checks */
  )
)
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
    __messages__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __forums__."name" as "5",
  (__forums__.archived_at is not null)::text as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
/* WHERE becoming ON */
  (
    __forums__."id" = __messages__."forum_id"
  ) and (
    true /* authorization checks */
  )
)
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
    __messages__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __forums__."name" as "5",
  (__forums__.archived_at is not null)::text as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
/* WHERE becoming ON */
  (
    __forums__."id" = __messages__."forum_id"
  ) and (
    true /* authorization checks */
  )
)
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
    __messages__."id" = $1::"uuid"
  ) and (
    true /* authorization checks */
  );
