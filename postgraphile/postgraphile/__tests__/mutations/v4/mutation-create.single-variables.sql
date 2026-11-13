insert into "c"."person" as __person__ ("id", "person_full_name", "about", "email", "config", "last_login_from_ip", "last_login_from_subnet", "user_mac") values ($1::"int4", $2::"varchar", $3::"text", $4::"b"."email", $5::"hstore", $6::"inet", $7::"cidr", $8::"macaddr") returning
  __person__."id"::text as "0";

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1"
from "c"."person" as __person__
where (
  __person__."id" = $1::"int4"
)
order by __person__."id" asc;