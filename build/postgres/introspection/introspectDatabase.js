"use strict";
var tslib_1 = require("tslib");
var path_1 = require("path");
var fs_1 = require("fs");
var minify = require("pg-minify");
var PgCatalog_1 = require("./PgCatalog");
/**
 * The introspection query SQL string. We read this from it’s SQL file
 * synchronously at runtime. It’s just like requiring a file, except that file
 * is SQL.
 */
var introspectionQuery = new Promise(function (resolve, reject) {
    fs_1.readFile(path_1.resolve(__dirname, '../../../resources/introspection-query.sql'), function (error, data) {
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
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var result, _a, _b, _c, _d, objects;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _b = (_a = client).query;
                    _d = {
                        name: 'introspectionQuery'
                    };
                    return [4 /*yield*/, introspectionQuery];
                case 1: return [4 /*yield*/, _b.apply(_a, [(_d.text = _e.sent(),
                            _d.values = [schemas],
                            _d)])];
                case 2:
                    result = _e.sent();
                    objects = new PgCatalog_1.default(result.rows.map(function (_a) {
                        var object = _a.object;
                        return object;
                    }));
                    return [2 /*return*/, objects];
            }
        });
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = introspectDatabase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50cm9zcGVjdERhdGFiYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludHJvc3BlY3Rpb24vaW50cm9zcGVjdERhdGFiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZDO0FBQzdDLHlCQUE2QjtBQUU3QixrQ0FBb0M7QUFDcEMseUNBQW1DO0FBRW5DOzs7O0dBSUc7QUFDSCxJQUFNLGtCQUFrQixHQUFHLElBQUksT0FBTyxDQUFTLFVBQUMsT0FBTyxFQUFFLE1BQU07SUFDN0QsYUFBUSxDQUFDLGNBQVcsQ0FBQyxTQUFTLEVBQUUsNENBQTRDLENBQUMsRUFBRSxVQUFDLEtBQUssRUFBRSxJQUFJO1FBQ3pGLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN4QixJQUFJO1lBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3ZDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRjs7OztHQUlHO0FBQ0gsNEJBQWtELE1BQXFCLEVBQUUsT0FBc0I7O29DQVN2RixPQUFPOzs7O29CQVBRLEtBQUEsQ0FBQSxLQUFBLE1BQU0sQ0FBQSxDQUFDLEtBQUssQ0FBQTs7d0JBQy9CLElBQUksRUFBRSxvQkFBb0I7O29CQUNwQixxQkFBTSxrQkFBa0IsRUFBQTt3QkFGakIscUJBQU0sZUFFbkIsT0FBSSxHQUFFLFNBQXdCOzRCQUM5QixTQUFNLEdBQUUsQ0FBQyxPQUFPLENBQUM7aUNBQ2pCLEVBQUE7OzZCQUphLFNBSWI7OEJBR2MsSUFBSSxtQkFBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBVTs0QkFBUixrQkFBTTt3QkFBTyxPQUFBLE1BQU07b0JBQU4sQ0FBTSxDQUFDLENBQUM7b0JBRXRFLHNCQUFPLE9BQU8sRUFBQTs7OztDQUNmOztBQVpELHFDQVlDIn0=