"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPolymorphicData = isPolymorphicData;
exports.assertPolymorphicData = assertPolymorphicData;
exports.polymorphicWrap = polymorphicWrap;
exports.resolveType = resolveType;
const inspect_js_1 = require("./inspect.js");
const interfaces_js_1 = require("./interfaces.js");
function isPolymorphicData(data) {
    if (typeof data !== "object" || data === null) {
        return false;
    }
    if (typeof data[interfaces_js_1.$$concreteType] !== "string") {
        return false;
    }
    return true;
}
function assertPolymorphicData(data) {
    if (!isPolymorphicData(data)) {
        throw new Error(`Expected a polymorphic object, received ${(0, inspect_js_1.inspect)(data)}`);
    }
}
// const EMPTY_OBJECT = Object.freeze(Object.create(null));
/**
 * Returns an object with the given concrete type (and, optionally, associated
 * data)
 */
function polymorphicWrap(type, 
// TODO: when we stop mutating `data` we can replace this with `EMPTY_OBJECT`
data = Object.create(null)) {
    // ENHANCE: validate type further, e.g. that it's a valid object type
    if (typeof type !== "string") {
        throw new Error(`Expected a GraphQLObjectType name, but received ${(0, inspect_js_1.inspect)(type)}`);
    }
    if (data == null) {
        throw new Error(`polymorphicWrap mustn't receive null-like data`);
    }
    Object.defineProperty(data, interfaces_js_1.$$concreteType, {
        value: type,
        enumerable: false,
        writable: false,
        configurable: false,
    });
    // TODO: should NOT mutate `data`, instead use a wrapper object and rewire
    // through the pipeline.
    return data;
    /*
    return Object.assign(Object.create(null), {
      [$$concreteType]: type,
      [$$data]: data,
    });
    */
}
/**
 * All polymorphic objects in Grafast have a $$concreteType property which
 * contains the GraphQL object's type name; we simply return that.
 */
function resolveType(o) {
    assertPolymorphicData(o);
    return o[interfaces_js_1.$$concreteType];
}
/* TODO: we should be extracting data from a subproperty when we rewrite how polymorphism works.
/* *
 * All polymorphic objects in Grafast have a $$concreteType property which
 * contains the GraphQL object's type name; we simply return that.
 * /
export function resolveData(o: unknown): string {
  assertPolymorphicData(o);
  return o[$$data];
}
*/
//# sourceMappingURL=polymorphic.js.map