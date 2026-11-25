import { scopedUtils } from "graphile-utils";
import { assertObjectType } from "graphql";

import * as core from "./core.ts";

const { multipassInclude } = scopedUtils("default");

const OrdersEntrypoint: GraphileConfig.Plugin = {
  name: "OrdersEntrypoint",
  gather: {
    hooks: {
      pgIntrospection_options(_info, { options }) {
        if (options.multipass) {
          options.multipass.entrypointFilters = {
            ...options.multipass.entrypointFilters,
            classes: "relname = 'orders'",
          };
        }
      },
    },
  },
};

test.each(["catalog", "smart"])(
  "follows in-schema refs on resources discovered by a %s foreign key",
  (kind) =>
    core.test(
      undefined,
      "issue_2212",
      {},
      `
      alter table issue_2212.orders add column user_id int;
      ${
        kind === "catalog"
          ? "alter table issue_2212.orders add foreign key (user_id) references issue_2212.users;"
          : "comment on table issue_2212.orders is '@foreignKey (user_id) references users';"
      }
      alter table issue_2212.user_contacts add foreign key (user_id) references issue_2212.users;
      comment on table issue_2212.users is $tags$
@ref contacts via:(id)->user_contacts(user_id)
@foreignKey (id) references refs.people (id)
@ref hiddenPerson singular via:(id)->refs.people(id)
$tags$;
    `,
      (schema) => {
        const fields = assertObjectType(schema.getType("User")).getFields();
        expect(fields.contacts).toBeDefined();
        const contact = assertObjectType(schema.getType("UserContact"));
        expect(contact.getFields().phone).toBeDefined();
        expect(fields.hiddenPerson).toBeUndefined();
        expect(schema.getType("Person")).toBeUndefined();
      },
      true,
      {
        plugins: [OrdersEntrypoint],
      },
    )(),
);

test(
  "discovers both hops of a smart ref together",
  core.test(
    undefined,
    "issue_2212",
    {},
    `
      alter table issue_2212.orders drop constraint orders_pkey;
      comment on table issue_2212.orders is $tags$
@primaryKey phone_e164,id
@ref contacts via:(phone_e164,id)->users(username,id);(id)->user_contacts(user_id)
$tags$;
      comment on table issue_2212.users is '@foreignKey (username,id) references orders';
      alter table issue_2212.user_contacts drop constraint user_contacts_user_id_fkey;
      comment on table issue_2212.user_contacts is '@foreignKey (user_id) references users';
    `,
    (schema, passes) => {
      expect(passes).toBeLessThanOrEqual(6);
      const order = assertObjectType(schema.getType("Order"));
      expect(order.getFields().contacts).toBeDefined();
    },
    true,
    { plugins: [OrdersEntrypoint] },
  ),
);

test(
  "makes explicitly included objects available to gather plugins",
  core.test(undefined, "issue_2212", {}, undefined, undefined, true, {
    plugins: [
      multipassInclude({
        tables: ["enum_tables.simple_enum"],
        functions: ["c.floatrange"],
      }),
      multipassInclude({ types: ["b.wrapped_url"] }),
      multipassInclude({ serviceName: "other", tables: ["refs.people"] }),
      {
        name: "CheckIncludedObjects",
        gather: {
          hooks: {
            pgIntrospection_introspection(_info, { introspection }) {
              const included = introspection
                .getNamespace({ name: "enum_tables" })
                ?.getClass({ name: "simple_enum" });
              expect(
                included?.getAttributes().map((attr) => attr.attname),
              ).toContain("value");
              expect(included?.getTags().enum).toBe(true);
              expect(
                introspection
                  .getNamespace({ name: "c" })
                  ?.getProcs({ name: "floatrange" }),
              ).toHaveLength(2);
              expect(
                introspection
                  .getType({ schemaName: "b", name: "wrapped_url" })
                  ?.getClass()
                  ?.getAttributes()
                  .map((attr) => attr.attname),
              ).toEqual(["url"]);
              expect(
                introspection
                  .getNamespace({ name: "refs" })
                  ?.getClass({ name: "people" }),
              ).toBeUndefined();
            },
          },
        },
      },
    ],
  }),
);

test(
  "ignores smart foreign keys and smart ref hops when fake constraints are disabled",
  core.test(
    undefined,
    "issue_2212",
    {},
    `
      comment on table issue_2212.orders is $tags$
@foreignKey (id) references users
@ref contacts via:(id)->user_contacts(user_id)
$tags$;
      comment on table issue_2212.user_contacts is '@foreignKey (user_id) references orders';
    `,
    (schema) => {
      const fields = schema.getQueryType()!.getFields();
      expect(fields.allOrders).toBeDefined();
      expect(fields.allUsers).toBeUndefined();
      expect(fields.allUserContacts).toBeUndefined();
    },
    true,
    {
      plugins: [OrdersEntrypoint],
      disablePlugins: ["PgFakeConstraintsPlugin"],
    },
  ),
);

test(
  "unmatched ref paths do not expose their hops",
  core.test(
    undefined,
    "issue_2212",
    {},
    `
    alter table issue_2212.users add column order_id int references issue_2212.orders;
    comment on table issue_2212.orders is $tags$
@ref people via:(id)->users(order_id);refs.people
@ref missing via:(id)->users(id);invalid!
$tags$;
  `,
    (schema) => {
      expect(schema.getQueryType()!.getFields().allUsers).toBeUndefined();
      const order = assertObjectType(schema.getType("Order"));
      expect(order.getFields().people).toBeUndefined();
      expect(order.getFields().missing).toBeUndefined();
      expect(schema.getType("User")).toBeUndefined();
    },
    true,
    { plugins: [OrdersEntrypoint] },
  ),
);
