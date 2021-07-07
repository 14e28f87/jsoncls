
export interface IJsonhcPersistable {

	jsonhcUnserialize : (data: any)=>void;
	jsonhcSerialize : ()=>any;

}
