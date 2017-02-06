"use strict";
var fs_1 = require("fs");
var minify = require("pg-minify");
var kitchenSinkSchemaSql = new Promise(function (resolve, reject) {
    fs_1.readFile('examples/kitchen-sink/schema.sql', function (error, data) {
        if (error)
            reject(error);
        else
            resolve(minify(data.toString().replace(/begin;|commit;/g, '')));
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = kitchenSinkSchemaSql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2l0Y2hlblNpbmtTY2hlbWFTcWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvX190ZXN0c19fL2ZpeHR1cmVzL2tpdGNoZW5TaW5rU2NoZW1hU3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5QkFBNkI7QUFDN0Isa0NBQW9DO0FBRXBDLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxPQUFPLENBQVMsVUFBQyxPQUFPLEVBQUUsTUFBTTtJQUMvRCxhQUFRLENBQUMsa0NBQWtDLEVBQUUsVUFBQyxLQUFLLEVBQUUsSUFBSTtRQUN2RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDeEIsSUFBSTtZQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDdEUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQTs7QUFFRixrQkFBZSxvQkFBb0IsQ0FBQSJ9