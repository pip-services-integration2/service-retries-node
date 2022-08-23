import { ConfigParams } from 'pip-services3-commons-nodex';

import { RetriesMemoryPersistence } from '../../src/persistence/RetriesMemoryPersistence';
import { RetriesPersistenceFixture } from './RetriesPersistenceFixture';

suite('RetriesMemoryPersistence', ()=> {
    let persistence: RetriesMemoryPersistence;
    let fixture: RetriesPersistenceFixture;

    setup(async () => {
        persistence = new RetriesMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new RetriesPersistenceFixture(persistence);

        await persistence.open(null);
    });

    teardown(async () => {
        await persistence.close(null);
    });

    test('Retry groups', async () => {
        await fixture.testGetRetryGroups();
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