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
exports.RetriesMongoDbPersistence = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_mongodb_nodex_1 = require("pip-services3-mongodb-nodex");
class RetriesMongoDbPersistence extends pip_services3_mongodb_nodex_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('retries');
        super.ensureIndex({ customer_id: 1 });
    }
    getGroupNames(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = yield this._collection.aggregate([
                {
                    "$group": { _id: "$group", count: { $sum: 1 } }
                }
            ]).toArray();
            let items = [];
            for (let item of results)
                items.push(item._id);
            return items;
        });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let criteria = [];
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });
        // Filter ids
        let ids = filter.getAsObject('ids');
        if (typeof ids == 'string')
            ids = ids.split(',');
        if (Array.isArray(ids))
            criteria.push({ _id: { $in: ids } });
        let group = filter.getAsNullableString('group');
        if (group != null)
            criteria.push({ group: group });
        let attemptCount = filter.getAsNullableString('attempt_count');
        if (attemptCount != null)
            criteria.push({ attempt_count: attemptCount });
        let lastAttemptTime = filter.getAsNullableBoolean('last_attempt_time');
        if (lastAttemptTime != null)
            criteria.push({ last_attempt_time: lastAttemptTime });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, null, null);
        });
    }
    getByIds(correlationId, group, ids) {
        const _super = Object.create(null, {
            getListByFilter: { get: () => super.getListByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let filter = [];
            filter.push({ group: group });
            filter.push({ _id: { $in: ids } });
            let items = yield _super.getListByFilter.call(this, correlationId, { $and: filter }, null, null);
            return items.length > 0 ? items : null;
        });
    }
    getById(correlationId, group, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = [];
            filter.push({ group: group });
            filter.push({ _id: id });
            let item = yield this._collection.findOne({ $and: filter });
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with id = %s", group, id);
            else
                this._logger.trace(correlationId, "Retrieved from %s with id = %s", group, id);
            item = this.convertToPublic(item);
            return item;
        });
    }
    delete(correlationId, group, id) {
        const _super = Object.create(null, {
            deleteByFilter: { get: () => super.deleteByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let filter = [];
            filter.push({ group: group });
            filter.push({ _id: id });
            return yield _super.deleteByFilter.call(this, correlationId, { $and: filter });
        });
    }
    deleteExpired(correlationId) {
        const _super = Object.create(null, {
            deleteByFilter: { get: () => super.deleteByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            let filter = { expiration_time: { $lte: now } };
            return yield _super.deleteByFilter.call(this, correlationId, filter);
        });
    }
}
exports.RetriesMongoDbPersistence = RetriesMongoDbPersistence;
//# sourceMappingURL=RetriesMongoDbPersistence.js.map