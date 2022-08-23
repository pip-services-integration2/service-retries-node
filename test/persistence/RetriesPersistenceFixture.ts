import {TestModel} from "../data";

const assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';

import { IRetriesPersistence } from '../../src/persistence/IRetriesPersistence';

export class RetriesPersistenceFixture {
    private _persistence: IRetriesPersistence;

    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    public async testGetRetryGroups() {
        // Add retries
        await this._persistence.create(null, TestModel.DUPLICATE1);
        await this._persistence.create(null, TestModel.DUPLICATE2);
        await this._persistence.create(null, TestModel.DUPLICATE3);
        let items = await this._persistence.getGroupNames(null);

        assert.equal(2, items.length);
        assert.include(items, "c1");
        assert.include(items, "c2");
    }

    public async testGetRetries() {
        await this._persistence.create(null, TestModel.DUPLICATE1);
        await this._persistence.create(null, TestModel.DUPLICATE2);
        await this._persistence.create(null, TestModel.DUPLICATE3);

        let page = await this._persistence.getPageByFilter(null, FilterParams.fromTuples("group", "c2"), new PagingParams(0, 10, false));
        assert.isNotNull(page.data);
        assert.equal(2, page.data.length);
    }

    public async testGetRetry() {
        await this._persistence.create(null, TestModel.DUPLICATE1);

        // Test retries
        let retry = await this._persistence.getById(null, TestModel.DUPLICATE1.group, TestModel.DUPLICATE1.id);
        assert.equal(TestModel.DUPLICATE1.id, retry.id);
    }

    public async testRetry() {
        // Add retries
        await this._persistence.create(null, TestModel.DUPLICATE1);
        await this._persistence.create(null, TestModel.DUPLICATE2);
        await this._persistence.create(null, TestModel.DUPLICATE3);

        // Test retries
        let retry = await this._persistence.getById(null, TestModel.DUPLICATE1.group, TestModel.DUPLICATE1.id);
        assert.equal(TestModel.DUPLICATE1.id, retry.id);

        // Test different group
        retry = await this._persistence.getById(null, TestModel.DUPLICATE2.group, TestModel.DUPLICATE2.id);
        assert.equal(TestModel.DUPLICATE2.id, retry.id);

        // Test non-exiting group
        retry = await this._persistence.getById(null, "c4", TestModel.DUPLICATE1.id);
        assert.isNull(retry);

        // Test non-exiting retry
        retry = await this._persistence.getById(null, TestModel.DUPLICATE2.group, "4");
        assert.isNull(retry);

        // Delete retry
        this._persistence.delete(null, TestModel.DUPLICATE3.group, TestModel.DUPLICATE3.id);
        retry = await this._persistence.getById(null, TestModel.DUPLICATE3.group, TestModel.DUPLICATE3.id);

        assert.isNull(retry);
    }

    public async testExpiredRetries() {
        await this._persistence.create(null, TestModel.DUPLICATE1);
        await this._persistence.create(null, TestModel.DUPLICATE2);
        await this._persistence.create(null, TestModel.DUPLICATE3);

        // Wait to expire
        await new Promise(r => setTimeout(r, 500));
        await this._persistence.deleteExpired(null);

        // Try to read expired retries
        let retry = await this._persistence.getById(null, "c1", "1");
        assert.isNull(retry);

        retry = await this._persistence.getById(null, "c2", "2");
        assert.isNull(retry);

        retry = await this._persistence.getById(null, "c2", "3");
        assert.isNull(retry);
    }
}
