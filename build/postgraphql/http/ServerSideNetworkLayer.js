"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const executeQuery_1 = require('./executeQuery');
const graphql_1 = require('graphql');
// See: https://facebook.github.io/relay/docs/interfaces-relay-network-layer.html
//
// This class implements a "network layer" for relay that can be used on the
// server side, enabling server-side rendering of a relay app.
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
        return Promise.all(queryRequests.map(queryRequest => this._fetch(queryRequest).then(result => {
            if (result.errors) {
                queryRequest.reject(new Error("Query failed"));
            }
            else {
                queryRequest.resolve({ response: result.data });
            }
        }).catch(e => queryRequest.reject(e))));
    }
    supports(...options) {
        return false;
    }
    // Private:
    _fetch(request) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            let pgRole;
            let error;
            const query = request.getQueryString();
            const variables = request.getVariables();
            const source = new graphql_1.Source(query, 'GraphQL Http Request');
            let queryDocumentAst;
            let operationName;
            try {
                queryDocumentAst = graphql_1.parse(source);
            }
            catch (error) {
                reject(error);
                return;
            }
            try {
                ;
                ({ result, pgRole } = yield executeQuery_1.default(this.pgPool, this.options, this.jwtToken, this.gqlSchema, queryDocumentAst, variables, operationName));
            }
            catch (e) {
                error = e;
            }
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        }));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServerSideNetworkLayer;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyU2lkZU5ldHdvcmtMYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9odHRwL1NlcnZlclNpZGVOZXR3b3JrTGF5ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsK0JBQXlCLGdCQUN6QixDQUFDLENBRHdDO0FBQ3pDLDBCQVFPLFNBTVAsQ0FBQyxDQU5lO0FBQ2hCLGlGQUFpRjtBQUNqRixFQUFFO0FBQ0YsNEVBQTRFO0FBQzVFLDhEQUE4RDtBQUU5RDtJQUNFLFlBQVksTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTyxHQUFHLEVBQUU7UUFDbkQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELFlBQVksQ0FBQyxlQUFlO1FBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELFdBQVcsQ0FBQyxhQUFhO1FBQ3ZCLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ2xDLFlBQVksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO1lBQ25ELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDakQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN0QyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsUUFBUSxDQUFDLEdBQUcsT0FBTztRQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFdBQVc7SUFFWCxNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNO1lBQ3ZDLElBQUksTUFBTSxDQUFBO1lBQ1YsSUFBSSxNQUFNLENBQUE7WUFDVixJQUFJLEtBQUssQ0FBQTtZQUNULE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUN0QyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUE7WUFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLEtBQUssRUFBRSxzQkFBc0IsQ0FBQyxDQUFBO1lBQ3hELElBQUksZ0JBQWdCLENBQUE7WUFDcEIsSUFBSSxhQUFhLENBQUE7WUFDakIsSUFBSSxDQUFDO2dCQUNILGdCQUFnQixHQUFHLGVBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUN6QyxDQUNBO1lBQUEsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ2IsTUFBTSxDQUFBO1lBQ1IsQ0FBQztZQUNELElBQUksQ0FBQztnQkFDSCxDQUFDO2dCQUFBLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLEdBQUcsTUFBTSxzQkFBWSxDQUNyQyxJQUFJLENBQUMsTUFBTSxFQUNYLElBQUksQ0FBQyxPQUFPLEVBQ1osSUFBSSxDQUFDLFFBQVEsRUFDYixJQUFJLENBQUMsU0FBUyxFQUNkLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsYUFBYSxDQUNkLENBQUMsQ0FBQTtZQUNKLENBQUU7WUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNYLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDWixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNsQixDQUFDO1FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNKLENBQUM7QUFDSCxDQUFDO0FBbkVEO3dDQW1FQyxDQUFBO0FBQUEsQ0FBQyJ9