"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonhcPersistable = void 0;
class JsonhcPersistable {
    jsonhcUnserialize(data) {
        for (let [k, v] of Object.entries(data)) {
            this[k] = v;
        }
    }
    jsonhcSerialize() {
        return this;
    }
}
exports.JsonhcPersistable = JsonhcPersistable;
