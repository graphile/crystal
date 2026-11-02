import * as core from "./core.ts";

test(
  "prints a schema from non-root role, using RBAC permissions",
  core.test(
    __filename,
    ["a", "b", "c"],
    { ignoreRBAC: false },
    async (client) => {
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
      await client.query("set role postgraphile_test_authenticator");
    },
  ),
);
