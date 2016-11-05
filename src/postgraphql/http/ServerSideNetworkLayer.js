// See: https://facebook.github.io/relay/docs/interfaces-relay-network-layer.html
//
// This class implements a "network layer" for relay that can be used on the
// server side, enabling server-side rendering of a relay app.

export default class ServerSideNetworkLayer {
  constructor(pgPool, gqlSchema, jwtToken, options = {}) {
    this.pgPool = pgPool;
    this.gqlSchema = gqlSchema;
    this.jwtToken = jwtToken;
    this.options = options;
  }

  sendMutation(mutationRequest) {
    return Promise.reject('Mutations not supported on the server');
  }

  sendQueries(queryRequests) {
    console.dir(queryRequests)
    return Promise.all(queryRequests.map(
      queryRequest => this._fetch(queryRequest).then(result => {
        if (result.errors) {
          queryRequest.reject(new Error("Query failed"));
        } else {
          queryRequest.resolve({response: result.data});
        }
      }).catch(e => queryRequest.reject(e))
    ))
  }

  supports(...options) {
    return false;
  }

  // Private:

  _fetch(queryRequest) {
    return new Promise((resolve, reject) => {
      let result
      let pgRole
      let error
      reject(new Error('Unimplemented'))
      return
      /*
      try {
        ;({result, pgRole} = await executeQuery(
          this.pgPool,
          this.options,
          this.jwtToken,
          this.gqlSchema,
          queryDocumentAst,
          variables,
          operationName
        ))
      } catch (e) {
        error = e;
      }
      if (error) {
        reject(error);
      } else {
        console.dir(result);
        // result.errors, result.data
        resolve(result);
      }
      */
    })
  }
};
