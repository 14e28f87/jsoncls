export interface IJsonclsPersistable {
    jsonclsUnserialize: (data: any) => void;
    jsonclsSerialize: () => any;
}
