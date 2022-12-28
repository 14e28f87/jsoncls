import * as _ from 'lodash-es';
export class XjsonPersistable {
    static xjsonUnserialize(data) {
        delete (data.type); // 'type' プロパティは復元しない
        const self = new this();
        _.merge(self, data);
        return self;
    }
    xjsonSerialize() {
        return this;
    }
}
