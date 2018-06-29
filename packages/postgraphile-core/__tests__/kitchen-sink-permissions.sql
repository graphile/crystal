grant usage on schema a to postgraphile_test_authenticator;
grant usage on schema b to postgraphile_test_authenticator;
grant usage on schema c to postgraphile_test_authenticator;
grant usage on schema a,b,c to postgraphile_test_visitor;
grant select on c.person to postgraphile_test_visitor;
grant insert(person_full_name, aliases, about, email, site) on c.person to postgraphile_test_visitor;
grant update(person_full_name, aliases, about, email, site) on c.person to postgraphile_test_visitor;
grant delete on c.person to postgraphile_test_visitor;

grant select on c.person_secret to postgraphile_test_visitor;
grant insert(sekrit) on c.person_secret to postgraphile_test_visitor;
grant delete on c.person_secret to postgraphile_test_visitor;

grant select on c.left_arm to postgraphile_test_visitor;
grant insert(length_in_metres) on c.left_arm to postgraphile_test_visitor;
grant update(length_in_metres) on c.left_arm to postgraphile_test_visitor;
grant delete on c.left_arm to postgraphile_test_visitor;

grant select(id, headline, body, author_id) on a.post to postgraphile_test_visitor;
