"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.Xjson = void 0;
const _ = __importStar(require("lodash-es"));
class Xjson {
    /**
     * コンストラクタ
     *
     *	@oaram		マップするクラスのリスト
     *
     */
    constructor(classmap = {}) {
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
        this.reviver = (key, value) => {
            // console.log("   reviver - %o %o ", key, value );
            if (_.isObject(value)) {
                if (!_.isUndefined(value[this.key])) {
                    const id = value[this.key];
                    let row = this.classmap[id];
                    if (row) {
                        if (Xjson.isResolver(row)) {
                            // Resolver Object
                            const resolver = row;
                            // match
                            if (_.isFunction(resolver.unserialize)) {
                                let newVars;
                                newVars = resolver.unserialize(value);
                                //	delete( newVars[ this.key ] );
                                value = newVars;
                            }
                            else {
                                throw new Error("Undefined parse function on class mapping '" + id + "'. ");
                            }
                        }
                        else {
                            // IPersistable Class
                            //	const persistable = row as IPersistable;
                            const persistable = row;
                            let newVars;
                            if (_.isFunction(persistable.xjsonUnserialize)) {
                                newVars = persistable.xjsonUnserialize(value);
                            }
                            else {
                            }
                            //	delete( newVars[ this.key ] );
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
        this.replacer = (key, value) => {
            // console.log("   replacer - %o %o ", key, value );
            if (_.isObject(value) && !_.isPlainObject(value) && !_.isArray(value) && !_.isRegExp(value)) {
                let flag = false;
                for (const [id, row] of Object.entries(this.classmap)) {
                    if (Xjson.isResolver(row)) {
                        // Resolver Object
                        const resolver = row;
                        if ((Xjson.isClass(resolver.test) && value instanceof resolver.test)
                            || (_.isFunction(resolver.test) && resolver.test(value))) {
                            // match
                            if (_.isFunction(resolver.serialize)) {
                                let newVars;
                                newVars = resolver.serialize(value);
                                newVars[this.key] = id;
                                value = newVars;
                                flag = true;
                                break;
                            }
                            else {
                                let newVars;
                                newVars = Object.assign({}, value); // convert to plain object
                                newVars[this.key] = id;
                                value = newVars;
                                flag = true;
                                break;
                            }
                        }
                    }
                    else {
                        // IPersistable Class
                        //const persistable = row as IPersistable;
                        const persistable = row;
                        if (value instanceof persistable) {
                            //if( value instanceof persistable ){
                            if (_.isFunction(value.xjsonSerialize)) {
                                let newVars;
                                newVars = value.xjsonSerialize();
                                newVars[this.key] = id;
                                value = newVars;
                            }
                            flag = true;
                            break;
                        }
                    }
                }
                if (!flag) {
                    const classname = value.constructor.name;
                    console.error("Undefined class mapping %o %o", key, value);
                    //throw new Error("Undefined class mapping '" + classname + "'. ");
                }
            }
            return value;
        };
        /**
         *  JSON 文字列 を JsonCls形式の変数 へ変換します
         *
         *	非推奨
         *
         *	@param	value	JSON文字列
         *	@return			JsonCls形式の変数
         */
        this.parse = (value) => {
            return JSON.parse(value, this.reviver);
        };
        /**
         *  JsonCls形式の変数 を JSON 文字列 へ変換します
         *
         *	非推奨
         *
         *	@param	value	JsonCls形式の変数
         *	@return			JSON文字列
         */
        this.stringify = (value) => {
            return JSON.stringify(value, this.replacer);
        };
        /**
         *  JavaScriptのプレーンな変数からJsonCls形式の変数へデコードする
         *
         *	@param	value	JavaScriptのプレーンな変数
         *	@return			JsonCls形式の変数
         */
        this.decode = (value) => {
            return this._decode(null, value, this.reviver);
        };
        this._decode = (key, value, reviver) => {
            value = _.clone(value);
            if (_.isObject(value)) { // Array or Object
                for (const [k, v] of Object.entries(value)) {
                    value[k] = this._decode(k, v, reviver);
                }
            }
            value = reviver(key, value);
            return value;
        };
        /**
         * JsonCls形式の変数を JavaScriptのプレーンな変数にエンコードする
         *
         *	@param	value	JsonCls形式の変数
         *	@return			JavaScriptのプレーンな変数
         */
        this.encode = (value) => {
            return this._encode(null, value, this.replacer);
        };
        this._encode = (key, value, replacer) => {
            value = _.clone(value);
            value = replacer(key, value);
            if (_.isObject(value)) { // Array or Object
                for (const [k, v] of Object.entries(value)) {
                    value[k] = this._encode(k, v, replacer);
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
    static isResolver(c) {
        return _.isPlainObject(c) && (_.isFunction(c.test) || _.isFunction(c.serialize) || _.isFunction(c.unserialize));
    }
    /**
     * Class か調べる
     *
     *	@param	c	調べる対象の値
     *	@return		Class であれば true を返し、そうでなければ false を返します。
     */
    static isClass(c) {
        if (typeof (c) === 'function' && c.prototype) {
            try {
                c.arguments && c.caller;
            }
            catch (e) {
                return true;
            }
        }
        return false;
    }
}
exports.Xjson = Xjson;
