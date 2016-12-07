"use strict";
const PgObjectType_1 = require('./PgObjectType');
/**
 * A custom Postgres class object type which extends `PgObjectType`. Provides a
 * clear interface when construction a type using a class and exposes the
 * `PgCatalogClass` as a property. That last bit is helpful for procedures.
 */
// TODO: Refactor how we handle Postgres types entirely.
class PgClassObjectType extends PgObjectType_1.default {
    constructor(pgCatalog, pgClass, config = {}) {
        const pgType = pgCatalog.assertGetType(pgClass.typeId);
        super({
            name: config.name || pgClass.name || pgType.name,
            description: pgClass.description || pgType.description,
            pgCatalog,
            pgAttributes: new Map(pgCatalog.getClassAttributes(pgClass.id).map(pgAttribute => [config.renameIdToRowId && pgAttribute.name === 'id' ? 'row_id' : pgAttribute.name, pgAttribute])),
        });
        this.pgClass = pgClass;
        this.pgType = pgCatalog.assertGetType(pgClass.typeId);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PgClassObjectType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGdDbGFzc09iamVjdFR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L3R5cGUvUGdDbGFzc09iamVjdFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLCtCQUF5QixnQkFRekIsQ0FBQyxDQVJ3QztBQUV6Qzs7OztHQUlHO0FBQ0gsd0RBQXdEO0FBQ3hELGdDQUFnQyxzQkFBWTtJQUMxQyxZQUNFLFNBQW9CLEVBQ3BCLE9BQXVCLEVBQ3ZCLE1BQU0sR0FBaUQsRUFBRTtRQUV6RCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN0RCxNQUFNO1lBQ0osSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLENBQUMsSUFBSTtZQUNoRCxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVztZQUN0RCxTQUFTO1lBQ1QsWUFBWSxFQUFFLElBQUksR0FBRyxDQUNuQixTQUFTLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBK0IsV0FBVyxJQUNwRixDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksV0FBVyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsUUFBUSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQ2pHLENBQUM7U0FDTCxDQUFDLENBQUE7UUFDRixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBMkIsQ0FBQTtJQUNqRixDQUFDO0FBSUgsQ0FBQztBQUVEO2tCQUFlLGlCQUFpQixDQUFBIn0=