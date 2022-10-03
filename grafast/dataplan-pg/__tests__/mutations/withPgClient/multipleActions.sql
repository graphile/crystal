begin; /*fake*/

select set_config('my_app.a', $1, true);

select * from generate_series(1, $1) as i;

select i + current_setting('my_app.a', true)::int as i from generate_series($1, 10) as i;

commit; /*fake*/
