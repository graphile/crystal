"use strict";
var _this = this;
var tslib_1 = require("tslib");
var setupServerSentEvents_1 = require("../setupServerSentEvents");
var http = require('http');
var EventEmitter = require('events'); // tslint:disable-line:variable-name
var request = require('supertest');
var _emitter = new EventEmitter();
var connectionPromiseResolve;
var connectionPromise;
beforeEach(function () {
    connectionPromise = new Promise(function (resolve) { connectionPromiseResolve = resolve; });
});
var requestHandler = function (req, res, next) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var options;
    return tslib_1.__generator(this, function (_a) {
        options = { _emitter: _emitter, watchPg: true };
        connectionPromiseResolve(req);
        setupServerSentEvents_1.default(req, res, options);
        return [2 /*return*/];
    });
}); };
var createServer = function () { return http.createServer(requestHandler); };
test('will set the appropriate headers', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var server;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server = createServer();
                connectionPromise.then(function (connection) {
                    setTimeout(function () { return connection.emit('close'); }, 5);
                });
                return [4 /*yield*/, (request(server)
                        .get('/')
                        .set('Accept', 'text/event-stream')
                        .expect(200)
                        .expect('Content-Type', 'text/event-stream')
                        .expect('Cache-Control', 'no-cache')
                        .expect('Connection', 'keep-alive')
                        .expect('Transfer-Encoding', 'chunked'))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('will receive an initial event', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var server;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server = createServer();
                connectionPromise.then(function (connection) {
                    setTimeout(function () { return connection.emit('close'); }, 5);
                });
                return [4 /*yield*/, (request(server)
                        .get('/')
                        .set('Accept', 'text/event-stream')
                        .expect('event: open\n\n'))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('will send event if schema changes', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var server;
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                server = createServer();
                connectionPromise.then(function (connection) {
                    setTimeout(function () { return _emitter.emit('schemas:changed'); }, 5);
                    setTimeout(function () { return connection.emit('close'); }, 10);
                });
                return [4 /*yield*/, (request(server)
                        .get('/')
                        .set('Accept', 'text/event-stream')
                        .expect('event: open\n\nevent: changed\ndata: schema\n\n'))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBTZXJ2ZXJTZW50RXZlbnRzLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9zdGdyYXBocWwvaHR0cC9fX3Rlc3RzX18vc2V0dXBTZXJ2ZXJTZW50RXZlbnRzLXRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGlCQWtFQTs7QUFsRUEsa0VBQTREO0FBRTVELElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM1QixJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUEsQ0FBQyxvQ0FBb0M7QUFDM0UsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBRXBDLElBQU0sUUFBUSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUE7QUFFbkMsSUFBSSx3QkFBd0IsQ0FBQTtBQUM1QixJQUFJLGlCQUFpQixDQUFBO0FBRXJCLFVBQVUsQ0FBQztJQUNULGlCQUFpQixHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxJQUFPLHdCQUF3QixHQUFHLE9BQU8sQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RGLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBTSxjQUFjLEdBQUcsVUFBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7UUFDcEMsT0FBTzs7a0JBQUcsRUFBRSxRQUFRLFVBQUEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO1FBQzNDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzdCLCtCQUFxQixDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7OztLQUN6QyxDQUFBO0FBRUQsSUFBTSxZQUFZLEdBQUcsY0FBTSxPQUFBLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLEVBQWpDLENBQWlDLENBQUE7QUFFNUQsSUFBSSxDQUFDLGtDQUFrQyxFQUFFO1FBQ2pDLE1BQU07Ozs7eUJBQUcsWUFBWSxFQUFFO2dCQUM3QixpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBQSxVQUFVO29CQUMvQixVQUFVLENBQUMsY0FBTSxPQUFBLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQXhCLENBQXdCLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQy9DLENBQUMsQ0FBQyxDQUFBO2dCQUNGLHFCQUFNLENBQ0osT0FBTyxDQUFDLE1BQU0sQ0FBQzt5QkFDZCxHQUFHLENBQUMsR0FBRyxDQUFDO3lCQUNSLEdBQUcsQ0FBQyxRQUFRLEVBQUUsbUJBQW1CLENBQUM7eUJBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUM7eUJBQ1gsTUFBTSxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQzt5QkFDM0MsTUFBTSxDQUFDLGVBQWUsRUFBRSxVQUFVLENBQUM7eUJBQ25DLE1BQU0sQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO3lCQUNsQyxNQUFNLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLENBQ3hDLEVBQUE7O2dCQVRELFNBU0MsQ0FBQTs7OztLQUNGLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQywrQkFBK0IsRUFBRTtRQUM5QixNQUFNOzs7O3lCQUFHLFlBQVksRUFBRTtnQkFDN0IsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQUEsVUFBVTtvQkFDL0IsVUFBVSxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUF4QixDQUF3QixFQUFFLENBQUMsQ0FBQyxDQUFBO2dCQUMvQyxDQUFDLENBQUMsQ0FBQTtnQkFDRixxQkFBTSxDQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUM7eUJBQ2QsR0FBRyxDQUFDLEdBQUcsQ0FBQzt5QkFDUixHQUFHLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDO3lCQUNsQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FDM0IsRUFBQTs7Z0JBTEQsU0FLQyxDQUFBOzs7O0tBQ0YsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLG1DQUFtQyxFQUFFO1FBQ2xDLE1BQU07Ozs7eUJBQUcsWUFBWSxFQUFFO2dCQUM3QixpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBQSxVQUFVO29CQUMvQixVQUFVLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBaEMsQ0FBZ0MsRUFBRSxDQUFDLENBQUMsQ0FBQTtvQkFDckQsVUFBVSxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUF4QixDQUF3QixFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUNoRCxDQUFDLENBQUMsQ0FBQTtnQkFDRixxQkFBTSxDQUNKLE9BQU8sQ0FBQyxNQUFNLENBQUM7eUJBQ2QsR0FBRyxDQUFDLEdBQUcsQ0FBQzt5QkFDUixHQUFHLENBQUMsUUFBUSxFQUFFLG1CQUFtQixDQUFDO3lCQUNsQyxNQUFNLENBQUMsaURBQWlELENBQUMsQ0FDM0QsRUFBQTs7Z0JBTEQsU0FLQyxDQUFBOzs7O0tBQ0YsQ0FBQyxDQUFBIn0=