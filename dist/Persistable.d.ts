import IPersistable from './IPersistable';
export default class Persistable implements IPersistable {
    jsoncUnserialize(data: Object): void;
    jsoncSerialize(): this;
}
