import { CompositeCounters, CompositeLogger, CompositeTracer } from "pip-services3-components-nodex";
import { ConfigParams, SortParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { DataPage } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';

import { InstrumentTiming } from 'pip-services3-rpc-nodex';

import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from '../persistence';
import { IRetriesController } from './IRetriesController';
import { RetriesCommandSet } from './RetriesCommandSet';

export class RetriesController implements IConfigurable, IReferenceable, ICommandable, IRetriesController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'service-retries:persistence:*:*:1.0'
    );

    public readonly component: string = "Integration.RetriesController";

    private _logger: CompositeLogger = new CompositeLogger();
    private _counters: CompositeCounters = new CompositeCounters();
    private _tracer: CompositeTracer = new CompositeTracer();
    private _dependencyResolver: DependencyResolver = new DependencyResolver(RetriesController._defaultConfig);
    private _persistence: IRetriesPersistence;
    private _commandSet: RetriesCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IRetriesPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        return this._commandSet || (this._commandSet = new RetriesCommandSet(this));
    }

    protected instrument(correlationId: string, methodName: string): InstrumentTiming {
        this._logger.trace(correlationId, "Executed %s.%s %s", this.component, methodName);
        this._counters.incrementOne(this.component + "." + methodName + ".call_count");

        let counterTiming = this._counters.beginTiming(this.component + "." + methodName + ".exec_time");
        let traceTiming = this._tracer.beginTrace(correlationId, this.component + "." + methodName, null);
        return new InstrumentTiming(correlationId, this.component + "." + methodName, "call",
            this._logger, this._counters, counterTiming, traceTiming);
    }

    public async getGroupNames(correlationId: string): Promise<string[]> {
        let timing = this.instrument(correlationId, "getGroupNames");

        try {
            return await this._persistence.getGroupNames(correlationId);
        } catch(err) {
            this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "getGroupNames");
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    private createRetries(group: string, ids: string[], timeToLive: number): RetryV1[] {
        let now = new Date();
        let expirationTime = new Date(Date.now() + timeToLive);
        let result: RetryV1[] = [];

        for (let _id of ids) {
            let retry: RetryV1 = {
                id: _id,
                group: group,
                last_attempt_time: now,
                expiration_time: expirationTime,
                attempt_count: 1
            }
            result.push(retry);
        }
        return result;
    }

    public async addRetries(correlationId: string, group: string, ids: string[], timeToLive: number): Promise<RetryV1[]> {
        let timing = this.instrument(correlationId, "addRetries");
        let result: RetryV1[] = [];
        if (group == null || ids == null || ids.length == 0)
            return result;

        let retries: RetryV1[];
        retries = this.createRetries(group, ids, timeToLive);

        let index = retries.length - 1;

        try {
            do {
                let retry = retries[index--];
                let item = await this._persistence.getById(correlationId, retry.group, retry.id);

                if (item != null) {
                    retry.attempt_count = ++item.attempt_count;
                    retry.last_attempt_time = new Date();
                    let updatedItem = await this._persistence.update(correlationId, retry);
                    result.push(updatedItem);  
                } else {
                    let item = await this._persistence.create(correlationId, retry);
                    result.push(item);
                }

                return result;
            } while (index >= 0)
        } catch (ex) {
            timing.endFailure(ex);
            this._logger.error(correlationId, ex, "Failed to execute %s.%s", this.component, "addRetries");
            throw ex;
        } finally {
            timing.endTiming();
        }
    }

    public async addRetry(correlationId: string, group: string, id: string, timeToLive: number): Promise<RetryV1> {
        let timing = this.instrument(correlationId, "addRetries");
        let result: RetryV1 = null;
        if (group == null || id == null) {
            return result;
        }
        let retry: RetryV1;

        try {
            retry = this.createRetries(group, [id], timeToLive)[0];

            let item = await this._persistence.getById(correlationId, retry.group, retry.id);
            if (item != null) {
                retry.attempt_count = ++item.attempt_count;
                retry.last_attempt_time = new Date();
                result = await this._persistence.update(correlationId, retry);
            } else {
                result = await this._persistence.create(correlationId, retry);
            }

            return result;
        } catch(ex) {
            this._logger.error(correlationId, ex, "Failed to execute %s.%s", this.component, "addRetries");
            timing.endFailure(ex);
            throw ex;
        } finally {
            timing.endTiming();
        }
    }

    public async getRetries(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<RetryV1>> {
        let timing = this.instrument(correlationId, 'getRetries');

        try {
            return await this._persistence.getPageByFilter(correlationId, filter, paging);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async getRetryById(correlationId: string, group: string, id: string): Promise<RetryV1> {
        let timing = this.instrument(correlationId, "getRetryById");

        try {
            return await this._persistence.getById(correlationId, group, id);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async getRetryByIds(correlationId: string, group: string, ids: string[]): Promise<RetryV1[]> {
        let timing = this.instrument(correlationId, "getRetryByIds");

        try {
            return await this._persistence.getByIds(correlationId, group, ids);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async deleteRetry(correlationId: string, group: string, id: string): Promise<void> {
        let timing = this.instrument(correlationId, "deleteRetry");
        
        try {
            return await this._persistence.delete(correlationId, group, id);
        } catch (err) {
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }

    public async deleteExpiredRetries(correlationId: string): Promise<void> {
        let timing = this.instrument(correlationId, "deleteExpiredRetriess");
        try {
            return await this._persistence.deleteExpired(correlationId);
        } catch (err) {
            this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "deleteExpiredRetriess");
            timing.endFailure(err);
            throw err;
        } finally {
            timing.endTiming();
        }
    }
}
