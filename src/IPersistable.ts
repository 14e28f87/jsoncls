
export default interface IPersistable {

	jsoncUnserialize : (data: any)=>void;
	jsoncSerialize : ()=>any;

}
