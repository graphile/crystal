"use strict";
const fs_1 = require('fs');
const minify = require('pg-minify');
const kitchenSinkSchemaSql = new Promise((resolve, reject) => {
    fs_1.readFile('examples/kitchen-sink/schema.sql', (error, data) => {
        if (error)
            reject(error);
        else
            resolve(minify(data.toString().replace(/begin;|commit;/g, '')));
    });
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = kitchenSinkSchemaSql;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2l0Y2hlblNpbmtTY2hlbWFTcWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyZXMvX190ZXN0c19fL2ZpeHR1cmVzL2tpdGNoZW5TaW5rU2NoZW1hU3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxxQkFBeUIsSUFDekIsQ0FBQyxDQUQ0QjtBQUM3QixNQUFPLE1BQU0sV0FBVyxXQUFXLENBQUMsQ0FBQTtBQUVwQyxNQUFNLG9CQUFvQixHQUFHLElBQUksT0FBTyxDQUFTLENBQUMsT0FBTyxFQUFFLE1BQU07SUFDL0QsYUFBUSxDQUFDLGtDQUFrQyxFQUFFLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDdkQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLElBQUk7WUFBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ3RFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUE7QUFFRjtrQkFBZSxvQkFBb0IsQ0FBQSJ9