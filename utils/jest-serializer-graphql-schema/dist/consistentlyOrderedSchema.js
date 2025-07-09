"use strict";
// This file is broadly copied from parts of graphql-js, and thus the license
// is MIT with copyright to GraphQL Contributors:
/*
 * MIT License
 *
 * Copyright (c) GraphQL Contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.consistentlyOrderedSchema = consistentlyOrderedSchema;
exports.naturalCompare = naturalCompare;
const graphql_1 = require("graphql");
const util_1 = require("util");
function isNotNullish(v) {
    return v != null;
}
/**
 * This function is heavily based on
 * {@link https://github.com/graphql/graphql-js/blob/0eb088b3d1228ac60568912c705401341f3b769d/src/utilities/lexicographicSortSchema.js | `lexicographicSortSchema` from `graphql`}
 * (MIT license), but differs in that it does not change the order of fields,
 * arguments or enum values.
 */
function consistentlyOrderedSchema(schema) {
    const schemaConfig = schema.toConfig();
    const typeMap = keyValMap(sortByName(schemaConfig.types), (type) => type.name, sortNamedType);
    return new graphql_1.GraphQLSchema({
        ...schemaConfig,
        types: Object.values(typeMap).filter(isNotNullish),
        directives: sortByName(schemaConfig.directives).map(sortDirective),
        query: replaceMaybeType(schemaConfig.query),
        mutation: replaceMaybeType(schemaConfig.mutation),
        subscription: replaceMaybeType(schemaConfig.subscription),
    });
    function replaceType(type) {
        if ((0, graphql_1.isListType)(type)) {
            return new graphql_1.GraphQLList(replaceType(type.ofType));
        }
        else if ((0, graphql_1.isNonNullType)(type)) {
            return new graphql_1.GraphQLNonNull(replaceType(type.ofType));
        }
        return replaceNamedType(type);
    }
    function replaceNamedType(type) {
        return typeMap[type.name];
    }
    function replaceMaybeType(maybeType) {
        return maybeType && replaceNamedType(maybeType);
    }
    function sortDirective(directive) {
        const config = directive.toConfig();
        return new graphql_1.GraphQLDirective({
            ...config,
            locations: sortBy(config.locations, (x) => x),
            args: replaceArgs(config.args),
        });
    }
    function replaceArgs(args) {
        return objMap(args, (arg) => ({
            ...arg,
            type: replaceType(arg.type),
        }));
    }
    function sortFields(fieldsMap) {
        return objMap(fieldsMap, (field) => ({
            ...field,
            type: replaceType(field.type),
            args: field.args && replaceArgs(field.args),
        }));
    }
    function sortInputFields(fieldsMap) {
        return objMap(fieldsMap, (field) => ({
            ...field,
            type: replaceType(field.type),
        }));
    }
    function sortTypes(array) {
        return sortByName(array).map(replaceNamedType);
    }
    function sortNamedType(type) {
        if ((0, graphql_1.isScalarType)(type) || (0, graphql_1.isIntrospectionType)(type)) {
            return type;
        }
        if ((0, graphql_1.isObjectType)(type)) {
            const config = type.toConfig();
            return new graphql_1.GraphQLObjectType({
                ...config,
                interfaces: () => sortTypes(config.interfaces),
                fields: () => sortFields(config.fields),
            });
        }
        if ((0, graphql_1.isInterfaceType)(type)) {
            const config = type.toConfig();
            return new graphql_1.GraphQLInterfaceType({
                ...config,
                interfaces: () => sortTypes(config.interfaces),
                fields: () => sortFields(config.fields),
            });
        }
        if ((0, graphql_1.isUnionType)(type)) {
            const config = type.toConfig();
            return new graphql_1.GraphQLUnionType({
                ...config,
                types: () => sortTypes(config.types),
            });
        }
        if ((0, graphql_1.isEnumType)(type)) {
            const config = type.toConfig();
            return new graphql_1.GraphQLEnumType({
                ...config,
                values: objMap(config.values, (value) => value),
            });
        }
        // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')
        if ((0, graphql_1.isInputObjectType)(type)) {
            const config = type.toConfig();
            return new graphql_1.GraphQLInputObjectType({
                ...config,
                fields: () => sortInputFields(config.fields),
            });
        }
        throw new Error("Unexpected type: " + (0, util_1.inspect)(type));
    }
}
function objMap(map, valueFn) {
    const result = Object.create(null);
    const entries = Object.entries(map);
    for (const [key, value] of entries) {
        result[key] = valueFn(value);
    }
    return result;
}
function sortByName(array) {
    return sortBy(array, (obj) => obj.name);
}
function sortBy(array, mapToKey) {
    return array.slice().sort((obj1, obj2) => {
        const key1 = mapToKey(obj1);
        const key2 = mapToKey(obj2);
        return naturalCompare(key1, key2);
    });
}
// This function a direct copy of the MIT licensed implementation in graphql-js:
// https://github.com/graphql/graphql-js/blob/30b446938a9b5afeb25c642d8af1ea33f6c849f3/src/jsutils/naturalCompare.ts
/**
 * Returns a number indicating whether a reference string comes before, or after,
 * or is the same as the given string in natural sort order.
 *
 * See: https://en.wikipedia.org/wiki/Natural_sort_order
 *
 */
function naturalCompare(aStr, bStr) {
    let aIndex = 0;
    let bIndex = 0;
    while (aIndex < aStr.length && bIndex < bStr.length) {
        let aChar = aStr.charCodeAt(aIndex);
        let bChar = bStr.charCodeAt(bIndex);
        if (isDigit(aChar) && isDigit(bChar)) {
            let aNum = 0;
            do {
                ++aIndex;
                aNum = aNum * 10 + aChar - DIGIT_0;
                aChar = aStr.charCodeAt(aIndex);
            } while (isDigit(aChar) && aNum > 0);
            let bNum = 0;
            do {
                ++bIndex;
                bNum = bNum * 10 + bChar - DIGIT_0;
                bChar = bStr.charCodeAt(bIndex);
            } while (isDigit(bChar) && bNum > 0);
            if (aNum < bNum) {
                return -1;
            }
            if (aNum > bNum) {
                return 1;
            }
        }
        else {
            if (aChar < bChar) {
                return -1;
            }
            if (aChar > bChar) {
                return 1;
            }
            ++aIndex;
            ++bIndex;
        }
    }
    return aStr.length - bStr.length;
}
const DIGIT_0 = 48;
const DIGIT_9 = 57;
function isDigit(code) {
    return !isNaN(code) && DIGIT_0 <= code && code <= DIGIT_9;
}
/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * and a function to produce the values from each item in the array.
 *
 * ```
 * const phoneBook = [
 *   { name: 'Jon', num: '555-1234' },
 *   { name: 'Jenny', num: '867-5309' }
 * ]
 *
 * // { Jon: '555-1234', Jenny: '867-5309' }
 * const phonesByName = keyValMap(
 *   phoneBook,
 *   entry => entry.name,
 *   entry => entry.num
 * )
 * ```
 *
 */
function keyValMap(list, keyFn, valFn) {
    return list.reduce((map, item) => {
        map[keyFn(item)] = valFn(item);
        return map;
    }, Object.create(null));
}
//# sourceMappingURL=consistentlyOrderedSchema.js.map