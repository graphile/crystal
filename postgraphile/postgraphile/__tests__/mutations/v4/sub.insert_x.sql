select
  __insert_x__."id"::text as "0",
  __insert_x__."name" as "1"
from "sub"."insert_x"($1::"text") as __insert_x__;