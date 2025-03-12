select
  case when (__authenticate__) is not distinct from null then null::text else json_build_array(((__authenticate__)."role"), (((__authenticate__)."exp"))::text, (((__authenticate__)."a"))::text, (((__authenticate__)."b"))::text, (((__authenticate__)."c"))::text)::text end as "0",
  (not (__authenticate__ is null))::text as "1"
from "b"."authenticate"(
  $1::"int4",
  $2::"numeric",
  $3::"int8"
) as __authenticate__;