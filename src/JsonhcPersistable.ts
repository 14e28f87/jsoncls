
import * as _ from 'lodash-es';

import { IJsonhcPersistable } from './IJsonhcPersistable';

export class JsonhcPersistable implements IJsonhcPersistable {

	public jsonhcUnserialize(data: Object){
		_.merge(this, data);
	}

	public jsonhcSerialize(){
		return this;
	}

}

