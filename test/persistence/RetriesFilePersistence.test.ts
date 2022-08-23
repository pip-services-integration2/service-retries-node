import { RetriesFilePersistence } from '../../src/persistence/RetriesFilePersistence';
import { RetriesPersistenceFixture } from './RetriesPersistenceFixture';

suite('RetriesFilePersistence', () => {
    let persistence: RetriesFilePersistence;
    let fixture: RetriesPersistenceFixture;

    setup(async () => {
        persistence = new RetriesFilePersistence('./data/retries.test.json');

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