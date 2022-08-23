const assert = require('chai').assert;

import { RetriesMemoryPersistence } from "../../src/persistence/RetriesMemoryPersistence";
import { ConfigParams, Descriptor, References, FilterParams, PagingParams } from "pip-services3-commons-nodex";
import { RetriesController } from "../../src/logic/RetriesController";

suite('Retries Controller', () => {
    let _persistence: RetriesMemoryPersistence;
    let _controller: RetriesController;

    setup(async () => {
        _persistence = new RetriesMemoryPersistence();
        _controller = new RetriesController();
        _persistence.configure(new ConfigParams());
        var references = References.fromTuples(
            new Descriptor("service-retries", "persistence", "mock", "default", "1.0"), _persistence
        );
        _controller.setReferences(references);
        await _persistence.open(null);
    });

    teardown(async () => {
        await _persistence.close(null);
    });

    test('Test Get Retry Groups', async () => {
        // Add retries
        await _controller.addRetry(null, "Common.Group", "123", 3);
        await _controller.addRetry(null, "Common.AnotherGroup", "123", 3);
        await _controller.addRetry(null, "Common.Group", "ABC", 3);

        let items = await _controller.getGroupNames(null);

        assert.equal(2, items.length);
        assert.include(items, "Common.Group");
        assert.include(items, "Common.AnotherGroup");
    });


    test('Test Get Retries', async () => {
        // Add retries
        await _controller.addRetry(null, "Common.Group", "123", 3);
        await _controller.addRetry(null, "Common.AnotherGroup", "123", 3);
        await _controller.addRetry(null, "Common.Group", "ABC", 3);
        await _controller.addRetry(null, "Common.Group", "AAA", 3);

        let retries = await _controller.getRetries(null, FilterParams.fromTuples("group", "Common.Group"), new PagingParams(1, 10, false));

        assert.isNotNull(retries.data);
        assert.equal(2, retries.data.length);
    });


    test('Test Retries', async () => {
        // Add retries
        await _controller.addRetry(null, "Common.Group", "123", 3);
        await _controller.addRetry(null, "Common.AnotherGroup", "123", 3);
        await _controller.addRetry(null, "Common.OtherGroup", "ABC", 3);

        // Try to read 1 retry
        let retry = await _controller.getRetryById(null, "Common.Group", "123");

        assert.isNotNull(retry);
        assert.equal(retry.id, "123");
        assert.equal(retry.group, "Common.Group");

        // Try to read 2 retry
        retry = await _controller.getRetryById(null, "Common.AnotherGroup", "123");
        assert.isNotNull(retry);
        assert.equal(retry.id, "123");
        assert.equal(retry.group, "Common.AnotherGroup");

        // Try to read 3 retry
        retry = await _controller.getRetryById(null, "Common.OtherGroup", "ABC");
        assert.isNotNull(retry);
        assert.equal(retry.id, "ABC");
        assert.equal(retry.group, "Common.OtherGroup");

        // Test non-exiting group
        retry = await _controller.getRetryById(null, "Common.Group1", "123");
        assert.isNull(retry);

        // Test non-exiting retry
        retry = await _controller.getRetryById(null, "Common.Group", "1234");
        assert.isNull(retry);
    });


    test('Test Expired Retries', async () => {
        // Add retries
        await _controller.addRetry(null, "Common.Group", "123", 0);
        await _controller.addRetry(null, "Common.Group", "ABC", 0);

        // Wait to expire
        await new Promise(r => setTimeout(r, 500));
        await _controller.deleteExpiredRetries(null);

        // Try to read expired retries
        let retry = await _controller.getRetryById(null, "Common.Group", "123");
        assert.isNull(retry);

        retry = await _controller.getRetryById(null, "Common.Group", "ABC");
        assert.isNull(retry);
    });

});