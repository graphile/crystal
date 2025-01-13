select
  __authenticate__."role" as "0",
  __authenticate__."exp"::text as "1",
  __authenticate__."a"::text as "2",
  __authenticate__."b"::text as "3",
  __authenticate__."c"::text as "4",
  (not (__authenticate__ is null))::text as "5"
from "b"."authenticate"(
  $1::"int4",
  $2::"numeric",
  $3::"int8"
) as __authenticate__;