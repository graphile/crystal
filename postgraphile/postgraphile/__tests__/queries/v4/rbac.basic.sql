begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __person_secret__."person_id"::text as "0",
  __person_secret__."sekrit" as "1"
from "c"."person_secret" as __person_secret__
where (
  __person_secret__."person_id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __person__."id"::text as "0"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __person__."id"::text as "0"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __left_arm__."id"::text as "0",
  __left_arm__."person_id"::text as "1",
  __left_arm__."length_in_metres"::text as "2",
  __left_arm__."mood" as "3"
from "c"."left_arm" as __left_arm__
where (
  __left_arm__."id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __person__."id"::text as "0"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."body" as "2",
  __post__."author_id"::text as "3"
from "a"."post" as __post__
where (
  __post__."id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __person__."id"::text as "0"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __return_table_without_grants__."person_id_1"::text as "0",
  __return_table_without_grants__."person_id_2"::text as "1"
from "c"."return_table_without_grants"() as __return_table_without_grants__;

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __person_secret__."person_id"::text as "0",
  __person_secret__."sekrit" as "1"
from "c"."person_secret" as __person_secret__
order by __person_secret__."person_id" asc;

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __person_secret__."person_id"::text as "0",
  __person_secret__."sekrit" as "1"
from "c"."person_secret" as __person_secret__
where (
  __person_secret__."person_id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __left_arm__."id"::text as "0",
  __left_arm__."person_id"::text as "1",
  __left_arm__."length_in_metres"::text as "2",
  __left_arm__."mood" as "3"
from "c"."left_arm" as __left_arm__
order by __left_arm__."id" asc;

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __left_arm__."id"::text as "0",
  __left_arm__."person_id"::text as "1",
  __left_arm__."length_in_metres"::text as "2",
  __left_arm__."mood" as "3"
from "c"."left_arm" as __left_arm__
where (
  __left_arm__."person_id" = $1::"int4"
);

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."body" as "2",
  __post__."author_id"::text as "3"
from "a"."post" as __post__
order by __post__."id" asc;

commit; /*fake*/

begin; /*fake*/

select set_config(el->>0, el->>1, true) from json_array_elements($1::json) el

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."body" as "2",
  __post__."author_id"::text as "3"
from "a"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
)
order by __post__."id" asc;

commit; /*fake*/