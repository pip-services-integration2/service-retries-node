import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';
import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from './IRetriesPersistence';
export declare class RetriesMongoDbPersistence extends IdentifiableMongoDbPersistence<RetryV1, string> implements IRetriesPersistence {
    constructor();
    getGroupNames(correlationId: string): Promise<string[]>;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<RetryV1>>;
    getByIds(correlationId: string, group: string, ids: string[]): Promise<RetryV1[]>;
    getById(correlationId: string, group: string, id: string): Promise<RetryV1>;
    delete(correlationId: string, group: string, id: string): Promise<void>;
    deleteExpired(correlationId: string): Promise<void>;
}
