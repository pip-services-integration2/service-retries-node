import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';

import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from './IRetriesPersistence';

export class RetriesMongoDbPersistence
    extends IdentifiableMongoDbPersistence<RetryV1, string>
    implements IRetriesPersistence {

    constructor() {
        super('retries');
        super.ensureIndex({ customer_id: 1 });
    }

    public async getGroupNames(correlationId: string): Promise<string[]> {
        let results = await this._collection.aggregate([
            {
                "$group": { _id: "$group", count: { $sum: 1 } }
            }
        ]).toArray();

        let items: Array<string> = [];
        for (let item of results)
            items.push(item._id);

        return items;
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();
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
        
    public async getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<RetryV1>> {
        return await super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null);
    }

    public async getByIds(correlationId: string, group: string, ids: string[]): Promise<RetryV1[]> {
        let filter = [];
        filter.push({ group: group });
        filter.push({ _id: { $in: ids } });

        let items = await super.getListByFilter(correlationId, { $and: filter }, null, null);

        return items.length > 0 ? items : null;
    }

    public async getById(correlationId: string, group: string, id: string): Promise<RetryV1> {
        let filter = [];
        filter.push({ group: group });
        filter.push({ _id: id });

        let item = await this._collection.findOne({ $and: filter });

        if (item == null)
            this._logger.trace(correlationId, "Nothing found from %s with id = %s", group, id);
        else
            this._logger.trace(correlationId, "Retrieved from %s with id = %s", group, id);

        item = this.convertToPublic(item);
        return item;
    }

    public async delete(correlationId: string, group: string, id: string): Promise<void> {
        let filter = [];
        filter.push({ group: group });
        filter.push({ _id: id });
        return await super.deleteByFilter(correlationId, { $and: filter });
    }

    public async deleteExpired(correlationId: string): Promise<void> {
        let now = new Date();
        let filter = { expiration_time: { $lte: now } };
        return await super.deleteByFilter(correlationId, filter);
    }
}
