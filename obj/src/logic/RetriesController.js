"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetriesController = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const RetriesCommandSet_1 = require("./RetriesCommandSet");
class RetriesController {
    constructor() {
        this.component = "Integration.RetriesController";
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._counters = new pip_services3_components_nodex_1.CompositeCounters();
        this._tracer = new pip_services3_components_nodex_1.CompositeTracer();
        this._dependencyResolver = new pip_services3_commons_nodex_2.DependencyResolver(RetriesController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        return this._commandSet || (this._commandSet = new RetriesCommandSet_1.RetriesCommandSet(this));
    }
    instrument(correlationId, methodName) {
        this._logger.trace(correlationId, "Executed %s.%s %s", this.component, methodName);
        this._counters.incrementOne(this.component + "." + methodName + ".call_count");
        let counterTiming = this._counters.beginTiming(this.component + "." + methodName + ".exec_time");
        let traceTiming = this._tracer.beginTrace(correlationId, this.component + "." + methodName, null);
        return new pip_services3_rpc_nodex_1.InstrumentTiming(correlationId, this.component + "." + methodName, "call", this._logger, this._counters, counterTiming, traceTiming);
    }
    getGroupNames(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, "getGroupNames");
            try {
                return yield this._persistence.getGroupNames(correlationId);
            }
            catch (err) {
                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "getGroupNames");
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    createRetries(group, ids, timeToLive) {
        let now = new Date();
        let expirationTime = new Date(Date.now() + timeToLive);
        let result = [];
        for (let _id of ids) {
            let retry = {
                id: _id,
                group: group,
                last_attempt_time: now,
                expiration_time: expirationTime,
                attempt_count: 1
            };
            result.push(retry);
        }
        return result;
    }
    addRetries(correlationId, group, ids, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, "addRetries");
            let result = [];
            if (group == null || ids == null || ids.length == 0)
                return result;
            let retries;
            retries = this.createRetries(group, ids, timeToLive);
            let index = retries.length - 1;
            try {
                do {
                    let retry = retries[index--];
                    let item = yield this._persistence.getById(correlationId, retry.group, retry.id);
                    if (item != null) {
                        retry.attempt_count = ++item.attempt_count;
                        retry.last_attempt_time = new Date();
                        let updatedItem = yield this._persistence.update(correlationId, retry);
                        result.push(updatedItem);
                    }
                    else {
                        let item = yield this._persistence.create(correlationId, retry);
                        result.push(item);
                    }
                    return result;
                } while (index >= 0);
            }
            catch (ex) {
                timing.endFailure(ex);
                this._logger.error(correlationId, ex, "Failed to execute %s.%s", this.component, "addRetries");
                throw ex;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    addRetry(correlationId, group, id, timeToLive) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, "addRetries");
            let result = null;
            if (group == null || id == null) {
                return result;
            }
            let retry;
            try {
                retry = this.createRetries(group, [id], timeToLive)[0];
                let item = yield this._persistence.getById(correlationId, retry.group, retry.id);
                if (item != null) {
                    retry.attempt_count = ++item.attempt_count;
                    retry.last_attempt_time = new Date();
                    result = yield this._persistence.update(correlationId, retry);
                }
                else {
                    result = yield this._persistence.create(correlationId, retry);
                }
                return result;
            }
            catch (ex) {
                this._logger.error(correlationId, ex, "Failed to execute %s.%s", this.component, "addRetries");
                timing.endFailure(ex);
                throw ex;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    getRetries(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, 'getRetries');
            try {
                return yield this._persistence.getPageByFilter(correlationId, filter, paging);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    getRetryById(correlationId, group, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, "getRetryById");
            try {
                return yield this._persistence.getById(correlationId, group, id);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    getRetryByIds(correlationId, group, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, "getRetryByIds");
            try {
                return yield this._persistence.getByIds(correlationId, group, ids);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    deleteRetry(correlationId, group, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, "deleteRetry");
            try {
                return yield this._persistence.delete(correlationId, group, id);
            }
            catch (err) {
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
    deleteExpiredRetries(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(correlationId, "deleteExpiredRetriess");
            try {
                return yield this._persistence.deleteExpired(correlationId);
            }
            catch (err) {
                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "deleteExpiredRetriess");
                timing.endFailure(err);
                throw err;
            }
            finally {
                timing.endTiming();
            }
        });
    }
}
exports.RetriesController = RetriesController;
RetriesController._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('dependencies.persistence', 'service-retries:persistence:*:*:1.0');
//# sourceMappingURL=RetriesController.js.map