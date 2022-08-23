import { CommandSet } from 'pip-services3-commons-nodex';
import { IRetriesController } from './IRetriesController';
export declare class RetriesCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IRetriesController);
    private makeGetGroupNamesCommand;
    private makeGetRetriesCommand;
    private makeAddRetryCommand;
    private makeAddRetriesCommand;
    private makeGetRetryByIdCommand;
    private makeGetRetryByIdsCommand;
    private makeDeleteRetryCommand;
    private makeDeleteExpiredRetryCommand;
}
