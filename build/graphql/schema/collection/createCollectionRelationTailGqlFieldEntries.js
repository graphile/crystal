"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const utils_1 = require('../../utils');
const getCollectionGqlType_1 = require('./getCollectionGqlType');
/**
 * Creates the fields for which the collection argument is the tail.
 * These fields will fetch a value from the head collection.
 */
// TODO: test
function createCollectionRelationTailGqlFieldEntries(buildToken, collection, options = {}) {
    const { inventory } = buildToken;
    // Some tests may choose to not include the inventory. If this is the case,
    // just return an empty array.
    if (!inventory)
        return [];
    const collectionGqlType = getCollectionGqlType_1.default(buildToken, collection);
    return (
    // Add all of our many-to-one relations (aka tail relations).
    inventory.getRelations()
        .filter(relation => relation.tailCollection === collection &&
        relation.headCollectionKey.read != null)
        .map((relation) => {
        const headCollectionKey = relation.headCollectionKey;
        const headCollection = headCollectionKey.collection;
        const headCollectionGqlType = getCollectionGqlType_1.default(buildToken, headCollection);
        return [
            options.getFieldName
                ? options.getFieldName(relation, collection)
                : utils_1.formatName.field(`${headCollection.type.name}-by-${relation.name}`),
            {
                description: `Reads a single ${utils_1.scrib.type(headCollectionGqlType)} that is related to this \`${collectionGqlType}\`.`,
                type: headCollectionGqlType,
                resolve(source, _args, context) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const value = options.getCollectionValue ? options.getCollectionValue(source) : source;
                        const key = relation.getHeadKeyFromTailValue(value);
                        const headValue = yield headCollectionKey.read(context, key);
                        if (headValue == null)
                            return;
                        return headValue;
                    });
                },
            },
        ];
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionRelationTailGqlFieldEntries;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvblJlbGF0aW9uVGFpbEdxbEZpZWxkRW50cmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL2NyZWF0ZUNvbGxlY3Rpb25SZWxhdGlvblRhaWxHcWxGaWVsZEVudHJpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUEsd0JBQWtDLGFBQ2xDLENBQUMsQ0FEOEM7QUFFL0MsdUNBQWlDLHdCQU9qQyxDQUFDLENBUHdEO0FBRXpEOzs7R0FHRztBQUNILGFBQWE7QUFDYixxREFDRSxVQUFzQixFQUN0QixVQUFzQixFQUN0QixPQUFPLEdBR0gsRUFBRTtJQUVOLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxVQUFVLENBQUE7SUFFaEMsMkVBQTJFO0lBQzNFLDhCQUE4QjtJQUM5QixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7SUFFekIsTUFBTSxpQkFBaUIsR0FBRyw4QkFBb0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDdEUsTUFBTSxDQUFDO0lBQ0wsNkRBQTZEO0lBQzdELFNBQVMsQ0FBQyxZQUFZLEVBQUU7U0FJckIsTUFBTSxDQUFDLFFBQVEsSUFDZCxRQUFRLENBQUMsY0FBYyxLQUFLLFVBQVU7UUFDdEMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksSUFBSSxJQUFJLENBQ3hDO1NBRUEsR0FBRyxDQUFDLENBQU8sUUFBd0I7UUFDbEMsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsaUJBQWlCLENBQUE7UUFDcEQsTUFBTSxjQUFjLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxDQUFBO1FBQ25ELE1BQU0scUJBQXFCLEdBQUcsOEJBQW9CLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBRTlFLE1BQU0sQ0FBQztZQUNMLE9BQU8sQ0FBQyxZQUFZO2tCQUNoQixPQUFPLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUM7a0JBQzFDLGtCQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZFO2dCQUNFLFdBQVcsRUFBRSxrQkFBa0IsYUFBSyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsaUJBQWlCLEtBQUs7Z0JBQ3BILElBQUksRUFBRSxxQkFBcUI7Z0JBQ3JCLE9BQU8sQ0FBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU87O3dCQUNuQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQTt3QkFDdEYsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNuRCxNQUFNLFNBQVMsR0FBRyxNQUFNLGlCQUFpQixDQUFDLElBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7d0JBRTdELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7NEJBQ3BCLE1BQU0sQ0FBQTt3QkFFUixNQUFNLENBQUMsU0FBUyxDQUFBO29CQUNsQixDQUFDO2lCQUFBO2FBQ0Y7U0FDRixDQUFBO0lBQ0gsQ0FBQyxDQUFDLENBQ0wsQ0FBQTtBQUNILENBQUM7QUFwREQ7NkRBb0RDLENBQUEifQ==