import { IJsonclsPersistable } from './IJsonclsPersistable';
export declare class JsonclsPersistable implements IJsonclsPersistable {
    jsonclsUnserialize(data: Object): void;
    jsonclsSerialize(): this;
}
