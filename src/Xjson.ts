
import * as _ from 'lodash-es';

import { IXjsonPersistable } from './IXjsonPersistable';


type TResolver = {
	test? : any;
	serialize? : (v:any)=> any;
	unserialize? : (v:any)=> any;
};

type TClassmap = {
//	[_:string] : IPersistable | TResolver;
	[_:string] : any;
}


export class Xjson {

	public classmap : TClassmap = {};

	public key : string = 'type';		// 'type' or '$'

	/**
	 * コンストラクタ
	 *
	 *	@oaram		マップするクラスのリスト
	 *
	 */
	public constructor(classmap : TClassmap = {}){

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
	public reviver = (key:null|string, value:any)=>{
		// console.log("   reviver - %o %o ", key, value );

		if( _.isObject(value) ){

			if( ! _.isUndefined((value as any)[ this.key ]) ){
				const id : string = (value as any)[ this.key ];

				let row = this.classmap[ id ];
				if( row ){

					if( Xjson.isResolver(row) ){
						// Resolver Object
						const resolver = row as TResolver;

							 // match
						if( _.isFunction( resolver.unserialize ) ){

							let newVars;
							newVars = resolver.unserialize( value );
						//	delete( newVars[ this.key ] );

							value = newVars;

						}else{
							throw new Error("Undefined parse function on class mapping '" + id + "'. ");
						}


					}else{
						// IPersistable Class
					//	const persistable = row as IPersistable;
						const persistable = row as any;

						let newVars;
						newVars = new persistable();
						if(_.isFunction(newVars.xjsonUnserialize) ){
							delete( (value as any)[ this.key ] );
							newVars.xjsonUnserialize(value);
						}else{

						}
					//	delete( newVars[ this.key ] );

						value = newVars;
					}

				}else{

					throw new Error("Undefined class mapping '" + id + "'. ");

				}

			}

		}

		return value;
	}




	/**
	 * replacer
	 *
	 *	JSON.stringify() の replacer として使用できます
	 *
	 *
	 *
	 */
	public replacer = (key:null|string, value:any)=>{
		// console.log("   replacer - %o %o ", key, value );

		if(_.isObject(value) && ! _.isPlainObject(value) &&  ! _.isArray(value) &&  ! _.isRegExp(value) ){

			let flag = false;
			for(const [id, row] of Object.entries(this.classmap) ){

				if( Xjson.isResolver(row) ){
					// Resolver Object
					const resolver = row as TResolver;

					if( ( Xjson.isClass(resolver.test) && value instanceof resolver.test ) 
					 || ( _.isFunction(resolver.test) && resolver.test(value) ) ){
						 // match
						if( _.isFunction( resolver.serialize ) ){
							let newVars;
							newVars = resolver.serialize( value );
							newVars[ this.key ] = id;
							value = newVars;
							flag = true;
							break; 
						}else{
							let newVars : any;
							newVars = Object.assign({}, value);		// convert to plain object
							newVars[ this.key ] = id;
							value = newVars;
							flag = true;
							break;
						}
					}

				}else{
					// IPersistable Class
					//const persistable = row as IPersistable;
					const persistable = row as any;

					if( value instanceof persistable ){

						//if( value instanceof persistable ){
						if( _.isFunction((value as any).xjsonSerialize) ){
							let newVars;
							newVars = (value as any).xjsonSerialize();
							newVars[ this.key ] = id;
							value = newVars;
						}
						flag = true;
						break;

					}
				}

			}

			if(!flag){
				const classname = value.constructor.name;
				console.error("Undefined class mapping %o %o", key, value);
				//throw new Error("Undefined class mapping '" + classname + "'. ");
			}

		}

		return value;
	}



	/**
	 *  JSON 文字列 を JsonCls形式の変数 へ変換します
	 *
	 *	非推奨  
	 *
	 *	@param	value	JSON文字列
	 *	@return			JsonCls形式の変数
	 */
	public parse = (value:string)=>{
		return JSON.parse(value, this.reviver);
	}

	/**
	 *  JsonCls形式の変数 を JSON 文字列 へ変換します
	 *
	 *	非推奨  
	 *
	 *	@param	value	JsonCls形式の変数
	 *	@return			JSON文字列
	 */
	public stringify = (value:any)=>{
		return JSON.stringify(value, this.replacer);
	}

	/**
	 *  JavaScriptのプレーンな変数からJsonCls形式の変数へデコードする
	 *
	 *	@param	value	JavaScriptのプレーンな変数
	 *	@return			JsonCls形式の変数
	 */
	public decode = (value:any)=>{

		return this._decode(null, value, this.reviver);

	}

	private _decode = (key:null|string, value:any, reviver: (key:null|string, value:any)=>any )=>{

		value = _.clone(value);

		if( _.isObject(value) ){	// Array or Object
			for(const [k, v] of Object.entries(value) ){
				(value as any)[k] = this._decode(k, v, reviver);
			}
		}

		value = reviver(key, value);

		return value;

	}

	/**
	 * JsonCls形式の変数を JavaScriptのプレーンな変数にエンコードする
	 *
	 *	@param	value	JsonCls形式の変数
	 *	@return			JavaScriptのプレーンな変数
	 */
	public encode = (value : any)=>{

		return this._encode(null, value, this.replacer);

	}

	private _encode = (key:any, value:any, replacer: (key:any, value:any)=>any)=>{

		value = _.clone(value);

		value = replacer(key, value);

		if( _.isObject(value) ){	// Array or Object
			for(const [k, v] of Object.entries(value) ){
				(value as any)[k] = this._encode(k, v, replacer);
			}
		}

		return value;

	}


	/**
	 * TResolver 形式か調べる
	 *
	 *	@param	c	調べる対象の値
	 *	@return		TResolver であれば true を返し、そうでなければ false を返します。
	 */
	static isResolver(c:any){
		return  _.isPlainObject(c) && ( _.isFunction(c.test) ||  _.isFunction(c.serialize) ||  _.isFunction(c.unserialize) );
	}


	/**
	 * Class か調べる
	 *
	 *	@param	c	調べる対象の値
	 *	@return		Class であれば true を返し、そうでなければ false を返します。
	 */
	static isClass(c:any){
		if(typeof(c) === 'function' && c.prototype){
			try{
				c.arguments && c.caller;
			}catch(e) {
				return true;
			}
		}
		return false;
	}



}

