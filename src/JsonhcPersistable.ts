
import { IJsonhcPersistable } from './IJsonhcPersistable';

export class JsonhcPersistable implements IJsonhcPersistable {

	public jsonhcUnserialize(data: Object){
		for(let [k, v] of Object.entries(data) ){
			(this as any)[k] = v;
		}
	}

	public jsonhcSerialize(){
		return this;
	}

}

