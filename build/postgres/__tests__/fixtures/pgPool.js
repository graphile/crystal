"use strict";
const pg_1 = require('pg');
const pg_connection_string_1 = require('pg-connection-string');
const pgUrl = process.env.TEST_PG_URL || 'postgres://localhost:5432/postgraphql_test';
const pgPool = new pg_1.Pool(Object.assign({}, pg_connection_string_1.parse(pgUrl), {
    max: 15,
    idleTimeoutMillis: 500,
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdQb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL19fdGVzdHNfXy9maXh0dXJlcy9wZ1Bvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHFCQUFxQixJQUNyQixDQUFDLENBRHdCO0FBQ3pCLHVDQUFpRCxzQkFFakQsQ0FBQyxDQUZzRTtBQUV2RSxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSw0Q0FBNEMsQ0FBQTtBQUVyRixNQUFNLE1BQU0sR0FBRyxJQUFJLFNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSw0QkFBdUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtJQUN4RSxHQUFHLEVBQUUsRUFBRTtJQUNQLGlCQUFpQixFQUFFLEdBQUc7Q0FDdkIsQ0FBQyxDQUFDLENBQUE7QUFFSDtrQkFBZSxNQUFNLENBQUEifQ==