declare module "graphql-helix" {
  export const getGraphQLParameters: (...args: any[]) => any;
  export const processRequest: (...args: any[]) => any;
  export const sendResult: (...args: any[]) => any;
}
