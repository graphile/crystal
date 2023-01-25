export function optionsFromConfig(config: GraphileConfig.ResolvedPreset) {
  const {
    graphqlPath = "/graphql",
    graphiql = true,
    graphiqlOnGraphQLGET = true,
    graphiqlPath = "/",
    watch = false,
    eventStreamRoute = "/graphql/stream",
    maxRequestLength = 100_000,
  } = config.server ?? {};
  return {
    graphqlPath,
    graphiql,
    graphiqlOnGraphQLGET,
    graphiqlPath,
    watch,
    eventStreamRoute,
    maxRequestLength,
  };
}
export type OptionsFromConfig = ReturnType<typeof optionsFromConfig>;
