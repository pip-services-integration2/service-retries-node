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
exports.RetryProcessor = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
class RetryProcessor {
    constructor() {
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._timer = new pip_services3_commons_nodex_1.FixedRateTimer();
        this._correlationId = "Integration.Retries";
        this._interval = 300000;
    }
    configure(config) {
        this._logger.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._controller = references.getOneRequired(new pip_services3_commons_nodex_1.Descriptor("service-retries", "controller", "default", "*", "1.0"));
    }
    open(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.setDelay(this._interval);
            this._timer.setInterval(this._interval);
            this._timer.setTask({
                notify: (correlationId, args) => {
                    this._deleteExpiredRetries();
                }
            });
            this._timer.start();
        });
    }
    close(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.stop();
        });
    }
    isOpen() {
        return this._timer != null && this._timer.isStarted();
    }
    _deleteExpiredRetries() {
        return __awaiter(this, void 0, void 0, function* () {
            this._timer.stop();
            this._logger.info(this._correlationId, "Deleting expired retries...");
            yield this._controller.deleteExpiredRetries(this._correlationId);
            this._logger.info(this._correlationId, "Expired retries deleted.");
            this._timer.start();
        });
    }
}
exports.RetryProcessor = RetryProcessor;
//# sourceMappingURL=RetriesProcessor.js.map