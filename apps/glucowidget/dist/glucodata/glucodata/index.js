"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emit = emit;
exports.onData = onData;
var handlers = [];
function emit(data) {
    for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
        var handler = handlers_1[_i];
        try {
            handler(data);
        }
        catch (e) {
            console.error(e);
        }
    }
}
function onData(handler) {
    handlers.push(handler);
    return function () {
        // Cleanup function
        var index = handlers.indexOf(handler);
        if (index >= 0) {
            handlers.splice(index, 1);
        }
    };
}
