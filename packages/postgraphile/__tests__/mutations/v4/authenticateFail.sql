select
  __authenticate_fail__::text as "0",
  (not (__authenticate_fail__ is null))::text as "1"
from "b"."authenticate_fail"() as __authenticate_fail__