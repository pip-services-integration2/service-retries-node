const restify = require('restify');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { RetryV1 } from '../../../src/data/version1';
import { RetriesMemoryPersistence } from '../../../src/persistence';
import { RetriesController } from '../../../src/logic';
import { RetriesHttpServiceV1 } from '../../../src/services/version1';

import {TestModel} from "../../data";

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);



suite('RetriesHttpServiceV1', ()=> {    
    let service: RetriesHttpServiceV1;
    let rest: any;

    suiteSetup(async () => {
        let persistence = new RetriesMemoryPersistence();
        let controller = new RetriesController();

        service = new RetriesHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-retries', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-retries', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-retries', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });

    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });


    test('Test Retries', async () => {
        let retry1, retry2: RetryV1;

        var date = new Date(new Date().toUTCString())
        date.setDate(date.getDate() + 3);
        var expirationTimeUtc = date;
        
        TestModel.DUPLICATE1.expiration_time = expirationTimeUtc;
        TestModel.DUPLICATE2.expiration_time = expirationTimeUtc;
        TestModel.DUPLICATE3.expiration_time = expirationTimeUtc;
        
        // Create one Retry
        let retry = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/add_retry',
                {
                    id: TestModel.DUPLICATE1.id,
                    group: TestModel.DUPLICATE1.group,
                    ttl: 3
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(retry);
        assert.equal(retry.id, TestModel.DUPLICATE1.id);
        assert.equal(retry.group, TestModel.DUPLICATE1.group);
        assert.equal(retry.attempt_count, TestModel.DUPLICATE1.attempt_count);

        retry1 = retry;

        // Create another Retry
        retry = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/add_retry',
                {
                    id: TestModel.DUPLICATE2.id,
                    group: TestModel.DUPLICATE2.group,
                    ttl: 2
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(retry);
        assert.equal(retry.id, TestModel.DUPLICATE2.id);
        assert.equal(retry.group, TestModel.DUPLICATE2.group);
        assert.equal(retry.attempt_count, TestModel.DUPLICATE2.attempt_count);

        retry2 = retry;

        // Get all Retries
        let page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/get_retries',
                {},
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(page);
        assert.lengthOf(page.data, 2);

        // Update the Retry
        retry1.name = 'Updated Retry 2';
        retry = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/add_retry',
                {
                    id: TestModel.DUPLICATE2.id,
                    group: TestModel.DUPLICATE2.group,
                    ttl: 3
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(retry);
        assert.equal(retry.id, TestModel.DUPLICATE2.id);
        assert.equal(retry.group, TestModel.DUPLICATE2.group);
        assert.equal(retry.attempt_count, 2);

        retry1 = retry;

        // Delete 1 Retry 
        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/delete_retry',
                {
                    id: TestModel.DUPLICATE1.id,
                    group: TestModel.DUPLICATE1.group,
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Delete 2 Retry 
        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/delete_retry',
                {
                    id: TestModel.DUPLICATE2.id,
                    group: TestModel.DUPLICATE2.group,
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Try to get delete Retry
        let result = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/get_retry_by_id',
                {
                    id: TestModel.DUPLICATE1.id,
                    group: TestModel.DUPLICATE1.group,
                },
                (err, req, res, result) => {
                    if (err == null) resolve(Object.keys(result).length == 0 ? null : result);
                    else reject(err);
                }
            );
        });
        
        assert.isNull(result);

        retry = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/add_retry',
                {
                    id: TestModel.DUPLICATE1.id,
                    group: TestModel.DUPLICATE1.group,
                    ttl: 3
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(retry);
        assert.equal(retry.id, TestModel.DUPLICATE1.id);
        assert.equal(retry.group, TestModel.DUPLICATE1.group);
        assert.equal(retry.attempt_count, TestModel.DUPLICATE1.attempt_count);
        
        // Create 2 Retry
        retry = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/add_retry',
                {
                    id: TestModel.DUPLICATE2.id,
                    group: TestModel.DUPLICATE2.group,
                    ttl: 2
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(retry);
        assert.equal(retry.id, TestModel.DUPLICATE2.id);
        assert.equal(retry.group, TestModel.DUPLICATE2.group);
        assert.equal(retry.attempt_count, TestModel.DUPLICATE2.attempt_count);

        // Create 3 Retry
        retry = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/add_retry',
                {
                    id: TestModel.DUPLICATE3.id,
                    group: TestModel.DUPLICATE3.group,
                    ttl: 2
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(retry);
        assert.equal(retry.id, TestModel.DUPLICATE3.id);
        assert.equal(retry.group, TestModel.DUPLICATE3.group);
        assert.equal(retry.attempt_count, TestModel.DUPLICATE3.attempt_count);

        // Get all Retries
        page = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/get_retries',
                {},
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(page);
        assert.lengthOf(page.data, 3);

        // Get all groups
        let groups = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/retries/get_group_names',
                {},
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isNotNull(groups);
        assert.equal(2, groups.length);
        assert.include(groups, "c1");
        assert.include(groups, "c2");
    });
});