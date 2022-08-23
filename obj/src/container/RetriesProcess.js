"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetriesProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const build_1 = require("../build");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
class RetriesProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("retries", "Retries microservice");
        this._factories.add(new build_1.RetriesServiceFactory);
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory);
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory);
    }
}
exports.RetriesProcess = RetriesProcess;
//# sourceMappingURL=RetriesProcess.js.map