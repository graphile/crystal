// @ts-check
import type { PgSelectSingleStep } from "@dataplan/pg";
import {} from "graphile-config";
import { extendSchema } from "graphile-utils";

const plugin = extendSchema((build) => {
  const executor = build.input.pgRegistry.pgExecutors.main;
  const orders = build.input.pgRegistry.pgResources.orders;
  const { sql } = build;
  const { connection, each } = build.grafast;
  const { loadOneWithPgClient, loadManyWithPgClient, TYPES, listOfCodec } =
    build.dataplanPg;
  return {
    typeDefs: /* GraphQL */ `
      extend type User {
        lifetimeOrderTotal: Int
        orders: OrderConnection
      }
    `,
    plans: {
      User: {
        orders($user: PgSelectSingleStep) {
          const $id = $user.get("id");
          const $phoneNumbers = loadManyWithPgClient(
            executor,
            $id,
            async (pgClient, userIds) => {
              // We're doing batched processing across all the userIds

              // Step 1 - load the user's phone numbers
              const { rows: userContacts } = await pgClient.query<{
                user_id: string;
                phone: string;
              }>({
                text: `select user_id::text, phone from issue_2212.user_contacts where user_id = any($1::int[]);`,
                values: [userIds],
              });

              // Step 2 - normalize the phone numbers
              const phoneNumbers = new Set<string>();
              const phoneNumbersByUserId: Record<string, string[]> =
                Object.create(null);
              for (const row of userContacts) {
                const userId = row.user_id;
                const rawPhone = row.phone;
                if (!rawPhone) continue;
                const phone = normalizePhone(rawPhone);

                phoneNumbersByUserId[userId] ??= [];
                phoneNumbersByUserId[userId].push(phone);
                phoneNumbers.add(phone);
              }

              // Finally - match the inputs to the outputs
              return userIds.map(
                (userId) => phoneNumbersByUserId[userId] ?? [],
              );
            },
          );
          const $orders = orders.find();
          $orders.where(
            sql`${$orders}.phone_e164 = any(${$orders.placeholder($phoneNumbers, listOfCodec(TYPES.text))})`,
          );
          return connection($orders);
        },
        lifetimeOrderTotal($user: PgSelectSingleStep) {
          const $id = $user.get("id");
          return loadOneWithPgClient(
            executor,
            $id,
            async (pgClient, userIds) => {
              // We're doing batched processing across all the userIds

              // Step 1 - load the user's phone numbers
              const { rows: userContacts } = await pgClient.query<{
                user_id: string;
                phone: string;
              }>({
                text: `select user_id::text, phone from issue_2212.user_contacts where id = any($1::int[]);`,
                values: [userIds],
              });

              // Step 2 - normalize the phone numbers
              const phoneNumbers = new Set<string>();
              const phoneNumbersByUserId: Record<string, string[]> =
                Object.create(null);
              for (const row of userContacts) {
                const userId = row.user_id;
                const rawPhone = row.phone;
                const phone = normalizePhone(rawPhone);

                phoneNumbersByUserId[userId] ??= [];
                phoneNumbersByUserId[userId].push(phone);
                phoneNumbers.add(phone);
              }

              // Step 3 - fetch the order totals per phone number
              const { rows: orders } = await pgClient.query<{
                phone_e164: string;
                sum: string;
              }>({
                text: `select phone_e164, sum(amount_cents) as sum from issue_2212.orders where phone_e164 = any($1::text[]) group by phone_e164;`,
                values: [[...phoneNumbers]],
              });

              // Finally - match the inputs to the outputs
              return userIds.map((userId) => {
                const phoneNumbers = phoneNumbersByUserId[userId] ?? [];
                let total = 0;
                for (const phoneNumber of phoneNumbers) {
                  const userOrders = orders.filter(
                    (o) => o.phone_e164 === phoneNumber,
                  );
                  for (const order of userOrders) {
                    total += parseInt(order.sum, 10);
                  }
                }
                return total;
              });
            },
          );
        },
      },
    },
  };
});

function normalizePhone(raw: string): string {
  // toy normalizer for tests; in app, use libphonenumber-js
  let s = raw.replace(/[^\d+]/g, "").replace(/^\+00/, "+"); // handle +00
  if (s.startsWith("+")) return s;
  // heuristic: if starts with "00" treat like +; "0" assume UK; else assume US
  if (s.startsWith("00")) return "+" + s.slice(2);
  if (s.startsWith("0")) return "+44" + s.slice(1);
  return "+1" + s;
}

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
