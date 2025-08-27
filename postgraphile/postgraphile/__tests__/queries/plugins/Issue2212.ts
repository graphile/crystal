// @ts-check
import { loadOneWithPgClient, PgSelectSingleStep } from "@dataplan/pg";
import {} from "graphile-config";
import { extendSchema } from "graphile-utils";

const plugin = extendSchema((build) => {
  const executor = build.input.pgRegistry.pgExecutors.main;
  return {
    typeDefs: /* GraphQL */ `
      extend type User {
        lifetimeOrderTotal: Int
      }
    `,
    plans: {
      User: {
        lifetimeOrderTotal($user: PgSelectSingleStep) {
          const $id = $user.get("id");
          return loadOneWithPgClient(
            executor,
            $id,
            async (pgClient, userIds) => {
              // We're doing batched processing across all the userIds
              const { rows: userContacts } = await pgClient.query<{
                user_id: string;
                phone: string;
              }>({
                text: `select user_id::text, phone from issue_2212.user_contacts where id = any($1::int[]);`,
                values: [userIds],
              });

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
              const { rows: orders } = await pgClient.query<{
                phone_e164: string;
                sum: string;
              }>({
                text: `select phone_e164, sum(amount_cents) as sum from issue_2212.orders where phone_e164 = any($1::text[]) group by phone_e164;`,
                values: [[...phoneNumbers]],
              });

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
