"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const graphql_1 = require('graphql');
const utils_1 = require('../../utils');
const getQueryGqlType_1 = require('../getQueryGqlType');
const getNodeInterfaceType_1 = require('./getNodeInterfaceType');
exports.$$nodeValueCollection = Symbol('nodeValueCollection');
// TODO: doc
function createNodeFieldEntry(buildToken) {
    const { inventory, options } = buildToken;
    return ['node', {
            description: `Fetches an object given its globally unique ${utils_1.scrib.type(graphql_1.GraphQLID)}.`,
            type: getNodeInterfaceType_1.default(buildToken),
            args: {
                [options.nodeIdFieldName]: {
                    description: `The globally unique ${utils_1.scrib.type(graphql_1.GraphQLID)}.`,
                    type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID),
                },
            },
            resolve(_source, args, context) {
                return __awaiter(this, void 0, void 0, function* () {
                    let deserializationResult;
                    const idString = args[options.nodeIdFieldName];
                    if (typeof idString !== 'string')
                        throw new Error('ID argument must be a string.');
                    // If the id is simply `query`, we want to give back our root query type.
                    // For now this is needed for Relay 1 mutations, maybe deprecate this in
                    // the future?
                    if (idString === 'query')
                        return getQueryGqlType_1.$$isQuery;
                    // Try to deserialize the id we got from our argument. If we fail to
                    // deserialize the id, we should just return null and ignore the error.
                    try {
                        deserializationResult = utils_1.idSerde.deserialize(inventory, idString);
                    }
                    catch (error) {
                        return null;
                    }
                    const { collection, keyValue } = deserializationResult;
                    const primaryKey = collection.primaryKey;
                    if (!primaryKey || !primaryKey.read)
                        throw new Error(`Invalid id, no readable primary key on collection named '${name}'.`);
                    const value = yield primaryKey.read(context, keyValue);
                    // If the value is null, end early.
                    if (value == null)
                        return value;
                    // Add the collection to the value so we can accurately determine the
                    // type. This way we will know exactly which collection this is for and
                    // can avoid ambiguous `isTypeOf` checks.
                    value[exports.$$nodeValueCollection] = collection;
                    return value;
                });
            },
        }];
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createNodeFieldEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlTm9kZUZpZWxkRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvZ3JhcGhxbC9zY2hlbWEvbm9kZS9jcmVhdGVOb2RlRmllbGRFbnRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwwQkFBOEQsU0FDOUQsQ0FBQyxDQURzRTtBQUV2RSx3QkFBK0IsYUFDL0IsQ0FBQyxDQUQyQztBQUU1QyxrQ0FBMEIsb0JBQzFCLENBQUMsQ0FENkM7QUFDOUMsdUNBQWlDLHdCQUVqQyxDQUFDLENBRndEO0FBRTVDLDZCQUFxQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBRWxFLFlBQVk7QUFDWiw4QkFBOEMsVUFBc0I7SUFDbEUsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsR0FBRyxVQUFVLENBQUE7SUFDekMsTUFBTSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQ2QsV0FBVyxFQUFFLCtDQUErQyxhQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFTLENBQUMsR0FBRztZQUNwRixJQUFJLEVBQUUsOEJBQW9CLENBQUMsVUFBVSxDQUFDO1lBQ3RDLElBQUksRUFBRTtnQkFDSixDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBRTtvQkFDekIsV0FBVyxFQUFFLHVCQUF1QixhQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFTLENBQUMsR0FBRztvQkFDNUQsSUFBSSxFQUFFLElBQUksd0JBQWMsQ0FBQyxtQkFBUyxDQUFDO2lCQUNwQzthQUNGO1lBQ0ssT0FBTyxDQUFFLE9BQWMsRUFBRSxJQUE4QixFQUFFLE9BQWM7O29CQUMzRSxJQUFJLHFCQUFrRSxDQUFBO29CQUN0RSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFBO29CQUU5QyxFQUFFLENBQUMsQ0FBQyxPQUFPLFFBQVEsS0FBSyxRQUFRLENBQUM7d0JBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtvQkFFbEQseUVBQXlFO29CQUN6RSx3RUFBd0U7b0JBQ3hFLGNBQWM7b0JBQ2QsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLDJCQUFTLENBQUE7b0JBRWxCLG9FQUFvRTtvQkFDcEUsdUVBQXVFO29CQUN2RSxJQUFJLENBQUM7d0JBQ0gscUJBQXFCLEdBQUcsZUFBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7b0JBQ2xFLENBQ0E7b0JBQUEsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzt3QkFDYixNQUFNLENBQUMsSUFBSSxDQUFBO29CQUNiLENBQUM7b0JBRUQsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQTtvQkFDdEQsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQTtvQkFFeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDO3dCQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxJQUFJLElBQUksQ0FBQyxDQUFBO29CQUV2RixNQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO29CQUV0RCxtQ0FBbUM7b0JBQ25DLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7d0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUE7b0JBRWQscUVBQXFFO29CQUNyRSx1RUFBdUU7b0JBQ3ZFLHlDQUF5QztvQkFDekMsS0FBSyxDQUFDLDZCQUFxQixDQUFDLEdBQUcsVUFBVSxDQUFBO29CQUV6QyxNQUFNLENBQUMsS0FBSyxDQUFBO2dCQUNkLENBQUM7YUFBQTtTQUNGLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFyREQ7c0NBcURDLENBQUEifQ==