import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-nodex';
import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from './IRetriesPersistence';
export declare class RetriesMemoryPersistence extends IdentifiableMemoryPersistence<RetryV1, string> implements IRetriesPersistence {
    constructor();
    getByIds(correlationId: string, group: string, ids: string[]): Promise<RetryV1[]>;
    getById(correlationId: string, group: string, id: string): Promise<RetryV1>;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<RetryV1>>;
    getGroupNames(correlationId: string): Promise<string[]>;
    delete(correlationId: string, group: string, id: string): Promise<void>;
    deleteExpired(correlationId: string): Promise<void>;
    private composeFilter;
}
