import * as _ from 'lodash-es';
export class XjsonPersistable {
    xjsonUnserialize(data) {
        _.merge(this, data);
    }
    xjsonSerialize() {
        return this;
    }
}
