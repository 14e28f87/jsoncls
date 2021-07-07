
import { Jsonhc, JsonhcPersistable } from '../src/index';

import * as _ from 'lodash-es';

class ClassA {
	public name = 'this is ClassA';
}

class ClassB extends JsonhcPersistable {
	public name = 'this is ClassB';
}


describe('jsonhc', ()=>{

	test('parse', ()=>{

		let jsonhc = new Jsonhc({
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

		let data = JSON.parse(str, jsonhc.reviver);

		expect( data.name ).toBe('this is ClassA');
		expect( data.child.name ).toBe('this is ClassB');

	});



	test('stringify', ()=>{

		let jsonhc = new Jsonhc({
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

		let jsonhcStr = JSON.stringify(data, jsonhc.replacer);

		let jsonhcData = JSON.parse(jsonhcStr);
		expect( jsonhcData.type ).toBe('classA');
		expect( jsonhcData.name ).toBe('this is ClassA');
		expect( jsonhcData.child.type ).toBe('classB');
		expect( jsonhcData.child.name ).toBe('this is ClassB');

	});


});

