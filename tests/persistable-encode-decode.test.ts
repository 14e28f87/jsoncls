
import { Xjson, XjsonPersistable } from '../dist/index.js';

class ClassA extends XjsonPersistable {
	public name = 'this is ClassA';
}

class ClassB extends XjsonPersistable {
	public name = 'this is ClassB';
}


describe('xjson', ()=>{

	test('decode', ()=>{

		let xjson = new Xjson({
			'classA' : ClassA,
			'classB' : ClassB,
		});

		let data = xjson.decode({
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

		let xjson = new Xjson({
			'classA' : ClassA,
			'classB' : ClassB,
		});

		let data: any;
		data = new ClassA();
		(data as any).child = new ClassB();

		let xjsonData = xjson.encode(data);

		expect( xjsonData.type ).toBe('classA');
		expect( xjsonData.name ).toBe('this is ClassA');
		expect( xjsonData.child.type ).toBe('classB');
		expect( xjsonData.child.name ).toBe('this is ClassB');

	});


});

