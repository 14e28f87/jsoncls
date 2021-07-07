
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

	test('decode', ()=>{

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



		let data = jsonc.decode({
			'type': 'classA',
			'child': {
				'type': 'classB',
			},
		});
		//console.log(data);
		expect( data.name ).toBe('this is ClassA');
		expect( data.child.name ).toBe('this is ClassB');

	});



	test('encode', ()=>{

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

		let jsoncData = jsonc.encode(data);

		expect( jsoncData.type ).toBe('classA');
		expect( jsoncData.name ).toBe('this is ClassA');
		expect( jsoncData.child.type ).toBe('classB');
		expect( jsoncData.child.name ).toBe('this is ClassB');

	});


});

