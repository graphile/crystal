"use strict";
var pg_1 = require("pg");
var pg_connection_string_1 = require("pg-connection-string");
var pgUrl = process.env.TEST_PG_URL || 'postgres://localhost:5432/postgraphql_test';
var pgPool = new pg_1.Pool(Object.assign({}, pg_connection_string_1.parse(pgUrl), {
    max: 15,
    idleTimeoutMillis: 500,
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdQb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL19fdGVzdHNfXy91dGlscy9wZ1Bvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHlCQUF5QjtBQUN6Qiw2REFBdUU7QUFFdkUsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksNENBQTRDLENBQUE7QUFFckYsSUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsNEJBQXVCLENBQUMsS0FBSyxDQUFDLEVBQUU7SUFDeEUsR0FBRyxFQUFFLEVBQUU7SUFDUCxpQkFBaUIsRUFBRSxHQUFHO0NBQ3ZCLENBQUMsQ0FBQyxDQUFBOztBQUVILGtCQUFlLE1BQU0sQ0FBQSJ9