
import { Jsonhc, JsonhcPersistable } from '../src/index';

class ClassA extends JsonhcPersistable {
	public name = 'this is ClassA';
}

class ClassB extends JsonhcPersistable {
	public name = 'this is ClassB';
}


describe('jsonhc', ()=>{

	test('decode', ()=>{

		let jsonhc = new Jsonhc({
			'classA' : ClassA,
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
			'classA' : ClassA,
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

