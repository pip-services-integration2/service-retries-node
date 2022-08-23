import { ConfigParams } from 'pip-services3-commons-nodex';

import { RetriesMongoDbPersistence } from '../../src/persistence/RetriesMongoDbPersistence';
import { RetriesPersistenceFixture } from './RetriesPersistenceFixture';

suite('RetriesMongoDbPersistence', () => {
    let persistence: RetriesMongoDbPersistence;
    let fixture: RetriesPersistenceFixture;

    setup(async () => {
        let MONGO_DB = process.env["MONGO_DB"] || "test";
        let MONGO_COLLECTION = process.env["MONGO_COLLECTION"] || "retries";
        let MONGO_SERVICE_HOST = process.env["MONGO_SERVICE_HOST"] || "localhost";
        let MONGO_SERVICE_PORT = process.env["MONGO_SERVICE_PORT"] || "27017";
        let MONGO_SERVICE_URI = process.env["MONGO_SERVICE_URI"];

        let dbConfig = ConfigParams.fromTuples(
            "collection", MONGO_COLLECTION,
            "connection.database", MONGO_DB,
            "connection.host", MONGO_SERVICE_HOST,
            "connection.port", MONGO_SERVICE_PORT,
            "connection.uri", MONGO_SERVICE_URI
        );

        persistence = new RetriesMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new RetriesPersistenceFixture(persistence);

        await persistence.open(null);
        await persistence.clear(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('Retry groups', async () => {
        await fixture.testGetRetryGroups();
    });


    test('Get Retry', async () => {
        await fixture.testGetRetry();
    });
    
    test('Get Retries', async () => {
        await fixture.testGetRetries();
    });

    test('Retries', async () => {
        await fixture.testRetry();
    });

    test('Expired Retries', async () => {
        await fixture.testExpiredRetries();
    });

});