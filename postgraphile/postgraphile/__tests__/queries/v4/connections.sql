select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
order by __person__."id" asc;

select
  (count(*))::text as "0"
from "c"."person" as __person__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
order by __person__."id" asc
limit 3;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
order by __person__."id" desc
limit 3;

select
  __person__."person_full_name" as "0",
  __person__."id"::text as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
order by __person__."person_full_name" asc, __person__."id" asc;

select
  __person__."person_full_name" as "0",
  __person__."id"::text as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
order by __person__."person_full_name" desc, __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."id" < $1::"int4"
)
order by __person__."id" asc;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."id" > $1::"int4"
)
order by __person__."id" asc;

select
  __updatable_view__."x"::text as "0",
  __updatable_view__."name" as "1",
  __updatable_view__."constant"::text as "2",
  (not (__updatable_view__ is null))::text as "3"
from "b"."updatable_view" as __updatable_view__
order by __updatable_view__."x" asc;

select
  __updatable_view__."constant"::text as "0",
  __updatable_view__."x"::text as "1",
  __updatable_view__."name" as "2",
  (not (__updatable_view__ is null))::text as "3"
from "b"."updatable_view" as __updatable_view__
order by __updatable_view__."constant" asc, __updatable_view__."x" asc;

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2"
from "a"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
)
order by __post__."id" asc;

select
  (count(*))::text as "0"
from "a"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
);

select
  __post__."id"::text as "0",
  __post__."headline" as "1",
  __post__."author_id"::text as "2"
from "a"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
)
order by __post__."id" asc
limit 3;

select
  __post__."headline" as "0",
  __post__."id"::text as "1",
  __post__."author_id"::text as "2"
from "a"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
)
order by __post__."headline" desc, __post__."id" desc
limit 2;

select
  (count(*))::text as "0"
from "a"."post" as __post__
where (
  __post__."author_id" = $1::"int4"
);

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
order by __person__."id" asc
limit 4
offset 1;

select
  __edge_case__."row_id"::text as "0",
  __edge_case__."not_null_has_default"::text as "1"
from "c"."edge_case" as __edge_case__
where (
  __edge_case__."row_id" = $1::"int4"
);

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."id" < $1::"int4"
)
order by __person__."id" desc
limit 3;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."id" > $1::"int4"
)
order by __person__."id" asc
limit 2;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."id" > $1::"int4"
)
order by __person__."id" desc
limit 2;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."about" is null
)
order by __person__."id" asc;

select
  (count(*))::text as "0"
from "c"."person" as __person__
where (
  __person__."about" is null
);

select
  __post__."author_id"::text as "0",
  __post__."headline" as "1",
  __post__."id"::text as "2"
from "a"."post" as __post__
order by __post__."author_id" desc, __post__."headline" desc, __post__."id" asc
limit 4;

select
  (count(*))::text as "0"
from "a"."post" as __post__;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."last_login_from_ip" = $1::"inet"
)
order by __person__."id" asc;

select
  (count(*))::text as "0"
from "c"."person" as __person__
where (
  __person__."last_login_from_ip" = $1::"inet"
);

select
  __post__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."id"::text as "2",
  __post__."headline" as "3"
from "a"."post" as __post__
left outer join "c"."person" as __person__
on (__post__."author_id"::"int4" = __person__."id")
order by __post__."id" asc
limit 2;

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."last_login_from_subnet" = $1::"cidr"
)
order by __person__."id" asc;

select
  (count(*))::text as "0"
from "c"."person" as __person__
where (
  __person__."last_login_from_subnet" = $1::"cidr"
);

select
  __person__."id"::text as "0",
  __person__."person_full_name" as "1",
  __person__."email" as "2",
  __person__."config"::text as "3",
  __person__."last_login_from_ip"::text as "4",
  __person__."last_login_from_subnet"::text as "5",
  __person__."user_mac"::text as "6"
from "c"."person" as __person__
where (
  __person__."user_mac" = $1::"macaddr"
)
order by __person__."id" asc;

select
  (count(*))::text as "0"
from "c"."person" as __person__
where (
  __person__."user_mac" = $1::"macaddr"
);

select
  __null_test_record__."nullable_text" as "0",
  __null_test_record__."nullable_int"::text as "1",
  __null_test_record__."id"::text as "2"
from "c"."null_test_record" as __null_test_record__
order by __null_test_record__."id" asc;