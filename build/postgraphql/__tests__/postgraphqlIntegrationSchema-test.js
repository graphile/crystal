// TODO: There may be some excessive waste, if we could somehow filter what
// these guys see, that would be great 👍
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const graphql_1 = require('graphql');
const withPgClient_1 = require('../../postgres/__tests__/fixtures/withPgClient');
const createPostGraphQLSchema_1 = require('../schema/createPostGraphQLSchema');
// This test suite can be flaky. Increase it’s timeout.
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 20;
test('prints a schema with the default options', withPgClient_1.default((pgClient) => __awaiter(this, void 0, void 0, function* () {
    const gqlSchema = yield createPostGraphQLSchema_1.default(pgClient, ['a', 'b', 'c']);
    expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
})));
test('prints a schema with Relay 1 style ids', withPgClient_1.default((pgClient) => __awaiter(this, void 0, void 0, function* () {
    const gqlSchema = yield createPostGraphQLSchema_1.default(pgClient, 'c', { classicIds: true });
    expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
})));
test('prints a schema with a JWT generating mutation', withPgClient_1.default((pgClient) => __awaiter(this, void 0, void 0, function* () {
    const gqlSchema = yield createPostGraphQLSchema_1.default(pgClient, 'b', { jwtSecret: 'secret', jwtPgTypeIdentifier: 'b.jwt_token' });
    expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
})));
test('prints a schema without default mutations', withPgClient_1.default((pgClient) => __awaiter(this, void 0, void 0, function* () {
    const gqlSchema = yield createPostGraphQLSchema_1.default(pgClient, 'c', { disableDefaultMutations: true });
    expect(graphql_1.printSchema(gqlSchema)).toMatchSnapshot();
})));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdGdyYXBocWxJbnRlZ3JhdGlvblNjaGVtYS10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL19fdGVzdHNfXy9wb3N0Z3JhcGhxbEludGVncmF0aW9uU2NoZW1hLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkVBQTJFO0FBQzNFLHlDQUF5Qzs7Ozs7Ozs7OztBQUV6QywwQkFBNEIsU0FDNUIsQ0FBQyxDQURvQztBQUNyQywrQkFBeUIsZ0RBQ3pCLENBQUMsQ0FEd0U7QUFDekUsMENBQW9DLG1DQUdwQyxDQUFDLENBSHNFO0FBRXZFLHVEQUF1RDtBQUN2RCxPQUFPLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUU1QyxJQUFJLENBQUMsMENBQTBDLEVBQUUsc0JBQVksQ0FBQyxDQUFNLFFBQVE7SUFDMUUsTUFBTSxTQUFTLEdBQUcsTUFBTSxpQ0FBdUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDMUUsTUFBTSxDQUFDLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFFSCxJQUFJLENBQUMsd0NBQXdDLEVBQUUsc0JBQVksQ0FBQyxDQUFNLFFBQVE7SUFDeEUsTUFBTSxTQUFTLEdBQUcsTUFBTSxpQ0FBdUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDcEYsTUFBTSxDQUFDLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUE7QUFFSCxJQUFJLENBQUMsZ0RBQWdELEVBQUUsc0JBQVksQ0FBQyxDQUFNLFFBQVE7SUFDaEYsTUFBTSxTQUFTLEdBQUcsTUFBTSxpQ0FBdUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFBO0lBQzNILE1BQU0sQ0FBQyxxQkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsZUFBZSxFQUFFLENBQUE7QUFDbEQsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFBO0FBR0gsSUFBSSxDQUFDLDJDQUEyQyxFQUFFLHNCQUFZLENBQUMsQ0FBTSxRQUFRO0lBQzNFLE1BQU0sU0FBUyxHQUFHLE1BQU0saUNBQXVCLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLHVCQUF1QixFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDakcsTUFBTSxDQUFDLHFCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtBQUNsRCxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUEifQ==