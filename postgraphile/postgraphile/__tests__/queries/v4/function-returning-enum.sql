select
  __applicants__."id"::text as "0",
  __applicants__."first_name" as "1",
  __applicants__."last_name" as "2",
  __applicants__."stage"::text as "3",
  "function_returning_enum"."applicants_next_stage"(__applicants__) as "4",
  __applicants__."favorite_pet"::text as "5",
  ("function_returning_enum"."applicants_pet_food"(__applicants__))::text as "6",
  "function_returning_enum"."applicants_name_length"(__applicants__) as "7",
  __applicants__."transportation"::text as "8",
  "function_returning_enum"."applicants_favorite_pet_transportation"(__applicants__) as "9"
from "function_returning_enum"."applicants" as __applicants__
where
  (
    "function_returning_enum"."applicants_name_length"(__applicants__) = $1::"function_returning_enum"."length"
  ) and (
    "function_returning_enum"."applicants_next_stage"(__applicants__) = $2::"function_returning_enum"."stage_options_enum_domain"
  )
order by __applicants__."id" asc;

select
  __text_length__.v as "0"
from "function_returning_enum"."text_length"(
  $1::"text",
  $2::"int4"
) as __text_length__(v);

select
  __applicants_by_stage__."id"::text as "0",
  __applicants_by_stage__."first_name" as "1",
  __applicants_by_stage__."last_name" as "2",
  __applicants_by_stage__."stage"::text as "3",
  "function_returning_enum"."applicants_next_stage"(__applicants_by_stage__) as "4",
  __applicants_by_stage__."favorite_pet"::text as "5",
  ("function_returning_enum"."applicants_pet_food"(__applicants_by_stage__))::text as "6",
  "function_returning_enum"."applicants_name_length"(__applicants_by_stage__) as "7",
  __applicants_by_stage__."transportation"::text as "8",
  "function_returning_enum"."applicants_favorite_pet_transportation"(__applicants_by_stage__) as "9"
from "function_returning_enum"."applicants_by_stage"($1::"function_returning_enum"."stage_options_enum_domain") as __applicants_by_stage__;

select
  __applicants_by_favorite_pet__."id"::text as "0",
  __applicants_by_favorite_pet__."first_name" as "1",
  __applicants_by_favorite_pet__."last_name" as "2",
  __applicants_by_favorite_pet__."stage"::text as "3",
  "function_returning_enum"."applicants_next_stage"(__applicants_by_favorite_pet__) as "4",
  __applicants_by_favorite_pet__."favorite_pet"::text as "5",
  ("function_returning_enum"."applicants_pet_food"(__applicants_by_favorite_pet__))::text as "6",
  "function_returning_enum"."applicants_name_length"(__applicants_by_favorite_pet__) as "7",
  __applicants_by_favorite_pet__."transportation"::text as "8",
  "function_returning_enum"."applicants_favorite_pet_transportation"(__applicants_by_favorite_pet__) as "9"
from "function_returning_enum"."applicants_by_favorite_pet"($1::"function_returning_enum"."animal_type") as __applicants_by_favorite_pet__;

select
  __applicants_by_transportation__."id"::text as "0",
  __applicants_by_transportation__."first_name" as "1",
  __applicants_by_transportation__."last_name" as "2",
  __applicants_by_transportation__."stage"::text as "3",
  "function_returning_enum"."applicants_next_stage"(__applicants_by_transportation__) as "4",
  __applicants_by_transportation__."favorite_pet"::text as "5",
  ("function_returning_enum"."applicants_pet_food"(__applicants_by_transportation__))::text as "6",
  "function_returning_enum"."applicants_name_length"(__applicants_by_transportation__) as "7",
  __applicants_by_transportation__."transportation"::text as "8",
  "function_returning_enum"."applicants_favorite_pet_transportation"(__applicants_by_transportation__) as "9"
from "function_returning_enum"."applicants_by_transportation"($1::"function_returning_enum"."transportation") as __applicants_by_transportation__;