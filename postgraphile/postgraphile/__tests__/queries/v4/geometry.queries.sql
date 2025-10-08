select
  __geom__."id"::text as "0",
  __geom__."point"::text as "1",
  __geom__."points"::text as "2",
  __geom__."line"::text as "3",
  __geom__."lines"::text as "4",
  __geom__."lseg"::text as "5",
  __geom__."lsegs"::text as "6",
  __geom__."box"::text as "7",
  __geom__."boxes"::text as "8",
  __geom__."open_path"::text as "9",
  __geom__."open_paths"::text as "10",
  __geom__."closed_path"::text as "11",
  __geom__."closed_paths"::text as "12",
  __geom__."polygon"::text as "13",
  __geom__."polygons"::text as "14",
  __geom__."circle"::text as "15",
  __geom__."circles"::text as "16"
from "geometry"."geom" as __geom__
order by __geom__."id" asc;