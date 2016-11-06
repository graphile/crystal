"use strict";
const NamedType_1 = require('./NamedType');
/**
 * An alias type is a very simple wrapper around a named type. The point of
 * an alias type is to just give a type another name. So for example if we want
 * a custom string type for emails we would create an alias type like:
 *
 * ```js
 * new AliasType('email', stringType)
 * ```
 *
 * The reason we only alias named types is that it is easier to work with in
 * services that don’t support type aliasing. Like in GraphQL which doesn’t
 * support aliasing unnamed types.
 */
class AliasType extends NamedType_1.default {
    constructor(config) {
        super(config);
        this.baseType = config.baseType;
    }
    /**
     * Proxies the `isTypeOf` check to the base type of this alias.
     */
    isTypeOf(value) {
        return this.baseType.isTypeOf(value);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AliasType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWxpYXNUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2ludGVyZmFjZS90eXBlL0FsaWFzVHlwZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsNEJBQXNCLGFBZXRCLENBQUMsQ0Fma0M7QUFFbkM7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsd0JBQWdDLG1CQUFTO0lBTXZDLFlBQWEsTUFJWjtRQUNDLE1BQU0sTUFBTSxDQUFDLENBQUE7UUFDYixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUE7SUFDakMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUSxDQUFFLEtBQVk7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3RDLENBQUM7QUFDSCxDQUFDO0FBRUQ7a0JBQWUsU0FBUyxDQUFBIn0=