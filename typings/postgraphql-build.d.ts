declare module 'postgraphql-build' {
  import { Pool, Client, ClientConfig } from 'pg'
  import { GraphQLSchema } from 'graphql'
  export function createPostGraphQLSchema (
    clientOrConfig: Pool | Client | ClientConfig | string,
    schemaOrCatalog: string | Array<string>,
    options?: {
      classicIds?: boolean,
      dynamicJson?: boolean,
      jwtSecret?: string,
      jwtPgTypeIdentifier?: string,
      disableDefaultMutations?: boolean,
    },
  ): Promise<GraphQLSchema>

  export function watchPostGraphQLSchema (
    clientOrConfig: Pool | Client | ClientConfig | string,
    schemaOrCatalog: string | Array<string>,
    options: {
      classicIds?: boolean,
      dynamicJson?: boolean,
      jwtSecret?: string,
      jwtPgTypeIdentifier?: string,
      disableDefaultMutations?: boolean,
    },
    onSchema: (schema: GraphQLSchema) => void,
  ): Promise<() => {}>
}
