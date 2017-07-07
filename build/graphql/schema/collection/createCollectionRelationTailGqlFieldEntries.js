"use strict";
var tslib_1 = require("tslib");
var interface_1 = require("../../../interface");
var utils_1 = require("../../utils");
var getGqlOutputType_1 = require("../type/getGqlOutputType");
/**
 * Creates the fields for which the collection argument is the tail.
 * These fields will fetch a value from the head collection.
 */
// TODO: test
function createCollectionRelationTailGqlFieldEntries(buildToken, collection, options) {
    var inventory = buildToken.inventory;
    // Some tests may choose to not include the inventory. If this is the case,
    // just return an empty array.
    if (!inventory)
        return [];
    var collectionGqlType = getGqlOutputType_1.default(buildToken, collection.type).gqlType;
    return (
    // Add all of our many-to-one relations (aka tail relations).
    inventory.getRelations()
        .filter(function (relation) {
        return relation.tailCollection === collection &&
            relation.headCollectionKey.read != null;
    })
        .map(function (relation) {
        var headCollectionKey = relation.headCollectionKey;
        var headCollection = headCollectionKey.collection;
        var _a = getGqlOutputType_1.default(buildToken, new interface_1.NullableType(headCollection.type)), headCollectionGqlType = _a.gqlType, intoGqlOutput = _a.intoGqlOutput;
        return [
            options.getFieldName
                ? options.getFieldName(relation, collection)
                : utils_1.formatName.field(headCollection.type.name + "-by-" + relation.name),
            {
                description: "Reads a single " + utils_1.scrib.type(headCollectionGqlType) + " that is related to this " + utils_1.scrib.type(collectionGqlType) + ".",
                type: headCollectionGqlType,
                resolve: function (source, _args, context) {
                    return tslib_1.__awaiter(this, void 0, void 0, function () {
                        var value, key, headValue;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    value = options.getCollectionValue(source);
                                    key = relation.getHeadKeyFromTailValue(value);
                                    return [4 /*yield*/, headCollectionKey.read(context, key)];
                                case 1:
                                    headValue = _a.sent();
                                    if (headValue == null)
                                        return [2 /*return*/];
                                    return [2 /*return*/, intoGqlOutput(headValue)];
                            }
                        });
                    });
                },
            },
        ];
    }));
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createCollectionRelationTailGqlFieldEntries;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQ29sbGVjdGlvblJlbGF0aW9uVGFpbEdxbEZpZWxkRW50cmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9ncmFwaHFsL3NjaGVtYS9jb2xsZWN0aW9uL2NyZWF0ZUNvbGxlY3Rpb25SZWxhdGlvblRhaWxHcWxGaWVsZEVudHJpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxnREFBdUU7QUFDdkUscUNBQStDO0FBRS9DLDZEQUF1RDtBQUV2RDs7O0dBR0c7QUFDSCxhQUFhO0FBQ2IscURBQ0UsVUFBc0IsRUFDdEIsVUFBOEIsRUFDOUIsT0FHQztJQUVPLElBQUEsZ0NBQVMsQ0FBZTtJQUVoQywyRUFBMkU7SUFDM0UsOEJBQThCO0lBQzlCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQTtJQUVqQixJQUFBLG1GQUEwQixDQUFrRDtJQUNwRixNQUFNLENBQUM7SUFDTCw2REFBNkQ7SUFDN0QsU0FBUyxDQUFDLFlBQVksRUFBRTtTQUlyQixNQUFNLENBQUMsVUFBQSxRQUFRO1FBQ2QsT0FBQSxRQUFRLENBQUMsY0FBYyxLQUFLLFVBQVU7WUFDdEMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksSUFBSSxJQUFJO0lBRHZDLENBQ3VDLENBQ3hDO1NBRUEsR0FBRyxDQUFDLFVBQXVCLFFBQWdEO1FBQzFFLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixDQUFBO1FBQ3BELElBQU0sY0FBYyxHQUFHLGlCQUFpQixDQUFDLFVBQVUsQ0FBQTtRQUM3QyxJQUFBLDhGQUF1SCxFQUFySCxrQ0FBOEIsRUFBRSxnQ0FBYSxDQUF3RTtRQUU3SCxNQUFNLENBQUM7WUFDTCxPQUFPLENBQUMsWUFBWTtrQkFDaEIsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDO2tCQUMxQyxrQkFBVSxDQUFDLEtBQUssQ0FBSSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksWUFBTyxRQUFRLENBQUMsSUFBTSxDQUFDO1lBQ3ZFO2dCQUNFLFdBQVcsRUFBRSxvQkFBa0IsYUFBSyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxpQ0FBNEIsYUFBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFHO2dCQUM1SCxJQUFJLEVBQUUscUJBQXFCO2dCQUNyQixPQUFPLEVBQWIsVUFBZSxNQUFlLEVBQUUsS0FBUyxFQUFFLE9BQWM7OzRCQUNqRCxLQUFLLEVBQ0wsR0FBRzs7Ozs0Q0FESyxPQUFPLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDOzBDQUNwQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsS0FBSyxDQUFDO29DQUNqQyxxQkFBTSxpQkFBaUIsQ0FBQyxJQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFBOztnREFBM0MsU0FBMkM7b0NBRTdELEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7d0NBQ3BCLE1BQU0sZ0JBQUE7b0NBRVIsc0JBQU8sYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFBOzs7O2lCQUNoQzthQUNGO1NBQ0YsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUNMLENBQUE7QUFDSCxDQUFDOztBQXBERCw4REFvREMifQ==