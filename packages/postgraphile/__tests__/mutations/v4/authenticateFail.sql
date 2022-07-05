select
  (not (__authenticate_fail__ is null))::text as "0"
from "b"."authenticate_fail"() as __authenticate_fail__