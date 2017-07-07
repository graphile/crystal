"use strict";
var pgStringType_1 = require("../scalar/pgStringType");
var PgAliasType_1 = require("../PgAliasType");
var pgBigIntType = new PgAliasType_1.default({
    name: 'big_int',
    description: 'A signed eight-byte integer. The upper big integer values are greater then ' +
        'the max value for a JavaScript number. Therefore all big integers will be ' +
        'output as strings and not numbers.',
    baseType: pgStringType_1.default,
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = pgBigIntType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGdCaWdJbnRUeXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3Bvc3RncmVzL2ludmVudG9yeS90eXBlL2N1c3RvbS9wZ0JpZ0ludFR5cGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVEQUFpRDtBQUNqRCw4Q0FBd0M7QUFFeEMsSUFBTSxZQUFZLEdBQUcsSUFBSSxxQkFBVyxDQUFDO0lBQ25DLElBQUksRUFBRSxTQUFTO0lBQ2YsV0FBVyxFQUNULDZFQUE2RTtRQUM3RSw0RUFBNEU7UUFDNUUsb0NBQW9DO0lBQ3RDLFFBQVEsRUFBRSxzQkFBWTtDQUN2QixDQUFDLENBQUE7O0FBRUYsa0JBQWUsWUFBWSxDQUFBIn0=