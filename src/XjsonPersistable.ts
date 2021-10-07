
import * as _ from 'lodash-es';

import { IXjsonPersistable } from './IXjsonPersistable';

export class XjsonPersistable implements IXjsonPersistable {

	public xjsonUnserialize(data: Object){
		_.merge(this, data);
	}

	public xjsonSerialize(){
		return this;
	}

}

