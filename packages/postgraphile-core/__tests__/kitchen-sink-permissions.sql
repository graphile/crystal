grant usage on schema a to postgraphile_test_authenticator;
grant usage on schema b to postgraphile_test_authenticator;
grant usage on schema c to postgraphile_test_authenticator;
grant usage on schema a,b,c to postgraphile_test_visitor;

grant usage, select on all sequences in schema a,b,c to postgraphile_test_visitor;
grant execute on function c.current_user_id() to postgraphile_test_visitor;
grant execute on function c.left_arm_identity(left_arm c.left_arm) to postgraphile_test_visitor;

grant select on c.person to postgraphile_test_visitor;
grant insert(person_full_name, aliases, about, email, site) on c.person to postgraphile_test_visitor;
grant update(person_full_name, aliases, about, email, site) on c.person to postgraphile_test_visitor;
grant delete on c.person to postgraphile_test_visitor;

grant select on c.person_secret to postgraphile_test_visitor;
grant insert(sekrit) on c.person_secret to postgraphile_test_visitor;
grant delete on c.person_secret to postgraphile_test_visitor;

grant select on c.left_arm to postgraphile_test_visitor;
grant insert(length_in_metres) on c.left_arm to postgraphile_test_visitor;
grant update(mood) on c.left_arm to postgraphile_test_visitor;
grant delete on c.left_arm to postgraphile_test_visitor;

grant select(id, headline, body, author_id) on a.post to postgraphile_test_visitor;

-- DO NOT GRANT ANYTHING ON c.compound_key!
grant execute on function c.return_table_without_grants() to postgraphile_test_visitor;
