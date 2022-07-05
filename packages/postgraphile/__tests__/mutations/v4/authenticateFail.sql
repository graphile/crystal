SAVEPOINT graphql_mutation

with __local_0__ as (
  select __local_1__.*
  from "b"."authenticate_fail"( ) __local_1__
)
select (
  (
    case when __local_0__ is null then null else __local_0__ end
  )
)::text
from __local_0__

RELEASE SAVEPOINT graphql_mutation