import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class RetriesHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/retries');
        this._dependencyResolver.put('controller', new Descriptor('service-retries', 'controller', 'default', '*', '1.0'));
    }
}