import { makeGrafastSchema, lambda, context } from "grafast";

const schema = makeGrafastSchema({
  typeDefs: `
    type Query {
      add(a: Int!, b: Int!): Int

      """
      Outputs the X-User-Id header to show that we can read basic HTTP headers.
      """
      userId: String

      """
      Something from Express
      """
      expressThing: String

      """
      Something from Koa
      """
      koaThing: String

      """
      Something from Fastify
      """
      fastifyThing: String
    }
  `,
  plans: {
    Query: {
      add(_, { $a, $b }) {
        return lambda([$a, $b], ([a, b]) => a + b);
      },
      userId() {
        return context().get("user_id");
      },
      expressThing() {
        return context().get("expressThing");
      },
      koaThing() {
        return context().get("koaThing");
      },
      fastifyThing() {
        return context().get("fastifyThing");
      },
    },
  },
});

export default schema;
