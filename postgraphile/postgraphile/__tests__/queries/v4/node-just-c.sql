select
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1"
from "c"."compound_key" as __compound_key__
where
  (
    __compound_key__."person_id_1" = $1::"int4"
  ) and (
    __compound_key__."person_id_2" = $2::"int4"
  );