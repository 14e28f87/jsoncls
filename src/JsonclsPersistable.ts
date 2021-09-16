
import * as _ from 'lodash-es';

import { IJsonclsPersistable } from './IJsonclsPersistable';

export class JsonclsPersistable implements IJsonclsPersistable {

	public jsonclsUnserialize(data: Object){
		_.merge(this, data);
	}

	public jsonclsSerialize(){
		return this;
	}

}

