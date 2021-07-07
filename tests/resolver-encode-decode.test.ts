
import { Jsonhc, JsonhcPersistable } from '../src/index';

import * as _ from 'lodash-es';

class ClassA {
	public name = 'this is ClassA';
}

class ClassB extends JsonhcPersistable {
	public name = 'this is ClassB';
}


describe('jsonhc', ()=>{

	test('decode', ()=>{

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



		let data = jsonhc.decode({
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

		let jsonhcData = jsonhc.encode(data);

		expect( jsonhcData.type ).toBe('classA');
		expect( jsonhcData.name ).toBe('this is ClassA');
		expect( jsonhcData.child.type ).toBe('classB');
		expect( jsonhcData.child.name ).toBe('this is ClassB');

	});


});

