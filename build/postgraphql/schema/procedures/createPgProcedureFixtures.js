"use strict";
const getGqlType_1 = require('../../../graphql/schema/getGqlType');
const getTypeFromPgType_1 = require('../../../postgres/inventory/type/getTypeFromPgType');
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
    const { inventory } = buildToken;
    return {
        pgCatalog,
        pgProcedure,
        pgNamespace: pgCatalog.assertGetNamespace(pgProcedure.namespaceId),
        // Convert our args into their appropriate forms, also in this we create
        // the argument name if it does not exist.
        args: pgProcedure.argTypeIds.map((typeId, i) => {
            const name = pgProcedure.argNames[i] || `arg-${i}`;
            const pgType = pgCatalog.assertGetType(typeId);
            const type = getTypeFromPgType_1.default(pgCatalog, pgType, inventory);
            const gqlType = getGqlType_1.default(buildToken, type, true);
            return { name, pgType, type, gqlType };
        }),
        return: (() => {
            // Convert our return type into its appropriate forms.
            const pgType = pgCatalog.assertGetType(pgProcedure.returnTypeId);
            const type = getTypeFromPgType_1.default(pgCatalog, pgType, inventory);
            const gqlType = getGqlType_1.default(buildToken, type, false);
            return { pgType, type, gqlType };
        })(),
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createPgProcedureFixtures;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUGdQcm9jZWR1cmVGaXh0dXJlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhxbC9zY2hlbWEvcHJvY2VkdXJlcy9jcmVhdGVQZ1Byb2NlZHVyZUZpeHR1cmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFHQSw2QkFBdUIsb0NBQ3ZCLENBQUMsQ0FEMEQ7QUFFM0Qsb0NBQThCLG9EQUU5QixDQUFDLENBRmlGO0FBbUJsRjs7Ozs7Ozs7R0FRRztBQUNILG1DQUNFLFVBQXNCLEVBQ3RCLFNBQW9CLEVBQ3BCLFdBQStCO0lBRS9CLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxVQUFVLENBQUE7SUFDaEMsTUFBTSxDQUFDO1FBQ0wsU0FBUztRQUNULFdBQVc7UUFDWCxXQUFXLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7UUFFbEUsd0VBQXdFO1FBQ3hFLDBDQUEwQztRQUMxQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN6QyxNQUFNLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUE7WUFDbEQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUM5QyxNQUFNLElBQUksR0FBRywyQkFBaUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzVELE1BQU0sT0FBTyxHQUFHLG9CQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUNsRCxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQTtRQUN4QyxDQUFDLENBQUM7UUFFRixNQUFNLEVBQUUsQ0FBQztZQUNQLHNEQUFzRDtZQUN0RCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUNoRSxNQUFNLElBQUksR0FBRywyQkFBaUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzVELE1BQU0sT0FBTyxHQUFHLG9CQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUNuRCxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFBO1FBQ2xDLENBQUMsQ0FBQyxFQUFFO0tBQ0wsQ0FBQTtBQUNILENBQUM7QUE3QkQ7MkNBNkJDLENBQUEifQ==