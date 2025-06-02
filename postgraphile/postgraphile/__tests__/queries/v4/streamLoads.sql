select
  __person__."id"::text as "0"
from "c"."person" as __person__
order by __person__."id" asc
limit 1;

select *
from (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    row_number() over (
      order by __post__."id" asc
    ) as "2"
  from "a"."post" as __post__
  where (
    __post__."author_id" = $1::"int4"
  )
  order by __post__."id" asc
) __stream_wrapped__
order by __stream_wrapped__."2"
limit 2;

begin; /*fake*/

declare __SNAPSHOT_CURSOR_0__ insensitive no scroll cursor without hold for
select *
from (
  select
    __post__."id"::text as "0",
    __post__."headline" as "1",
    row_number() over (
      order by __post__."id" asc
    ) as "2"
  from "a"."post" as __post__
  where (
    __post__."author_id" = $1::"int4"
  )
  order by __post__."id" asc
) __stream_wrapped__
order by __stream_wrapped__."2"
offset 2;

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