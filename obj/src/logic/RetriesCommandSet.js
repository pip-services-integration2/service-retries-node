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
exports.RetriesCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_7 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_8 = require("pip-services3-commons-nodex");
class RetriesCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetGroupNamesCommand());
        this.addCommand(this.makeGetRetriesCommand());
        this.addCommand(this.makeAddRetryCommand());
        this.addCommand(this.makeAddRetriesCommand());
        this.addCommand(this.makeGetRetryByIdCommand());
        this.addCommand(this.makeGetRetryByIdsCommand());
        this.addCommand(this.makeDeleteRetryCommand());
        this.addCommand(this.makeDeleteExpiredRetryCommand());
    }
    makeGetGroupNamesCommand() {
        return new pip_services3_commons_nodex_2.Command("get_group_names", new pip_services3_commons_nodex_5.ObjectSchema(true), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._logic.getGroupNames(correlationId);
        }));
    }
    makeGetRetriesCommand() {
        return new pip_services3_commons_nodex_2.Command("get_retries", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_nodex_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_nodex_8.PagingParamsSchema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services3_commons_nodex_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_nodex_4.PagingParams.fromValue(args.get("paging"));
            return yield this._logic.getRetries(correlationId, filter, paging);
        }));
    }
    makeAddRetryCommand() {
        return new pip_services3_commons_nodex_2.Command("add_retry", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("id", pip_services3_commons_nodex_6.TypeCode.String)
            .withOptionalProperty("ttl", pip_services3_commons_nodex_6.TypeCode.Long), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let group = args.getAsString("group");
            let id = args.getAsString("id");
            let ttl = args.getAsNullableLong("ttl");
            return yield this._logic.addRetry(correlationId, group, id, ttl);
        }));
    }
    makeAddRetriesCommand() {
        return new pip_services3_commons_nodex_2.Command("add_retries", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("ids", pip_services3_commons_nodex_6.TypeCode.Array)
            .withOptionalProperty("ttl", pip_services3_commons_nodex_6.TypeCode.Long), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let group = args.getAsString("group");
            let ids = pip_services3_commons_nodex_1.StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
            let ttl = args.getAsNullableLong("ttl");
            return yield this._logic.addRetries(correlationId, group, ids, ttl);
        }));
    }
    makeGetRetryByIdCommand() {
        return new pip_services3_commons_nodex_2.Command("get_retry_by_id", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("id", pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let group = args.getAsString("group");
            let id = args.getAsString("id");
            return yield this._logic.getRetryById(correlationId, group, id);
        }));
    }
    makeGetRetryByIdsCommand() {
        return new pip_services3_commons_nodex_2.Command("get_retry_by_ids", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("ids", pip_services3_commons_nodex_6.TypeCode.Array), // TODO: Check type
        (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let group = args.getAsString("group");
            let ids = pip_services3_commons_nodex_1.StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
            return yield this._logic.getRetryByIds(correlationId, group, ids);
        }));
    }
    makeDeleteRetryCommand() {
        return new pip_services3_commons_nodex_2.Command("delete_retry", new pip_services3_commons_nodex_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_nodex_6.TypeCode.String)
            .withRequiredProperty("id", pip_services3_commons_nodex_6.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let group = args.getAsString("group");
            let id = args.getAsString("id");
            return yield this._logic.deleteRetry(correlationId, group, id);
        }));
    }
    makeDeleteExpiredRetryCommand() {
        return new pip_services3_commons_nodex_2.Command("delete_expired", new pip_services3_commons_nodex_5.ObjectSchema(true), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            return yield this._logic.deleteExpiredRetries(correlationId);
        }));
    }
}
exports.RetriesCommandSet = RetriesCommandSet;
//# sourceMappingURL=RetriesCommandSet.js.map