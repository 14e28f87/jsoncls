import * as _ from 'lodash-es';
export class Xjson {
    classmap = {};
    key = 'type'; // 'type' or '$'
    /**
     * コンストラクタ
     *
     *	@oaram		マップするクラスのリスト
     *
     */
    constructor(classmap = {}) {
        this.classmap = classmap;
    }
    /**
     * reviver
     *
     *	JSON.parse() の reviver として使用できます
     *
     *
     *
     */
    reviver = (key, value) => {
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
    replacer = (key, value) => {
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
    parse = (value) => {
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
    stringify = (value) => {
        return JSON.stringify(value, this.replacer);
    };
    /**
     *  JavaScriptのプレーンな変数からJsonCls形式の変数へデコードする
     *
     *	@param	value	JavaScriptのプレーンな変数
     *	@return			JsonCls形式の変数
     */
    decode = (value) => {
        return this._decode(null, value, this.reviver);
    };
    _decode = (key, value, reviver) => {
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
    encode = (value) => {
        return this._encode(null, value, this.replacer);
    };
    _encode = (key, value, replacer) => {
        value = _.clone(value);
        value = replacer(key, value);
        if (_.isObject(value)) { // Array or Object
            for (const [k, v] of Object.entries(value)) {
                value[k] = this._encode(k, v, replacer);
            }
        }
        return value;
    };
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
