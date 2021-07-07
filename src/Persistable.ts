
import IPersistable from './IPersistable';

export default class Persistable implements IPersistable {

	public jsonhcUnserialize(data: Object){
		for(let [k, v] of Object.entries(data) ){
			(this as any)[k] = v;
		}
	}

	public jsonhcSerialize(){
		return this;
	}

}

