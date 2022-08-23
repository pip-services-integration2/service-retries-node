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
exports.RetriesMemoryPersistence = void 0;
let _ = require('lodash');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
class RetriesMemoryPersistence extends pip_services3_data_nodex_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    getByIds(correlationId, group, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = (item) => ids.indexOf(item.id) >= 0 && item.group == group;
            return yield this.getListByFilter(correlationId, filter, null, null);
        });
    }
    getById(correlationId, group, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = this._items.filter(x => x.group == group && x.id == id);
            let item = items.length > 0 ? items[0] : null;
            if (item)
                this._logger.trace(correlationId, "Found retry with id %s", id);
            else
                this._logger.trace(correlationId, "Cannot find retry with id %s", id);
            return item;
        });
    }
    getPageByFilter(correlationId, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, correlationId, this.composeFilter(filter), paging, null, null);
        });
    }
    getGroupNames(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = new Array();
            for (let retry of this._items) {
                if (result.indexOf(retry.group) < 0)
                    result.push(retry.group);
            }
            return result;
        });
    }
    delete(correlationId, group, id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = this._items.length - 1; index >= 0; index--) {
                let mapping = this._items[index];
                if (mapping.group == group && mapping.id == id) {
                    this._items.splice(index, 1);
                    break;
                }
            }
        });
    }
    deleteExpired(correlationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let now = new Date();
            for (let index = this._items.length - 1; index >= 0; index--) {
                if (this._items[index].expiration_time <= now) {
                    this._items.splice(index, 1);
                }
            }
        });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_nodex_1.FilterParams();
        let id = filter.getAsNullableString('id');
        let group = filter.getAsNullableString('group');
        let attempt_count = filter.getAsNullableString('attempt_count');
        let last_attempt_time = filter.getAsNullableBoolean('last_attempt_time');
        let ids = filter.getAsObject('ids');
        // Process ids filter
        if (typeof ids == 'string')
            ids = ids.split(',');
        if (!Array.isArray(ids))
            ids = null;
        return (item) => {
            if (id && item.id != id)
                return false;
            if (ids && ids.indexOf(item.id) < 0)
                return false;
            if (group && item.group != group)
                return false;
            if (attempt_count && item.customer_id != attempt_count)
                return false;
            if (last_attempt_time != null && item.saved != last_attempt_time)
                return false;
            return true;
        };
    }
}
exports.RetriesMemoryPersistence = RetriesMemoryPersistence;
//# sourceMappingURL=RetriesMemoryPersistence.js.map