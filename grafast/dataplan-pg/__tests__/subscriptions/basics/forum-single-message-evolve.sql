select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __messages__."author_id" as "5"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __forums__."name" as "0",
  (__forums__.archived_at is not null)::text as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );

select
  __users__."username" as "0",
  __users__."gravatar_url" as "1"
from app_public.users as __users__
where
  (
    true /* authorization checks */
  ) and (
    __users__."id" = $1::"uuid"
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __messages__."author_id" as "5"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __forums__."name" as "0",
  (__forums__.archived_at is not null)::text as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );

select
  __users__."username" as "0",
  __users__."gravatar_url" as "1"
from app_public.users as __users__
where
  (
    true /* authorization checks */
  ) and (
    __users__."id" = $1::"uuid"
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __messages__."author_id" as "5"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __forums__."name" as "0",
  (__forums__.archived_at is not null)::text as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );

select
  __users__."username" as "0",
  __users__."gravatar_url" as "1"
from app_public.users as __users__
where
  (
    true /* authorization checks */
  ) and (
    __users__."id" = $1::"uuid"
  );

select
  __messages__."id" as "0",
  __messages__."featured"::text as "1",
  __messages__."body" as "2",
  (__messages__.archived_at is not null)::text as "3",
  __messages__."forum_id" as "4",
  __messages__."author_id" as "5"
from app_public.messages as __messages__
where
  (
    true /* authorization checks */
  ) and (
    __messages__."id" = $1::"uuid"
  );

select
  __forums__."name" as "0",
  (__forums__.archived_at is not null)::text as "1"
from app_public.forums as __forums__
where
  (
    true /* authorization checks */
  ) and (
    __forums__."id" = $1::"uuid"
  );

select
  __users__."username" as "0",
  __users__."gravatar_url" as "1"
from app_public.users as __users__
where
  (
    true /* authorization checks */
  ) and (
    __users__."id" = $1::"uuid"
  );
