select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __forums__."name" as "4",
  (__forums__.archived_at is not null)::text as "5",
  __messages__."forum_id" as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
  (
    __messages__."forum_id"::"uuid" = __forums__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
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
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __forums__."name" as "4",
  (__forums__.archived_at is not null)::text as "5",
  __messages__."forum_id" as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
  (
    __messages__."forum_id"::"uuid" = __forums__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
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
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __forums__."name" as "4",
  (__forums__.archived_at is not null)::text as "5",
  __messages__."forum_id" as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
  (
    __messages__."forum_id"::"uuid" = __forums__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
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
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __forums__."name" as "4",
  (__forums__.archived_at is not null)::text as "5",
  __messages__."forum_id" as "6",
  __users__."username" as "7",
  __users__."gravatar_url" as "8"
from app_public.messages as __messages__
left outer join app_public.forums as __forums__
on (
  (
    __messages__."forum_id"::"uuid" = __forums__."id"
  ) and (
    /* WHERE becoming ON */ (
      true /* authorization checks */
    )
  )
)
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
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );
