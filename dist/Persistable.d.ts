import IPersistable from './IPersistable';
export default class Persistable implements IPersistable {
    jsonhcUnserialize(data: Object): void;
    jsonhcSerialize(): this;
}
