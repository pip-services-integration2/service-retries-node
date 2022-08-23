import { ProcessContainer } from 'pip-services3-container-nodex';

import { RetriesServiceFactory } from '../build';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

export class RetriesProcess extends ProcessContainer {
    public constructor() {
        super("retries", "Retries microservice");
        this._factories.add(new RetriesServiceFactory);
        this._factories.add(new DefaultRpcFactory);
        this._factories.add(new DefaultSwaggerFactory);
    }
}