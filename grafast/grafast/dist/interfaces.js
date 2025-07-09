"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$deepDepSkip = exports.FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS = exports.DEFAULT_FORBIDDEN_FLAGS = exports.TRAPPABLE_FLAGS = exports.DEFAULT_ACCEPT_FLAGS = exports.ALL_FLAGS = exports.FLAG_STOPPED = exports.FLAG_POLY_SKIPPED = exports.FLAG_INHIBITED = exports.FLAG_NULL = exports.FLAG_ERROR = exports.NO_FLAGS = exports.$$ts = exports.$$timeout = exports.$$subroutine = exports.$$safeError = exports.$$proxy = exports.$$streamMore = exports.$$eventEmitter = exports.$$idempotent = exports.$$concreteType = exports.$$extensions = exports.$$data = exports.$$bypassGraphQL = exports.$$verbatim = exports.$$id = exports.$$planResults = exports.$$grafastContext = exports.$$hooked = exports.$$cacheByOperation = exports.$$queryCache = void 0;
const tslib_1 = require("tslib");
exports.$$queryCache = Symbol("queryCache");
/**
 * We store the cache directly onto the GraphQLSchema so that it gets garbage
 * collected along with the schema when it's not needed any more. To do so, we
 * attach it using this symbol.
 */
exports.$$cacheByOperation = Symbol("cacheByOperation");
exports.$$hooked = Symbol("hookArgsApplied");
exports.$$grafastContext = Symbol("context");
exports.$$planResults = Symbol("planResults");
exports.$$id = Symbol("id");
/** Return the value verbatim, don't execute */
exports.$$verbatim = Symbol("verbatim");
/**
 * If we're sure the data is the right shape and valid, we can set this key and
 * it can be returned directly
 */
exports.$$bypassGraphQL = Symbol("bypassGraphQL");
exports.$$data = Symbol("data");
/**
 * For attaching additional metadata to the GraphQL execution result, for
 * example details of the plan or SQL queries or similar that were executed.
 */
exports.$$extensions = Symbol("extensions");
/**
 * The "GraphQLObjectType" type name, useful when dealing with polymorphism.
 */
exports.$$concreteType = Symbol("concreteType");
/**
 * Set this key on a type if that type's serialization is idempotent (that is
 * to say `serialize(serialize(thing)) === serialize(thing)`). This means we
 * don't have to "roll-back" serialization if we need to fallback to graphql-js
 * execution.
 */
exports.$$idempotent = Symbol("idempotent");
/**
 * The event emitter used for outputting execution events.
 */
exports.$$eventEmitter = Symbol("executionEventEmitter");
/**
 * Used to indicate that an array has more results available via a stream.
 */
exports.$$streamMore = Symbol("streamMore");
exports.$$proxy = Symbol("proxy");
/**
 * If an error has this property set then it's safe to send through to the user
 * without being masked.
 */
exports.$$safeError = Symbol("safeError");
/** The layerPlan used as a subroutine for this step */
exports.$$subroutine = Symbol("subroutine");
/** For tracking the timeout a TimeoutError happened from */
exports.$$timeout = Symbol("timeout");
/** For tracking _when_ the timeout happened (because once the JIT has warmed it might not need so long) */
exports.$$ts = Symbol("timestamp");
function flag(f) {
    return f;
}
exports.NO_FLAGS = flag(0);
exports.FLAG_ERROR = flag(1 << 0);
exports.FLAG_NULL = flag(1 << 1);
exports.FLAG_INHIBITED = flag(1 << 2);
exports.FLAG_POLY_SKIPPED = flag(1 << 3);
exports.FLAG_STOPPED = flag(1 << 4);
exports.ALL_FLAGS = flag(exports.FLAG_ERROR | exports.FLAG_NULL | exports.FLAG_INHIBITED | exports.FLAG_POLY_SKIPPED | exports.FLAG_STOPPED);
/** By default, accept null values as an input */
exports.DEFAULT_ACCEPT_FLAGS = flag(exports.FLAG_NULL);
exports.TRAPPABLE_FLAGS = flag(exports.FLAG_ERROR | exports.FLAG_NULL | exports.FLAG_INHIBITED);
exports.DEFAULT_FORBIDDEN_FLAGS = flag(exports.ALL_FLAGS & ~exports.DEFAULT_ACCEPT_FLAGS);
exports.FORBIDDEN_BY_NULLABLE_BOUNDARY_FLAGS = flag(exports.FLAG_NULL | exports.FLAG_POLY_SKIPPED);
tslib_1.__exportStar(require("./planJSONInterfaces.js"), exports);
/**
 * @internal
 */
exports.$$deepDepSkip = Symbol("deepDepSkip_experimental");
//# sourceMappingURL=interfaces.js.map