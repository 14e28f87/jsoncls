
import IPersistable from './IPersistable';

export default class Persistable implements IPersistable {

	public jsoncUnserialize(data: Object){
		for(let [k, v] of Object.entries(data) ){
			(this as any)[k] = v;
		}
	}

	public jsoncSerialize(){
		return this;
	}

}

