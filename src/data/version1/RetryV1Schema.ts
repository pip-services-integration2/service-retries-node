import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';

export class RetryV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withOptionalProperty('group', TypeCode.String);
        this.withOptionalProperty('attempt_count', TypeCode.Long);
        this.withOptionalProperty('last_attempt_time', TypeCode.DateTime);
        this.withOptionalProperty('expiration_time', TypeCode.DateTime);
    }
}