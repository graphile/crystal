"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const path_1 = require('path');
const fs_1 = require('fs');
const minify = require('pg-minify');
const PgCatalog_1 = require('./PgCatalog');
/**
 * The introspection query SQL string. We read this from it’s SQL file
 * synchronously at runtime. It’s just like requiring a file, except that file
 * is SQL.
 */
const introspectionQuery = new Promise((resolve, reject) => {
    fs_1.readFile(path_1.resolve(__dirname, '../../../resources/introspection-query.sql'), (error, data) => {
        if (error)
            reject(error);
        else
            resolve(minify(data.toString()));
    });
});
/**
 * Takes a Postgres client and introspects it, returning an instance of
 * `PgObjects` which can then be consumed. Note that some translation is done
 * from the raw Postgres catalog to the friendlier `PgObjects` interface.
 */
function introspectDatabase(client, schemas) {
    return __awaiter(this, void 0, void 0, function* () {
        // Run our single introspection query in the database.
        const result = yield client.query({
            name: 'introspectionQuery',
            text: yield introspectionQuery,
            values: [schemas],
        });
        // Extract out the objects from the query.
        const objects = new PgCatalog_1.default(result.rows.map(({ object }) => object));
        return objects;
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = introspectDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50cm9zcGVjdERhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludHJvc3BlY3Rpb24vaW50cm9zcGVjdERhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHVCQUF1QyxNQUN2QyxDQUFDLENBRDRDO0FBQzdDLHFCQUF5QixJQUN6QixDQUFDLENBRDRCO0FBRTdCLE1BQU8sTUFBTSxXQUFXLFdBQVcsQ0FBQyxDQUFBO0FBQ3BDLDRCQUFzQixhQU90QixDQUFDLENBUGtDO0FBRW5DOzs7O0dBSUc7QUFDSCxNQUFNLGtCQUFrQixHQUFHLElBQUksT0FBTyxDQUFTLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDN0QsYUFBUSxDQUFDLGNBQVcsQ0FBQyxTQUFTLEVBQUUsNENBQTRDLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ3pGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4QixJQUFJO1lBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3ZDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRjs7OztHQUlHO0FBQ0gsNEJBQWtELE1BQWMsRUFBRSxPQUFpQjs7UUFDakYsc0RBQXNEO1FBQ3RELE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNoQyxJQUFJLEVBQUUsb0JBQW9CO1lBQzFCLElBQUksRUFBRSxNQUFNLGtCQUFrQjtZQUM5QixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDbEIsQ0FBQyxDQUFBO1FBRUYsMENBQTBDO1FBQzFDLE1BQU0sT0FBTyxHQUFHLElBQUksbUJBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUV0RSxNQUFNLENBQUMsT0FBTyxDQUFBO0lBQ2hCLENBQUM7O0FBWkQ7b0NBWUMsQ0FBQSJ9