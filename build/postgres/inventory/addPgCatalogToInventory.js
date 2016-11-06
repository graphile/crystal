"use strict";
const PgCollection_1 = require('./collection/PgCollection');
const PgRelation_1 = require('./collection/PgRelation');
/**
 * Adds Postgres based objects created by introspection to an inventory.
 */
function addPgCatalogToInventory(inventory, pgCatalog, config = {}) {
    // Turn our config full of optional options, into an options object with the
    // appropriate defaults.
    const options = {
        renameIdToRowId: config.renameIdToRowId || false,
    };
    // We save a reference to all our collections by their class’s id so that we
    // can reference them again later.
    const collectionByClassId = new Map();
    // Add all of our collections. If a class is not selectable, it is probably a
    // compound type and we shouldn’t add a collection for it to our inventory.
    //
    // We also won’t add collection classes if they exist outside a namespace we
    // support.
    for (const pgClass of pgCatalog.getClasses()) {
        if (pgClass.isSelectable && pgCatalog.getNamespace(pgClass.namespaceId)) {
            const collection = new PgCollection_1.default(options, pgCatalog, pgClass);
            inventory.addCollection(collection);
            collectionByClassId.set(pgClass.id, collection);
        }
    }
    // Add all of the relations that exist in our database to the inventory. We
    // discover relations by looking at foreign key constraints in Postgres.
    // TODO: This implementation of relations could be better…
    for (const pgConstraint of pgCatalog.getConstraints()) {
        if (pgConstraint.type === 'f') {
            const tailCollection = collectionByClassId.get(pgConstraint.classId);
            // Here we get the collection key for our foreign table that has the
            // same key attribute numbers we are looking for.
            const headCollectionKey = collectionByClassId.get(pgConstraint.foreignClassId).keys
                .find(key => {
                const numsA = pgConstraint.foreignKeyAttributeNums;
                const numsB = key.pgConstraint.keyAttributeNums;
                // Make sure that the length of `numsA` and `numsB` are the same.
                if (numsA.length !== numsB.length)
                    return false;
                // Make sure all of the items in `numsA` are also in `numsB` (order
                // does not matter).
                return numsA.reduce((last, num) => last && numsB.indexOf(num) !== -1, true);
            });
            // If no collection key could be found, we need to throw an error.
            if (!headCollectionKey) {
                throw new Error('No primary key or unique constraint found for the column(s) ' +
                    `${pgCatalog.getClassAttributes(pgConstraint.foreignClassId, pgConstraint.foreignKeyAttributeNums).map(({ name }) => `'${name}'`).join(', ')} ` +
                    'of table ' +
                    `'${pgCatalog.assertGetClass(pgConstraint.foreignClassId).name}'. ` +
                    'Cannot create a relation without such a constraint. Without this ' +
                    'constraint referenced values are not ensured to be unique and ' +
                    'lookups may not be performant.');
            }
            inventory.addRelation(new PgRelation_1.default(tailCollection, headCollectionKey, pgConstraint));
        }
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addPgCatalogToInventory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUGdDYXRhbG9nVG9JbnZlbnRvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcG9zdGdyZXMvaW52ZW50b3J5L2FkZFBnQ2F0YWxvZ1RvSW52ZW50b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSwrQkFBeUIsMkJBQ3pCLENBQUMsQ0FEbUQ7QUFDcEQsNkJBQXVCLHlCQUN2QixDQUFDLENBRCtDO0FBR2hEOztHQUVHO0FBQ0gsaUNBQ0UsU0FBb0IsRUFDcEIsU0FBb0IsRUFDcEIsTUFBTSxHQUFrQyxFQUFFO0lBRTFDLDRFQUE0RTtJQUM1RSx3QkFBd0I7SUFDeEIsTUFBTSxPQUFPLEdBQVk7UUFDdkIsZUFBZSxFQUFFLE1BQU0sQ0FBQyxlQUFlLElBQUksS0FBSztLQUNqRCxDQUFBO0lBRUQsNEVBQTRFO0lBQzVFLGtDQUFrQztJQUNsQyxNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxFQUF3QixDQUFBO0lBRTNELDZFQUE2RTtJQUM3RSwyRUFBMkU7SUFDM0UsRUFBRTtJQUNGLDRFQUE0RTtJQUM1RSxXQUFXO0lBQ1gsR0FBRyxDQUFDLENBQUMsTUFBTSxPQUFPLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3QyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RSxNQUFNLFVBQVUsR0FBRyxJQUFJLHNCQUFZLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNoRSxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1lBQ25DLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1FBQ2pELENBQUM7SUFDSCxDQUFDO0lBRUQsMkVBQTJFO0lBQzNFLHdFQUF3RTtJQUN4RSwwREFBMEQ7SUFDMUQsR0FBRyxDQUFDLENBQUMsTUFBTSxZQUFZLElBQUksU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RCxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxjQUFjLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUUsQ0FBQTtZQUVyRSxvRUFBb0U7WUFDcEUsaURBQWlEO1lBQ2pELE1BQU0saUJBQWlCLEdBQ3JCLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFFLENBQUMsSUFBSTtpQkFDdkQsSUFBSSxDQUFDLEdBQUc7Z0JBQ1AsTUFBTSxLQUFLLEdBQUcsWUFBWSxDQUFDLHVCQUF1QixDQUFBO2dCQUNsRCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFBO2dCQUUvQyxpRUFBaUU7Z0JBQ2pFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQztvQkFBQyxNQUFNLENBQUMsS0FBSyxDQUFBO2dCQUUvQyxtRUFBbUU7Z0JBQ25FLG9CQUFvQjtnQkFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBQzdFLENBQUMsQ0FBQyxDQUFBO1lBRU4sa0VBQWtFO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixNQUFNLElBQUksS0FBSyxDQUNiLDhEQUE4RDtvQkFDOUQsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUc7b0JBQy9JLFdBQVc7b0JBQ1gsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQyxJQUFJLEtBQUs7b0JBQ25FLG1FQUFtRTtvQkFDbkUsZ0VBQWdFO29CQUNoRSxnQ0FBZ0MsQ0FDakMsQ0FBQTtZQUNILENBQUM7WUFFRCxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksb0JBQVUsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQTtRQUN4RixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFuRUQ7eUNBbUVDLENBQUEifQ==