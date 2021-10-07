
import { Xjson, XjsonPersistable } from '../dist/index.js';

import * as _ from 'lodash-es';

class ClassA {
	public name = 'this is ClassA';
}

class ClassB extends XjsonPersistable {
	public name = 'this is ClassB';
}


describe('xjson', ()=>{

	test('parse', ()=>{

		let xjson = new Xjson({
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



		let str = JSON.stringify({
			'type': 'classA',
			'child': {
				'type': 'classB',
			},
		});

		let data = JSON.parse(str, xjson.reviver);

		expect( data.name ).toBe('this is ClassA');
		expect( data.child.name ).toBe('this is ClassB');

	});



	test('stringify', ()=>{

		let xjson = new Xjson({
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

		let xjsonStr = JSON.stringify(data, xjson.replacer);

		let xjsonData = JSON.parse(xjsonStr);
		expect( xjsonData.type ).toBe('classA');
		expect( xjsonData.name ).toBe('this is ClassA');
		expect( xjsonData.child.type ).toBe('classB');
		expect( xjsonData.child.name ).toBe('this is ClassB');

	});


});

