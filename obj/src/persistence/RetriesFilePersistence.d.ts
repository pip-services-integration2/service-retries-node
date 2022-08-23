import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';
import { RetriesMemoryPersistence } from './RetriesMemoryPersistence';
import { RetryV1 } from '../data/version1';
export declare class RetriesFilePersistence extends RetriesMemoryPersistence {
    protected _persister: JsonFilePersister<RetryV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
