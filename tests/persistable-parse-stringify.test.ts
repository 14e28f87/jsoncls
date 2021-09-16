
import { Jsoncls, JsonclsPersistable } from '../dist/index.js';

class ClassA extends JsonclsPersistable {
	public name = 'this is ClassA';
}

class ClassB extends JsonclsPersistable {
	public name = 'this is ClassB';
}


describe('jsoncls', ()=>{

	test('parse', ()=>{

		let jsoncls = new Jsoncls({
			'classA' : ClassA,
			'classB' : ClassB,
		});

		let str = JSON.stringify({
			'type': 'classA',
			'child': {
				'type': 'classB',
			},
		});

		let data = JSON.parse(str, jsoncls.reviver);

		expect( data.name ).toBe('this is ClassA');
		expect( data.child.name ).toBe('this is ClassB');

	});



	test('stringify', ()=>{

		let jsoncls = new Jsoncls({
			'classA' : ClassA,
			'classB' : ClassB,
		});

		let data: any;
		data = new ClassA();
		(data as any).child = new ClassB();

		let jsonclsStr = JSON.stringify(data, jsoncls.replacer);

		let jsonclsData = JSON.parse(jsonclsStr);
		expect( jsonclsData.type ).toBe('classA');
		expect( jsonclsData.name ).toBe('this is ClassA');
		expect( jsonclsData.child.type ).toBe('classB');
		expect( jsonclsData.child.name ).toBe('this is ClassB');

	});


});

