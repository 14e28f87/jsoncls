
import Jsonc from '../src/index';
//import { applyMixins } from '../src/applyMixins';

import Jsonc_Persistable from '../src/Persistable';


import * as _ from 'lodash-es';

class ClassA {
	public name = 'this is ClassA';
}

class ClassB extends Jsonc_Persistable {
	public name = 'this is ClassB';
}


describe('Jsonc', ()=>{

	test('parse', ()=>{

		let jsonc = new Jsonc({
			'classA' : {
				test: ClassA,
				serialize: (data:any)=>{
					return _.toPlainObject(data);
				},
				unserialize: (data:any)=>{
					let obj = new ClassA();
					for(let [k, v] of Object.entries(data) ){
						(obj as any)[k] = v;
					}
					return obj;
				},
			},
			'classB' : ClassB,
		});



		let str = JSON.stringify({
			'type': 'classA',
			'child': {
				'type': 'classB',
			},
		});

		let data = JSON.parse(str, jsonc.reviver);

		expect( data.name ).toBe('this is ClassA');
		expect( data.child.name ).toBe('this is ClassB');

	});



	test('stringify', ()=>{

		let jsonc = new Jsonc({
			'classA' : {
				test: ClassA,
				serialize: (data:any)=>{
					return _.toPlainObject(data);
				},
				unserialize: (data:any)=>{
					let obj = new ClassA();
					for(let [k, v] of Object.entries(data) ){
						(obj as any)[k] = v;
					}
					return obj;
				},
			},
			'classB' : ClassB,
		});

		let data: any;
		data = new ClassA();
		(data as any).child = new ClassB();

		let jsoncStr = JSON.stringify(data, jsonc.replacer);

		let jsoncData = JSON.parse(jsoncStr);
		expect( jsoncData.type ).toBe('classA');
		expect( jsoncData.name ).toBe('this is ClassA');
		expect( jsoncData.child.type ).toBe('classB');
		expect( jsoncData.child.name ).toBe('this is ClassB');

	});


});

