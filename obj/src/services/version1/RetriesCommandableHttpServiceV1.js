"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetriesCommandableHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class RetriesCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/retries');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-retries', 'controller', 'default', '*', '1.0'));
    }
}
exports.RetriesCommandableHttpServiceV1 = RetriesCommandableHttpServiceV1;
//# sourceMappingURL=RetriesCommandableHttpServiceV1.js.map