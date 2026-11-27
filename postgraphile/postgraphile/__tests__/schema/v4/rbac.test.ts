import { assertObjectType } from "graphql";

import * as core from "./core.ts";

test.each([true, false])(
  "builds a schema from a non-root role using RBAC permissions (multipass: %s)",
  (multipass) =>
    core.test(
      multipass ? __filename : undefined,
      ["a", "b", "c"],
      { ignoreRBAC: false },
      async (client) => {
        await client.query(
          "revoke usage on schema enum_tables from postgraphile_test_authenticator",
        );
        const { rows } = await client.query(`
          select p.proname, has_function_privilege('postgraphile_test_visitor', p.oid, 'execute') as allowed
          from pg_proc p
          join pg_namespace n on n.oid = p.pronamespace
          where (n.nspname, p.proname) in (
            ('c', 'person_computed_out'),
            ('c', 'person_first_name'),
            ('a', 'post_computed_with_optional_arg'),
            ('c', 'table_set_query_volatile'),
            ('a', 'post_with_suffix')
          )
          order by p.proname
        `);
        expect(rows).toEqual([
          { proname: "person_computed_out", allowed: false },
          { proname: "person_first_name", allowed: false },
          { proname: "post_computed_with_optional_arg", allowed: false },
          { proname: "post_with_suffix", allowed: true },
          { proname: "table_set_query_volatile", allowed: false },
        ]);
        await client.query("set local role postgraphile_test_authenticator");
      },
      (schema) => {
        const query = assertObjectType(schema.getQueryType()).getFields();
        const mutation = assertObjectType(schema.getMutationType()).getFields();
        const person = assertObjectType(schema.getType("Person")).getFields();
        const post = assertObjectType(schema.getType("Post")).getFields();

        expect(query.allPeople).toBeDefined();
        expect(query.allPosts).toBeDefined();
        expect(mutation.createPerson).toBeDefined();
        expect(mutation.createPost).toBeUndefined();
        expect(person.computedOut).toBeUndefined();
        expect(person.firstName).toBeUndefined();
        expect(post.computedWithOptionalArg).toBeUndefined();
        expect(query.tableSetQueryVolatile).toBeUndefined();
      },
      undefined,
      { gather: { pgMultipassIntrospection: multipass } },
    )(),
);
