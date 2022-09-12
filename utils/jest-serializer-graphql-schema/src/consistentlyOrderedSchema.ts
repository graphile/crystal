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

import type {
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfigMap,
  GraphQLNamedType,
  GraphQLType,
} from "graphql";
import {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLUnionType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isIntrospectionType,
  isListType,
  isNonNullType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "graphql";
import { inspect } from "util";

type Maybe<T> = null | undefined | T;

function isNotNullish<T>(v: T): v is T extends null | undefined ? never : T {
  return v != null;
}

/**
 * This function is heavily based on
 * {@link https://github.com/graphql/graphql-js/blob/0eb088b3d1228ac60568912c705401341f3b769d/src/utilities/lexicographicSortSchema.js | `lexicographicSortSchema` from `graphql`}
 * (MIT license), but differs in that it does not change the order of fields,
 * arguments or enum values.
 */
export function consistentlyOrderedSchema(
  schema: GraphQLSchema,
): GraphQLSchema {
  const schemaConfig = schema.toConfig();
  const typeMap = keyValMap(
    sortByName(schemaConfig.types),
    (type) => type.name,
    sortNamedType,
  );

  return new GraphQLSchema({
    ...schemaConfig,
    types: Object.values(typeMap).filter(isNotNullish),
    directives: sortByName(schemaConfig.directives).map(sortDirective),
    query: replaceMaybeType(schemaConfig.query),
    mutation: replaceMaybeType(schemaConfig.mutation),
    subscription: replaceMaybeType(schemaConfig.subscription),
  });

  function replaceType<T extends GraphQLType>(type: T): T {
    if (isListType(type)) {
      return new GraphQLList(replaceType(type.ofType)) as unknown as T;
    } else if (isNonNullType(type)) {
      return new GraphQLNonNull(replaceType(type.ofType)) as unknown as T;
    }
    return replaceNamedType<GraphQLNamedType>(type) as unknown as T;
  }

  function replaceNamedType<T extends GraphQLNamedType>(type: T): T {
    return typeMap[type.name] as T;
  }

  function replaceMaybeType<T extends GraphQLNamedType>(
    maybeType: Maybe<T>,
  ): Maybe<T> {
    return maybeType && replaceNamedType(maybeType);
  }

  function sortDirective(directive: GraphQLDirective) {
    const config = directive.toConfig();
    return new GraphQLDirective({
      ...config,
      locations: sortBy(config.locations, (x) => x),
      args: replaceArgs(config.args),
    });
  }

  function replaceArgs(args: GraphQLFieldConfigArgumentMap) {
    return objMap(args, (arg) => ({
      ...arg,
      type: replaceType(arg.type),
    }));
  }

  function sortFields(fieldsMap: GraphQLFieldConfigMap<unknown, unknown>) {
    return objMap(fieldsMap, (field) => ({
      ...field,
      type: replaceType(field.type),
      args: field.args && replaceArgs(field.args),
    }));
  }

  function sortInputFields(fieldsMap: GraphQLInputFieldConfigMap) {
    return objMap(fieldsMap, (field) => ({
      ...field,
      type: replaceType(field.type),
    }));
  }

  function sortTypes<T extends GraphQLNamedType>(
    array: ReadonlyArray<T>,
  ): Array<T> {
    return sortByName(array).map(replaceNamedType);
  }

  function sortNamedType(type: GraphQLNamedType): GraphQLNamedType {
    if (isScalarType(type) || isIntrospectionType(type)) {
      return type;
    }
    if (isObjectType(type)) {
      const config = type.toConfig();
      return new GraphQLObjectType({
        ...config,
        interfaces: () => sortTypes(config.interfaces),
        fields: () => sortFields(config.fields),
      });
    }
    if (isInterfaceType(type)) {
      const config = type.toConfig();
      return new GraphQLInterfaceType({
        ...config,
        interfaces: () => sortTypes(config.interfaces),
        fields: () => sortFields(config.fields),
      });
    }
    if (isUnionType(type)) {
      const config = type.toConfig();
      return new GraphQLUnionType({
        ...config,
        types: () => sortTypes(config.types),
      });
    }
    if (isEnumType(type)) {
      const config = type.toConfig();
      return new GraphQLEnumType({
        ...config,
        values: objMap(config.values, (value) => value),
      });
    }
    // istanbul ignore else (See: 'https://github.com/graphql/graphql-js/issues/2618')
    if (isInputObjectType(type)) {
      const config = type.toConfig();
      return new GraphQLInputObjectType({
        ...config,
        fields: () => sortInputFields(config.fields),
      });
    }

    throw new Error("Unexpected type: " + inspect(type));
  }
}

function objMap<T, R>(map: ObjMap<T>, valueFn: (value: T) => R): ObjMap<R> {
  const result = Object.create(null);
  const entries = Object.entries(map);
  for (const [key, value] of entries) {
    result[key] = valueFn(value);
  }
  return result;
}

function sortByName<T extends { readonly name: string }>(
  array: ReadonlyArray<T>,
): Array<T> {
  return sortBy(array, (obj) => obj.name);
}

function sortBy<T>(
  array: ReadonlyArray<T>,
  mapToKey: (item: T) => string,
): Array<T> {
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
export function naturalCompare(aStr: string, bStr: string): number {
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
    } else {
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

function isDigit(code: number): boolean {
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
function keyValMap<T, V>(
  list: ReadonlyArray<T>,
  keyFn: (item: T) => string,
  valFn: (item: T) => V,
): ObjMap<V> {
  return list.reduce((map, item) => {
    map[keyFn(item)] = valFn(item);
    return map;
  }, Object.create(null));
}

type ObjMap<T> = { [key: string]: T };
