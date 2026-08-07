call "procedures"."no_args_no_output"();

call "procedures"."no_args_no_output"();

call "procedures"."in_args_no_output"(
  $1::"int4",
  $2::"int4"
);

call "procedures"."inout_arg"($1::"int4");