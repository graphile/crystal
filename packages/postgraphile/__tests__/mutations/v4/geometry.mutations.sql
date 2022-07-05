insert into "geometry"."geom" as __geom__ ("point", "line", "lseg", "box", "open_path", "closed_path", "polygon", "circle") values ($1::"point", $2::"line", $3::"lseg", $4::"box", $5::"path", $6::"path", $7::"polygon", $8::"circle") returning
  __geom__."id"::text as "0",
  __geom__."point"::text as "1",
  __geom__."line"::text as "2",
  __geom__."lseg"::text as "3",
  __geom__."box"::text as "4",
  __geom__."open_path"::text as "5",
  __geom__."closed_path"::text as "6",
  __geom__."polygon"::text as "7",
  __geom__."circle"::text as "8"
