
import { Jsonhc, JsonhcPersistable } from '../src/index';

class ClassA extends JsonhcPersistable {
	public name = 'this is ClassA';
}

class ClassB extends JsonhcPersistable {
	public name = 'this is ClassB';
}


describe('jsonhc', ()=>{

	test('parse', ()=>{

		let jsonhc = new Jsonhc({
			'classA' : ClassA,
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
			'classA' : ClassA,
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

