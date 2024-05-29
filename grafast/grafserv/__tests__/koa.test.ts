import { constant, error, makeGrafastSchema } from "grafast";
import Koa, { Context } from "koa";
import { createMockContext } from "@shopify/jest-koa-mocks";

import { KoaGrafserv } from "./../src/servers/koa/v2";

const schema = makeGrafastSchema({
  typeDefs: /* GraphQL */ `
    type Query {
      hello: String!
      throwAnError: String
    }
  `,
  plans: {
    Query: {
      hello() {
        return constant("world");
      },
      throwAnError() {
        return error(new Error("You asked for an error... Here it is."));
      },
    },
  },
});
const getKoaGrafservServer = () => {
  return new KoaGrafserv({
    schema,
    preset: {
      grafserv: {
        graphqlOverGET: true,
        graphqlPath: "/graphql",
        dangerouslyAllowAllCORSRequests: true,
      },
    },
  });
};

test("calls next() handler after grafast middleware", async () => {
  const serv = getKoaGrafservServer();
  const next = jest.fn();

  const app = new Koa();
  serv.addTo(app, null);

  const ctx = createMockContext();

  await app.middleware[0](ctx, next);

  expect(next).toHaveBeenCalledTimes(1);
});
