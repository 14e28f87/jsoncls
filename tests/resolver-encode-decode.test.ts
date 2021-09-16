
import { Jsoncls, JsonclsPersistable } from '../dist/index.js';

import * as _ from 'lodash-es';

class ClassA {
	public name = 'this is ClassA';
}

class ClassB extends JsonclsPersistable {
	public name = 'this is ClassB';
}


describe('jsoncls', ()=>{

	test('decode', ()=>{

		let jsoncls = new Jsoncls({
			'classA' : {
				test: (c:any)=>{ return c instanceof ClassA },
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



		let data = jsoncls.decode({
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

		let jsoncls = new Jsoncls({
			'classA' : {
				test: (c:any)=>{ return c instanceof ClassA },
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

		let jsonclsData = jsoncls.encode(data);

		expect( jsonclsData.type ).toBe('classA');
		expect( jsonclsData.name ).toBe('this is ClassA');
		expect( jsonclsData.child.type ).toBe('classB');
		expect( jsonclsData.child.name ).toBe('this is ClassB');

	});


});

