"use strict";
/**
 * A singleton string type that represents a string value. Simply, a string can
 * be defined as an array of characters.
 */
var jsonType = {
    kind: 'SCALAR',
    name: 'json',
    description: 'A JavaScript object encoded in the JSON format as specified by ' +
        '[ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
    isTypeOf: function (_value) { return true; },
    fromInput: function (value) { return value; },
    intoOutput: function (value) { return value; },
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = jsonType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvblR5cGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvaW50ZXJmYWNlL3R5cGUvc2NhbGFyL2pzb25UeXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQTs7O0dBR0c7QUFDSCxJQUFNLFFBQVEsR0FBc0I7SUFDbEMsSUFBSSxFQUFFLFFBQVE7SUFDZCxJQUFJLEVBQUUsTUFBTTtJQUNaLFdBQVcsRUFDVCxpRUFBaUU7UUFDakUsd0ZBQXdGO0lBRTFGLFFBQVEsRUFBRSxVQUFDLE1BQWEsSUFBc0IsT0FBQSxJQUFJLEVBQUosQ0FBSTtJQUVsRCxTQUFTLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEVBQUwsQ0FBSztJQUN6QixVQUFVLEVBQUUsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLEVBQUwsQ0FBSztDQUMzQixDQUFBOztBQUVELGtCQUFlLFFBQVEsQ0FBQSJ9