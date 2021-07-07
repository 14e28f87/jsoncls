"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonhcPersistable = void 0;
var JsonhcPersistable = /** @class */ (function () {
    function JsonhcPersistable() {
    }
    JsonhcPersistable.prototype.jsonhcUnserialize = function (data) {
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], v = _b[1];
            this[k] = v;
        }
    };
    JsonhcPersistable.prototype.jsonhcSerialize = function () {
        return this;
    };
    return JsonhcPersistable;
}());
exports.JsonhcPersistable = JsonhcPersistable;
