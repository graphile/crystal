"use strict";
var PgCollection_1 = require("./collection/PgCollection");
var PgRelation_1 = require("./collection/PgRelation");
/**
 * Adds Postgres based objects created by introspection to an inventory.
 */
function addPgCatalogToInventory(inventory, pgCatalog, config) {
    if (config === void 0) { config = {}; }
    // Turn our config full of optional options, into an options object with the
    // appropriate defaults.
    var options = {
        renameIdToRowId: config.renameIdToRowId || false,
    };
    // We save a reference to all our collections by their class’s id so that we
    // can reference them again later.
    var collectionByClassId = new Map();
    // Add all of our collections. If a class is not selectable, it is probably a
    // compound type and we shouldn’t add a collection for it to our inventory.
    //
    // We also won’t add collection classes if they exist outside a namespace we
    // support.
    for (var _i = 0, _a = pgCatalog.getClasses(); _i < _a.length; _i++) {
        var pgClass = _a[_i];
        if (pgClass.isSelectable && pgCatalog.getNamespace(pgClass.namespaceId)) {
            var collection = new PgCollection_1.default(options, pgCatalog, pgClass);
            inventory.addCollection(collection);
            collectionByClassId.set(pgClass.id, collection);
        }
    }
    var _loop_1 = function (pgConstraint) {
        if (pgConstraint.type === 'f') {
            var tailCollection = collectionByClassId.get(pgConstraint.classId);
            // Here we get the collection key for our foreign table that has the
            // same key attribute numbers we are looking for.
            var headCollectionKey = collectionByClassId.get(pgConstraint.foreignClassId).keys
                .find(function (key) {
                var numsA = pgConstraint.foreignKeyAttributeNums;
                var numsB = key.pgConstraint.keyAttributeNums;
                // Make sure that the length of `numsA` and `numsB` are the same.
                if (numsA.length !== numsB.length)
                    return false;
                // Make sure all of the items in `numsA` are also in `numsB` (order
                // does not matter).
                return numsA.reduce(function (last, num) { return last && numsB.indexOf(num) !== -1; }, true);
            });
            // If no collection key could be found, we need to throw an error.
            if (!headCollectionKey) {
                throw new Error('No primary key or unique constraint found for the column(s) ' +
                    (pgCatalog.getClassAttributes(pgConstraint.foreignClassId, pgConstraint.foreignKeyAttributeNums).map(function (_a) {
                        var name = _a.name;
                        return "'" + name + "'";
                    }).join(', ') + " ") +
                    'of table ' +
                    ("'" + pgCatalog.assertGetClass(pgConstraint.foreignClassId).name + "'. ") +
                    'Cannot create a relation without such a constraint. Without this ' +
                    'constraint referenced values are not ensured to be unique and ' +
                    'lookups may not be performant.');
            }
            inventory.addRelation(new PgRelation_1.default(tailCollection, headCollectionKey, pgConstraint));
        }
    };
    // Add all of the relations that exist in our database to the inventory. We
    // discover relations by looking at foreign key constraints in Postgres.
    // TODO: This implementation of relations could be better…
    for (var _b = 0, _c = pgCatalog.getConstraints(); _b < _c.length; _b++) {
        var pgConstraint = _c[_b];
        _loop_1(pgConstraint);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addPgCatalogToInventory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUGdDYXRhbG9nVG9JbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2FkZFBnQ2F0YWxvZ1RvSW52ZW50b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSwwREFBb0Q7QUFDcEQsc0RBQWdEO0FBR2hEOztHQUVHO0FBQ0gsaUNBQ0UsU0FBb0IsRUFDcEIsU0FBb0IsRUFDcEIsTUFBMEM7SUFBMUMsdUJBQUEsRUFBQSxXQUEwQztJQUUxQyw0RUFBNEU7SUFDNUUsd0JBQXdCO0lBQ3hCLElBQU0sT0FBTyxHQUFZO1FBQ3ZCLGVBQWUsRUFBRSxNQUFNLENBQUMsZUFBZSxJQUFJLEtBQUs7S0FDakQsQ0FBQTtJQUVELDRFQUE0RTtJQUM1RSxrQ0FBa0M7SUFDbEMsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLEdBQUcsRUFBd0IsQ0FBQTtJQUUzRCw2RUFBNkU7SUFDN0UsMkVBQTJFO0lBQzNFLEVBQUU7SUFDRiw0RUFBNEU7SUFDNUUsV0FBVztJQUNYLEdBQUcsQ0FBQyxDQUFrQixVQUFzQixFQUF0QixLQUFBLFNBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0I7UUFBdkMsSUFBTSxPQUFPLFNBQUE7UUFDaEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEUsSUFBTSxVQUFVLEdBQUcsSUFBSSxzQkFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDaEUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUNuQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUNqRCxDQUFDO0tBQ0Y7NEJBS1UsWUFBWTtRQUNyQixFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBTSxjQUFjLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsQ0FBQTtZQUVyRSxvRUFBb0U7WUFDcEUsaURBQWlEO1lBQ2pELElBQU0saUJBQWlCLEdBQ3JCLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFFLENBQUMsSUFBSTtpQkFDdkQsSUFBSSxDQUFDLFVBQUEsR0FBRztnQkFDUCxJQUFNLEtBQUssR0FBRyxZQUFZLENBQUMsdUJBQXVCLENBQUE7Z0JBQ2xELElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUE7Z0JBRS9DLGlFQUFpRTtnQkFDakUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7Z0JBRS9DLG1FQUFtRTtnQkFDbkUsb0JBQW9CO2dCQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHLElBQUssT0FBQSxJQUFJLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUM3RSxDQUFDLENBQUMsQ0FBQTtZQUVOLGtFQUFrRTtZQUNsRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxJQUFJLEtBQUssQ0FDYiw4REFBOEQ7cUJBQzNELFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEVBQVE7NEJBQU4sY0FBSTt3QkFBTyxPQUFBLE1BQUksSUFBSSxNQUFHO29CQUFYLENBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBRyxDQUFBO29CQUMvSSxXQUFXO3FCQUNYLE1BQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsSUFBSSxRQUFLLENBQUE7b0JBQ25FLG1FQUFtRTtvQkFDbkUsZ0VBQWdFO29CQUNoRSxnQ0FBZ0MsQ0FDakMsQ0FBQTtZQUNILENBQUM7WUFFRCxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksb0JBQVUsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUN4RixDQUFDO0lBQ0gsQ0FBQztJQXRDRCwyRUFBMkU7SUFDM0Usd0VBQXdFO0lBQ3hFLDBEQUEwRDtJQUMxRCxHQUFHLENBQUMsQ0FBdUIsVUFBMEIsRUFBMUIsS0FBQSxTQUFTLENBQUMsY0FBYyxFQUFFLEVBQTFCLGNBQTBCLEVBQTFCLElBQTBCO1FBQWhELElBQU0sWUFBWSxTQUFBO2dCQUFaLFlBQVk7S0FtQ3RCO0FBQ0gsQ0FBQzs7QUFuRUQsMENBbUVDIn0=