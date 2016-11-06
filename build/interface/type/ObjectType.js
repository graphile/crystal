"use strict";
const NamedType_1 = require('./NamedType');
/**
 * An object type is made up of many different fields, and a field is composed of a
 * name and a type. This makes an object type a composite type as it is
 * composed of many different types.
 *
 * Any object value will *always* be a `Map`. This is to make object values
 * easy to construct and deconstruct. Originally the author had more choice on
 * how to construct the internal object value. This just led to pain and
 * confusion. Its much easier to agree on a protocol instead of passing around
 * arbitrary values.
 *
 * A relevant question is why use an ES6 `Map` though? Why not a plain
 * JavaScript object? The reason is that plain JavaScript objects really make
 * for inneficient maps. The argument is kind of comparable to structs vs.
 * key-value collections. We want a collection, not a struct. As we don’t know
 * the field names, *or* the field values at compile time, objects just become
 * a pain to work with. There are also a number of deoptimizations engines
 * apparently make when objects are interacted with as maps. If the [v8 “Strong
 * Mode” project][1] becomes a real thing, the use of objects as maps will
 * generate runtime errors. Another good resource are the [answers to the Stack
 * Overflow question “Maps vs Objects in ES6, When to use?”][2].
 *
 * [1]: https://github.com/v8/v8/wiki/Experiments%20with%20Strengthening%20JavaScript#strong-mode
 * [2]: http://stackoverflow.com/questions/32600157/maps-vs-objects-in-es6-when-to-use
 */
class ObjectType extends NamedType_1.default {
    constructor(config) {
        super(config);
        this.fields = config.fields;
    }
    /**
     * Checks that a value is a map that is the same size and has the same type
     * for every entry.
     */
    isTypeOf(value) {
        return (value instanceof Map &&
            Array.from(this.fields.entries()).every(([name, { type }]) => type.isTypeOf(value.get(name))));
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ObjectType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0VHlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9pbnRlcmZhY2UvdHlwZS9PYmplY3RUeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw0QkFBc0IsYUEyQnRCLENBQUMsQ0EzQmtDO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Qkc7QUFDSCx5QkFBeUIsbUJBQVM7SUFRaEMsWUFBYSxNQUlaO1FBQ0MsTUFBTSxNQUFNLENBQUMsQ0FBQTtRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQTtJQUM3QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksUUFBUSxDQUFFLEtBQVk7UUFDM0IsTUFBTSxDQUFDLENBQ0wsS0FBSyxZQUFZLEdBQUc7WUFDcEIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQzlGLENBQUE7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQTRDRDtrQkFBZSxVQUFVLENBQUEifQ==