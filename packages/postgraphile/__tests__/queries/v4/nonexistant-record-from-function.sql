select to_json(
  json_build_array(__local_0__."id")
) as "__identifiers",
to_json((__local_0__."id")) as "id",
to_json((__local_0__."headline")) as "headline"
from "c"."table_query"(
  $1
) as __local_0__
where (
  not (__local_0__ is null)
) and (TRUE) and (TRUE)