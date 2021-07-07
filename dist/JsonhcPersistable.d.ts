import { IJsonhcPersistable } from './IJsonhcPersistable';
export declare class JsonhcPersistable implements IJsonhcPersistable {
    jsonhcUnserialize(data: Object): void;
    jsonhcSerialize(): this;
}
