import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { RetryV1 } from '../data/version1';
export interface IRetriesPersistence {
    getGroupNames(correlationId: string): Promise<Array<string>>;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<RetryV1>>;
    create(correlationId: string, retry: RetryV1): Promise<RetryV1>;
    update(correlationId: string, retry: RetryV1): Promise<RetryV1>;
    getByIds(correlationId: string, group: string, ids: string[]): Promise<Array<RetryV1>>;
    getById(correlationId: string, group: string, id: string): Promise<RetryV1>;
    delete(correlationId: string, group: string, id: string): Promise<void>;
    deleteExpired(correlationId: string): Promise<void>;
    clear(correlationId: string): Promise<void>;
}
