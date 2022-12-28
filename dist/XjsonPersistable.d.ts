import { IXjsonPersistable } from './IXjsonPersistable';
export declare class XjsonPersistable implements IXjsonPersistable {
    static xjsonUnserialize(data: {
        [_: string]: any;
    }): XjsonPersistable;
    xjsonSerialize(): this;
}
