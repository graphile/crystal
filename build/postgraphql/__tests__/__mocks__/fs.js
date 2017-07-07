var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var fs = require.requireActual('fs');
// Mock the writeFile for the export tests
var writeFile = jest.fn(function (path, contents, callback) {
    callback();
});
module.exports = __assign({}, fs, { writeFile: writeFile });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvX190ZXN0c19fL19fbW9ja3NfXy9mcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFFdEMsMENBQTBDO0FBQzFDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVE7SUFDakQsUUFBUSxFQUFFLENBQUE7QUFDWixDQUFDLENBQUMsQ0FBQTtBQUVGLE1BQU0sQ0FBQyxPQUFPLGdCQUNULEVBQUUsSUFDTCxTQUFTLFdBQUEsR0FDVixDQUFBIn0=