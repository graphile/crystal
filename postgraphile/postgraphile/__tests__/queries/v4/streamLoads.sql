select
  __person__."id"::text as "0"
from "c"."person" as __person__
order by __person__."id" asc
limit 1;

select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select *
  from (
    select
      __post__."id"::text as "0",
      __post__."headline" as "1",
      __post_identifiers__.idx as "2",
      row_number() over (
        order by __post__."id" asc
      ) as "3"
    from "a"."post" as __post__
    where (
      __post__."author_id" = __post_identifiers__."id0"
    )
    order by __post__."id" asc
  ) __stream_wrapped__
  order by __stream_wrapped__."3"
  limit 2
) as __post_result__;

begin; /*fake*/

declare __SNAPSHOT_CURSOR_0__ insensitive no scroll cursor without hold for
select __post_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"int4" as "id0" from json_array_elements($1::json) with ordinality as ids) as __post_identifiers__,
lateral (
  select *
  from (
    select
      __post__."id"::text as "0",
      __post__."headline" as "1",
      __post_identifiers__.idx as "2",
      row_number() over (
        order by __post__."id" asc
      ) as "3"
    from "a"."post" as __post__
    where (
      __post__."author_id" = __post_identifiers__."id0"
    )
    order by __post__."id" asc
  ) __stream_wrapped__
  order by __stream_wrapped__."3"
  offset 2
) as __post_result__;

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

fetch forward 100 from __SNAPSHOT_CURSOR_0__

close __SNAPSHOT_CURSOR_0__

commit; /*fake*/