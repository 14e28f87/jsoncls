declare type TClassmap = {
    [_: string]: any;
};
export declare class Xjson {
    classmap: TClassmap;
    key: string;
    /**
     * コンストラクタ
     *
     *	@oaram		マップするクラスのリスト
     *
     */
    constructor(classmap?: TClassmap);
    /**
     * reviver
     *
     *	JSON.parse() の reviver として使用できます
     *
     *
     *
     */
    reviver: (key: null | string, value: any) => any;
    /**
     * replacer
     *
     *	JSON.stringify() の replacer として使用できます
     *
     *
     *
     */
    replacer: (key: null | string, value: any) => any;
    /**
     *  JSON 文字列 を JsonCls形式の変数 へ変換します
     *
     *	非推奨
     *
     *	@param	value	JSON文字列
     *	@return			JsonCls形式の変数
     */
    parse: (value: string) => any;
    /**
     *  JsonCls形式の変数 を JSON 文字列 へ変換します
     *
     *	非推奨
     *
     *	@param	value	JsonCls形式の変数
     *	@return			JSON文字列
     */
    stringify: (value: any) => string;
    /**
     *  JavaScriptのプレーンな変数からJsonCls形式の変数へデコードする
     *
     *	@param	value	JavaScriptのプレーンな変数
     *	@return			JsonCls形式の変数
     */
    decode: (value: any) => any;
    private _decode;
    /**
     * JsonCls形式の変数を JavaScriptのプレーンな変数にエンコードする
     *
     *	@param	value	JsonCls形式の変数
     *	@return			JavaScriptのプレーンな変数
     */
    encode: (value: any) => any;
    private _encode;
    /**
     * TResolver 形式か調べる
     *
     *	@param	c	調べる対象の値
     *	@return		TResolver であれば true を返し、そうでなければ false を返します。
     */
    static isResolver(c: any): boolean;
    /**
     * Class か調べる
     *
     *	@param	c	調べる対象の値
     *	@return		Class であれば true を返し、そうでなければ false を返します。
     */
    static isClass(c: any): boolean;
}
export {};
