import {
  GraphQLDirective,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLUnionType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isIntrospectionType,
  isObjectType,
  isScalarType,
  isUnionType,
} from "graphql";

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

  function replaceNamedType<T extends GraphQLNamedType>(type: T): T {
    return (typeMap[type.name] as any) as T;
  }

  function replaceMaybeType<T extends GraphQLNamedType>(maybeType: Maybe<T>) {
    return maybeType && replaceNamedType(maybeType);
  }

  function sortDirective(directive: GraphQLDirective) {
    const config = directive.toConfig();
    return new GraphQLDirective({
      ...config,
      locations: sortBy(config.locations, (x) => x),
      args: config.args, // DO NOT SORT
    });
  }

  function sortTypes<T extends GraphQLNamedType>(
    arr: ReadonlyArray<T>,
  ): Array<T> {
    return sortByName(arr).map(replaceNamedType);
  }

  function sortNamedType(type: GraphQLNamedType) {
    if (isScalarType(type) || isIntrospectionType(type)) {
      return type;
    } else if (isObjectType(type)) {
      const config = type.toConfig();
      return new GraphQLObjectType({
        ...config,
        interfaces: () => sortTypes(config.interfaces),
        fields: () => config.fields, // DO NOT SORT
      });
    } else if (isInterfaceType(type)) {
      const config = type.toConfig();
      return new GraphQLInterfaceType({
        ...config,
        fields: () => config.fields, // DO NOT SORT
      });
    } else if (isUnionType(type)) {
      const config = type.toConfig();
      return new GraphQLUnionType({
        ...config,
        types: () => sortTypes(config.types),
      });
    } else if (isEnumType(type)) {
      const config = type.toConfig();
      return new GraphQLEnumType({
        ...config,
        values: sortObjMap(config.values),
      });
    } else if (isInputObjectType(type)) {
      const config = type.toConfig();
      return new GraphQLInputObjectType({
        ...config,
        fields: () => config.fields, // DO NOT SORT
      });
    }
    // Not reachable. All possible types have been considered.
    invariant(false, "Unexpected type: " + String(type));
  }
}

function sortObjMap<T, R>(
  map: ObjMap<T>,
  sortValueFn?: (value: T) => R,
): ObjMap<R> {
  const sortedMap = Object.create(null);
  const sortedKeys = sortBy(Object.keys(map), (x) => x);
  for (const key of sortedKeys) {
    const value = map[key];
    sortedMap[key] = sortValueFn ? sortValueFn(value) : value;
  }
  return sortedMap;
}

function sortByName<T extends { name: string }>(
  array: ReadonlyArray<T>,
): Array<T> {
  return sortBy(array, (obj) => obj.name);
}

function sortBy<T>(
  array: ReadonlyArray<T>,
  mapToKey: (map: T) => string,
): Array<T> {
  return array.slice().sort((obj1, obj2) => {
    const key1 = mapToKey(obj1);
    const key2 = mapToKey(obj2);
    return key1.localeCompare(key2);
  });
}

/**
 * Creates a keyed JS object from an array, given a function to produce the keys
 * and a function to produce the values from each item in the array.
 *
 *     const phoneBook = [
 *       { name: 'Jon', num: '555-1234' },
 *       { name: 'Jenny', num: '867-5309' }
 *     ]
 *
 *     // { Jon: '555-1234', Jenny: '867-5309' }
 *     const phonesByName = keyValMap(
 *       phoneBook,
 *       entry => entry.name,
 *       entry => entry.num
 *     )
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

function invariant(
  condition: boolean,
  message: string,
): asserts condition is true {
  if (!condition) {
    throw new Error(message);
  }
}
