#!/bin/bash
set -e
echo "TEST SCRIPT. Setting up database..."

createdb subs || true
psql -1X -v ON_ERROR_STOP=1 subs << HERE
create schema if not exists app_public;
create table if not exists app_public.foo (
 id serial primary key,
 title text not null
);
create schema if not exists app_private;
create or replace function app_private.validate_subscription(topic text)
returns text as \$\$
 select 'Yep'::text;
\$\$ language sql stable;
HERE

echo
echo "SETUP COMPLETE. Run PostGraphile via:"
echo
echo "    postgraphile --plugins @graphile/pg-pubsub -c subs -s app_public --watch --subscriptions --simple-subscriptions --subscription-authorization-function app_private.validate_subscription"
echo
echo "Then run this subscription in GraphiQL:"
echo
cat <<HERE
subscription {
  listen(topic:"hello") {
    relatedNodeId
    relatedNode {
      nodeId
      ... on Foo {
        id
        title
      }
    }
  }
}
HERE

echo
echo "Press enter when ready"
read

psql -1X -v ON_ERROR_STOP=1 subs << HERE
 do \$\$
 declare
   v_foo app_public.foo;
 begin
   insert into app_public.foo (title) values ('Howdy!') returning * into v_foo;
   perform pg_notify(
     'postgraphile:hello',
     json_build_object('message', 'Hello!', 'number', 27, '__node__', json_build_array('foos', v_foo.id))::text
   );
 end;
 \$\$ language plpgsql;
HERE

sleep 3


psql -1X -v ON_ERROR_STOP=1 subs << HERE
 do \$\$
 declare
   v_foo app_public.foo;
 begin
   insert into app_public.foo (title) values ('Goodbye!') returning * into v_foo;
   perform pg_notify(
     'postgraphile:hello',
     json_build_object('message', 'Hello!', 'number', 27, '__node__', json_build_array('foos', v_foo.id))::text
   );
   perform pg_notify(
     'Yep',
     json_build_object()::text
   );
 end;
 \$\$ language plpgsql;
HERE