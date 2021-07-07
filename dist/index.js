"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash-es"));
var jsonhc = /** @class */ (function () {
    /**
     * コンストラクタ
     *
     *	@oaram		マップするクラスのリスト
     *
     */
    function jsonhc(classmap) {
        var _this = this;
        if (classmap === void 0) { classmap = {}; }
        this.classmap = {};
        this.key = 'type'; // 'type' or '$'
        /**
         * reviver
         *
         *	JSON.parse() の reviver として使用できます
         *
         *
         *
         */
        this.reviver = function (key, value) {
            // console.log("   reviver - %o %o ", key, value );
            if (_.isObject(value)) {
                if (!_.isUndefined(value[_this.key])) {
                    var id = value[_this.key];
                    var row = _this.classmap[id];
                    if (row) {
                        if (jsonhc.isResolver(row)) {
                            // Resolver Object
                            var resolver = row;
                            // match
                            if (_.isFunction(resolver.unserialize)) {
                                var newVars = void 0;
                                newVars = resolver.unserialize(value);
                                delete (newVars[_this.key]);
                                value = newVars;
                            }
                            else {
                                throw new Error("Undefined parse function on class mapping '" + id + "'. ");
                            }
                        }
                        else {
                            // IPersistable Class
                            //	const persistable = row as IPersistable;
                            var persistable = row;
                            var newVars = void 0;
                            newVars = new persistable();
                            if (_.isFunction(newVars.jsonhcUnserialize)) {
                                newVars.jsonhcUnserialize(value);
                            }
                            else {
                            }
                            delete (newVars[_this.key]);
                            value = newVars;
                        }
                    }
                    else {
                        throw new Error("Undefined class mapping '" + id + "'. ");
                    }
                }
            }
            return value;
        };
        /**
         * replacer
         *
         *	JSON.stringify() の replacer として使用できます
         *
         *
         *
         */
        this.replacer = function (key, value) {
            // console.log("   replacer - %o %o ", key, value );
            if (_.isObject(value) && !_.isPlainObject(value) && !_.isArray(value) && !_.isRegExp(value)) {
                var flag = false;
                for (var _i = 0, _a = Object.entries(_this.classmap); _i < _a.length; _i++) {
                    var _b = _a[_i], id = _b[0], row = _b[1];
                    if (jsonhc.isResolver(row)) {
                        // Resolver Object
                        var resolver = row;
                        if ((_.isFunction(resolver.test) && resolver.test(value))
                            || (value instanceof resolver.test)) {
                            // match
                            if (_.isFunction(resolver.serialize)) {
                                var newVars = void 0;
                                newVars = resolver.serialize(value);
                                newVars[_this.key] = id;
                                value = newVars;
                                flag = true;
                                break;
                            }
                            else {
                                var newVars = void 0;
                                newVars = Object.assign({}, value); // convert to plain object
                                newVars[_this.key] = id;
                                value = newVars;
                                flag = true;
                                break;
                            }
                        }
                    }
                    else {
                        // IPersistable Class
                        //const persistable = row as IPersistable;
                        var persistable = row;
                        if (value instanceof persistable) {
                            //if( value instanceof persistable ){
                            if (_.isFunction(value.jsonhcSerialize)) {
                                var newVars = void 0;
                                newVars = value.jsonhcSerialize();
                                newVars[_this.key] = id;
                                value = newVars;
                            }
                            flag = true;
                            break;
                        }
                    }
                }
                if (!flag) {
                    var classname = value.constructor.name;
                    console.error("Undefined class mapping %o %o", key, value);
                    //throw new Error("Undefined class mapping '" + classname + "'. ");
                }
            }
            return value;
        };
        /**
         *  JSON 文字列 を JSONC形式の変数 へ変換します
         *
         *	非推奨
         *
         *	@param	value	JSON文字列
         *	@return			JSONC形式の変数
         */
        this.parse = function (value) {
            return JSON.parse(value, _this.reviver);
        };
        /**
         *  JSONC形式の変数 を JSON 文字列 へ変換します
         *
         *	非推奨
         *
         *	@param	value	JSONC形式の変数
         *	@return			JSON文字列
         */
        this.stringify = function (value) {
            return JSON.stringify(value, _this.replacer);
        };
        /**
         *  JavaScriptのプレーンな変数からJSONC形式の変数へデコードする
         *
         *	@param	value	JavaScriptのプレーンな変数
         *	@return			JSONC形式の変数
         */
        this.decode = function (value) {
            return _this._decode(null, value, _this.reviver);
        };
        this._decode = function (key, value, reviver) {
            value = _.clone(value);
            if (_.isObject(value)) { // Array or Object
                for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
                    var _b = _a[_i], k = _b[0], v = _b[1];
                    value[k] = _this._decode(k, v, reviver);
                }
            }
            value = reviver(key, value);
            return value;
        };
        /**
         * JSONC形式の変数を JavaScriptのプレーンな変数にエンコードする
         *
         *	@param	value	JSONC形式の変数
         *	@return			JavaScriptのプレーンな変数
         */
        this.encode = function (value) {
            return _this._encode(null, value, _this.replacer);
        };
        this._encode = function (key, value, replacer) {
            value = _.clone(value);
            value = replacer(key, value);
            if (_.isObject(value)) { // Array or Object
                for (var _i = 0, _a = Object.entries(value); _i < _a.length; _i++) {
                    var _b = _a[_i], k = _b[0], v = _b[1];
                    value[k] = _this._encode(k, v, replacer);
                }
            }
            return value;
        };
        this.classmap = classmap;
    }
    /**
     * TResolver 形式か調べる
     *
     *	@param	c	調べる対象の値
     *	@return		TResolver であれば true を返し、そうでなければ false を返します。
     */
    jsonhc.isResolver = function (c) {
        return _.isPlainObject(c) && (_.isFunction(c.test) || _.isFunction(c.serialize) || _.isFunction(c.unserialize));
    };
    return jsonhc;
}());
exports.default = jsonhc;
