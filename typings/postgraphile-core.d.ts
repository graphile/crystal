declare module 'postgraphile-core' {
  import { Pool, Client, ClientConfig } from 'pg'
  import { GraphQLSchema } from 'graphql'
  export function createPostGraphileSchema (
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

  export function watchPostGraphileSchema (
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
