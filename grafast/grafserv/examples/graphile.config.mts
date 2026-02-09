// These imports are just for the types; if you're pure JS you don't need them
import "graphile-config";
import "grafserv";
import "grafserv/express/v4";
import "grafserv/koa/v2";
import "grafserv/fastify/v4";

declare global {
  namespace Grafast {
    interface Context {
      user_id?: string;
      expressThing?: string;
      koaThing?: string;
      fastifyThing?: string;
    }
  }
}

const preset = {
  grafserv: {
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 5678,
    outputDataAsString: true,
    graphqlOverGET: true,
    graphiqlOnGraphQLGET: true,
  },
  grafast: {
    context(requestContext) {
      return {
        user_id: requestContext.http?.getHeader("x-user-id"),
        expressThing: requestContext.expressv4?.req.thing,
        koaThing: requestContext.koav2?.ctx.thing,
        fastifyThing: requestContext.fastifyv4?.request.thing,
      };
    },
  },
} satisfies GraphileConfig.Preset;
export default preset;
