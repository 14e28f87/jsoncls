
import * as _ from 'lodash-es';

import { IXjsonPersistable } from './IXjsonPersistable';

export class XjsonPersistable implements IXjsonPersistable {

	static xjsonUnserialize(data: { [_:string]:any } ){
	
		delete( data.type );		// 'type' プロパティは復元しない
		
		const self = new this();
		_.merge(self, data);
		return self;
	}

	public xjsonSerialize(){
		return this;
	}

}

