"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetryV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class RetryV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('group', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('attempt_count', pip_services3_commons_nodex_2.TypeCode.Long);
        this.withOptionalProperty('last_attempt_time', pip_services3_commons_nodex_2.TypeCode.DateTime);
        this.withOptionalProperty('expiration_time', pip_services3_commons_nodex_2.TypeCode.DateTime);
    }
}
exports.RetryV1Schema = RetryV1Schema;
//# sourceMappingURL=RetryV1Schema.js.map