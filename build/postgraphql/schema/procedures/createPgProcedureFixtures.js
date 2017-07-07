"use strict";
var tslib_1 = require("tslib");
var getGqlInputType_1 = require("../../../graphql/schema/type/getGqlInputType");
var getGqlOutputType_1 = require("../../../graphql/schema/type/getGqlOutputType");
var getTypeFromPgType_1 = require("../../../postgres/inventory/type/getTypeFromPgType");
/**
 * Creates some signature fixtures for a Postgres procedure. Contains the
 * Postgres type, the interface type, and the GraphQL type for all of the
 * arguments and the return type.
 *
 * Generally these fixtures would just be class instance members, but sense we
 * aren’t going through an interface here we need to create/share fixtures some
 * other way.
 */
function createPgProcedureFixtures(buildToken, pgCatalog, pgProcedure) {
    var inventory = buildToken.inventory;
    return {
        pgCatalog: pgCatalog,
        pgProcedure: pgProcedure,
        pgNamespace: pgCatalog.assertGetNamespace(pgProcedure.namespaceId),
        // Convert our args into their appropriate forms, also in this we create
        // the argument name if it does not exist.
        args: pgProcedure.argTypeIds.map(function (typeId, i) {
            var name = pgProcedure.argNames[i] || "arg-" + i;
            var pgType = pgCatalog.assertGetType(typeId);
            var type = getTypeFromPgType_1.default(pgCatalog, pgType, inventory);
            return tslib_1.__assign({ name: name, pgType: pgType, type: type }, getGqlInputType_1.default(buildToken, type));
        }),
        return: (function () {
            // If this procedure returns the special “void” type then we do not want
            // to return any fixtures for the return type.
            if (pgProcedure.returnTypeId === '2278') {
                return null;
            }
            // Convert our return type into its appropriate forms.
            var pgType = pgCatalog.assertGetType(pgProcedure.returnTypeId);
            var type = getTypeFromPgType_1.default(pgCatalog, pgType, inventory);
            return tslib_1.__assign({ pgType: pgType, type: type }, getGqlOutputType_1.default(buildToken, type));
        })(),
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureFixtures;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVGaXh0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvcHJvY2VkdXJlcy9jcmVhdGVQZ1Byb2NlZHVyZUZpeHR1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsZ0ZBQTBFO0FBQzFFLGtGQUE0RTtBQUU1RSx3RkFBa0Y7QUF3QmxGOzs7Ozs7OztHQVFHO0FBQ0gsbUNBQ0UsVUFBc0IsRUFDdEIsU0FBb0IsRUFDcEIsV0FBK0I7SUFFdkIsSUFBQSxnQ0FBUyxDQUFlO0lBQ2hDLE1BQU0sQ0FBQztRQUNMLFNBQVMsV0FBQTtRQUNULFdBQVcsYUFBQTtRQUNYLFdBQVcsRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQztRQUVsRSx3RUFBd0U7UUFDeEUsMENBQTBDO1FBQzFDLElBQUksRUFBRSxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3pDLElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBTyxDQUFHLENBQUE7WUFDbEQsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM5QyxJQUFNLElBQUksR0FBRywyQkFBaUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzVELE1BQU0sb0JBQUcsSUFBSSxNQUFBLEVBQUUsTUFBTSxRQUFBLEVBQUUsSUFBSSxNQUFBLElBQUsseUJBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDckUsQ0FBQyxDQUFDO1FBRUYsTUFBTSxFQUFFLENBQUM7WUFDUCx3RUFBd0U7WUFDeEUsOENBQThDO1lBQzlDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQTtZQUNiLENBQUM7WUFDRCxzREFBc0Q7WUFDdEQsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDaEUsSUFBTSxJQUFJLEdBQUcsMkJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQTtZQUM1RCxNQUFNLG9CQUFHLE1BQU0sUUFBQSxFQUFFLElBQUksTUFBQSxJQUFLLDBCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRTtRQUNoRSxDQUFDLENBQUMsRUFBRTtLQUNMLENBQUE7QUFDSCxDQUFDOztBQWhDRCw0Q0FnQ0MifQ==