"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Persistable = /** @class */ (function () {
    function Persistable() {
    }
    Persistable.prototype.jsonhcUnserialize = function (data) {
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], v = _b[1];
            this[k] = v;
        }
    };
    Persistable.prototype.jsonhcSerialize = function () {
        return this;
    };
    return Persistable;
}());
exports.default = Persistable;
