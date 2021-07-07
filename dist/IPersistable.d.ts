export default interface IPersistable {
    jsonhcUnserialize: (data: any) => void;
    jsonhcSerialize: () => any;
}
