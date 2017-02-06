"use strict";
function setupServerSentEvents(req, res, options) {
    var _emitter = options._emitter;
    // Making sure these options are set.
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);
    // Set headers for Server-Sent Events.
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    var sse = function (str) {
        res.write(str);
        // support running within the compression middleware.
        // https://github.com/expressjs/compression#server-sent-events
        if (res.flushHeaders)
            res.flushHeaders();
    };
    // Notify client that connection is open.
    sse('event: open\n\n');
    // Setup listeners.
    var schemaChangedCb = function () { return sse('event: changed\ndata: schema\n\n'); };
    if (options.watchPg)
        _emitter.on('schemas:changed', schemaChangedCb);
    // Clean up when connection closes.
    req.on('close', function () {
        res.end();
        _emitter.removeListener('schemas:changed', schemaChangedCb);
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupServerSentEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXBTZXJ2ZXJTZW50RXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Bvc3RncmFwaHFsL2h0dHAvc2V0dXBTZXJ2ZXJTZW50RXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQkFBK0MsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPO0lBQ3RELElBQUEsMkJBQVEsQ0FBWTtJQUU1QixxQ0FBcUM7SUFDckMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDM0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFN0Isc0NBQXNDO0lBQ3RDLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2pCLGNBQWMsRUFBRSxtQkFBbUI7UUFDbkMsZUFBZSxFQUFFLFVBQVU7UUFDM0IsWUFBWSxFQUFFLFlBQVk7S0FDM0IsQ0FBQyxDQUFBO0lBRUYsSUFBTSxHQUFHLEdBQUcsVUFBQSxHQUFHO1FBQ2IsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUVkLHFEQUFxRDtRQUNyRCw4REFBOEQ7UUFDOUQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztZQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtJQUMxQyxDQUFDLENBQUE7SUFFRCx5Q0FBeUM7SUFDekMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFFdEIsbUJBQW1CO0lBQ25CLElBQU0sZUFBZSxHQUFHLGNBQU0sT0FBQSxHQUFHLENBQUMsa0NBQWtDLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQTtJQUVyRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQ2xCLFFBQVEsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxDQUFDLENBQUE7SUFFakQsbUNBQW1DO0lBQ25DLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFO1FBQ2QsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBQ1QsUUFBUSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQTtJQUM3RCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7O0FBckNELHdDQXFDQyJ9