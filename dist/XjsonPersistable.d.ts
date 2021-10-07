import { IXjsonPersistable } from './IXjsonPersistable';
export declare class XjsonPersistable implements IXjsonPersistable {
    xjsonUnserialize(data: Object): void;
    xjsonSerialize(): this;
}
