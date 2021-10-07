export interface IXjsonPersistable {
    xjsonUnserialize: (data: any) => void;
    xjsonSerialize: () => any;
}
