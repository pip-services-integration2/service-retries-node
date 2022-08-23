import { DataPage } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { RetryV1 } from '../data/version1';

export interface IRetriesController {
    getGroupNames(correlationId: string): Promise<Array<string>>;
    getRetries(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<RetryV1>>;
    addRetry(correlationId: string, group: string, id: string, timeToLive: number): Promise<RetryV1>;
    addRetries(correlationId: string, group: string, ids: string[], timeToLive: number): Promise<RetryV1[]>;
    getRetryById(correlationId: string, group: string, id: string): Promise<RetryV1>;
    getRetryByIds(correlationId: string, group: string, ids: string[]): Promise<RetryV1[]>;
    deleteRetry(correlationId: string, group: string, id: string): Promise<void>;
    deleteExpiredRetries(correlationId: string): Promise<void>;
}
