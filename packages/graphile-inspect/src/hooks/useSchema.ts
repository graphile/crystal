import { GraphiQLProps } from "graphiql";
import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
} from "graphql";
import { useEffect, useState } from "react";
import { GraphileInspectProps } from "../interfaces";

export const useSchema = (
  props: GraphileInspectProps,
  fetcher: GraphiQLProps["fetcher"],
) => {
  const [schema, setSchema] = useState<GraphQLSchema | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    (async () => {
      // Fetch the schema using our introspection query and report once that has
      // finished.
      const result = await fetcher({
        query: getIntrospectionQuery(),
        // TODO: remove this TypeScript hack once https://github.com/graphql/graphiql/pull/2373 is merged/released
        operationName: null as unknown as string,
      });
      let payload;
      if (typeof result.next === "function") {
        // Handle async iterator; we're only expecting a single payload.
        for await (const entry of result) {
          payload = entry;
        }
      } else {
        payload = result;
      }
      const { data } = payload;

      // Use the data we got back from GraphQL to build a client schema (a
      // schema without resolvers).
      const schema = buildClientSchema(data);
      setSchema(schema);
      setError(null);

      // Do some hacky stuff to GraphiQL.
      // this._updateGraphiQLDocExplorerNavStack(schema);

      // tslint:disable-next-line no-console
      console.log("PostGraphile: Schema updated");
    })().catch((error) => {
      // tslint:disable-next-line no-console
      console.error("Error occurred when updating the schema:");
      // tslint:disable-next-line no-console
      console.error(error);
      setError(error);
    });
  }, []);
  return { schema, error };
};
