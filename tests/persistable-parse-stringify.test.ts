
import { Xjson, XjsonPersistable } from '../dist/index.js';

class ClassA extends XjsonPersistable {
	public name = 'this is ClassA';
}

class ClassB extends XjsonPersistable {
	public name = 'this is ClassB';
}


describe('xjson', ()=>{

	test('parse', ()=>{

		let xjson = new Xjson({
			'classA' : ClassA,
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
			'classA' : ClassA,
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

