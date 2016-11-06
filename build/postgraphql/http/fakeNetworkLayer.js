// See: https://facebook.github.io/relay/docs/interfaces-relay-network-layer.html
//
// This class implements a "network layer" for relay that can be used on the
// server side, enabling server-side rendering of a relay app.
"use strict";
class ServerSideNetworkLayer {
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
        console.dir(queryRequests);
        return Promise.all(queryRequests.map(queryRequest => this._fetch(queryRequest).then(result => {
            if (result.errors) {
                queryRequest.reject(new Error("Query failed"));
            }
            else {
                queryRequest.resolve({ response: result.data });
            }
        }).catch(queryRequest.reject)));
    }
    supports(...options) {
        return false;
    }
    // Private:
    _fetch(queryRequest) {
        return new Promise((resolve, reject) => {
            let result;
            let pgRole;
            let error;
            return reject('Unimplemented');
            /*
            try {
              ({result, pgRole} = await executeQuery(
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
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerSideNetworkLayer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZU5ldHdvcmtMYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL2Zha2VOZXR3b3JrTGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUZBQWlGO0FBQ2pGLEVBQUU7QUFDRiw0RUFBNEU7QUFDNUUsOERBQThEOztBQUU5RDtJQUNFLFlBQVksTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxHQUFHLEVBQUU7UUFDbkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELFlBQVksQ0FBQyxlQUFlO1FBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELFdBQVcsQ0FBQyxhQUFhO1FBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDMUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDbEMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07WUFDbkQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNqRCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FDOUIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELFFBQVEsQ0FBQyxHQUFHLE9BQU87UUFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxXQUFXO0lBRVgsTUFBTSxDQUFDLFlBQVk7UUFDakIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsSUFBSSxNQUFNLENBQUE7WUFDVixJQUFJLE1BQU0sQ0FBQTtZQUNWLElBQUksS0FBSyxDQUFBO1lBQ1QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUM5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2NBcUJFO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQztBQTdERDt3Q0E2REMsQ0FBQTtBQUFBLENBQUMifQ==