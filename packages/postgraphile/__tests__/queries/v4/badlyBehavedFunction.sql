select
  __badly_behaved_function__."id"::text as "0",
  "c"."person_first_name"(__badly_behaved_function__) as "1",
  (row_number() over (partition by 1))::text as "2"
from "c"."badly_behaved_function"() as __badly_behaved_function__