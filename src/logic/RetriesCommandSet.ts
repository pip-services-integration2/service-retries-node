import {CommandSet, SortParams, StringConverter} from 'pip-services3-commons-nodex';
import { ICommand } from 'pip-services3-commons-nodex';
import { Command } from 'pip-services3-commons-nodex';
import { Parameters } from 'pip-services3-commons-nodex';
import { FilterParams } from 'pip-services3-commons-nodex';
import { PagingParams } from 'pip-services3-commons-nodex';
import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';
import { FilterParamsSchema } from 'pip-services3-commons-nodex';
import { PagingParamsSchema } from 'pip-services3-commons-nodex';

import { IRetriesController } from './IRetriesController';

export class RetriesCommandSet extends CommandSet {
    private _logic: IRetriesController;

    constructor(logic: IRetriesController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetGroupNamesCommand());
		this.addCommand(this.makeGetRetriesCommand());
		this.addCommand(this.makeAddRetryCommand());
		this.addCommand(this.makeAddRetriesCommand());
		this.addCommand(this.makeGetRetryByIdCommand());
		this.addCommand(this.makeGetRetryByIdsCommand());
		this.addCommand(this.makeDeleteRetryCommand());
		this.addCommand(this.makeDeleteExpiredRetryCommand());
    }

	private makeGetGroupNamesCommand(): ICommand {
		return new Command(
			"get_group_names",
			new ObjectSchema(true),
			async (correlationId: string, args: Parameters) => {
				return await this._logic.getGroupNames(correlationId);
			});
	}
	
	private makeGetRetriesCommand(): ICommand {
		return new Command(
			"get_retries",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            async (correlationId: string, args: Parameters) => {
                let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
				return await this._logic.getRetries(correlationId, filter, paging);
            }
		);
	}

	private makeAddRetryCommand(): ICommand {
		return new Command(
			"add_retry",
			new ObjectSchema(true)
				.withRequiredProperty("group", TypeCode.String)
				.withRequiredProperty("id", TypeCode.String)
				.withOptionalProperty("ttl", TypeCode.Long),
			async (correlationId: string, args: Parameters) => {
				let group = args.getAsString("group");
				let id = args.getAsString("id");
				let ttl = args.getAsNullableLong("ttl");
				return await this._logic.addRetry(correlationId, group, id, ttl);
			}
		);
	}

	private makeAddRetriesCommand(): ICommand {
		return new Command(
			"add_retries",
			new ObjectSchema(true)
				.withRequiredProperty("group", TypeCode.String)
				.withRequiredProperty("ids", TypeCode.Array)
				.withOptionalProperty("ttl", TypeCode.Long),
			async (correlationId: string, args: Parameters) => {
				let group = args.getAsString("group");
				let ids = StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
				let ttl = args.getAsNullableLong("ttl");
				return await this._logic.addRetries(correlationId, group, ids, ttl);
			}
		);
	}

	private makeGetRetryByIdCommand(): ICommand {
		return new Command(
			"get_retry_by_id",
			new ObjectSchema(true)
				.withRequiredProperty("group", TypeCode.String)
				.withRequiredProperty("id", TypeCode.String),
			async (correlationId: string, args: Parameters) => {
				let group = args.getAsString("group");
				let id = args.getAsString("id");
				return await this._logic.getRetryById(correlationId, group, id);
			}
		);
	}
	
	private makeGetRetryByIdsCommand(): ICommand {
		return new Command(
			"get_retry_by_ids",
			new ObjectSchema(true)
				.withRequiredProperty("group", TypeCode.String)
				.withRequiredProperty("ids", TypeCode.Array), // TODO: Check type
			async (correlationId: string, args: Parameters) => {
				let group = args.getAsString("group");
				let ids = StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
				return await this._logic.getRetryByIds(correlationId, group, ids);
			}
		);
	}

	private makeDeleteRetryCommand(): ICommand {
		return new Command(
			"delete_retry",
			new ObjectSchema(true)
				.withRequiredProperty("group", TypeCode.String)
				.withRequiredProperty("id", TypeCode.String),
			async (correlationId: string, args: Parameters) => {
				let group = args.getAsString("group");
				let id = args.getAsString("id");
				return await this._logic.deleteRetry(correlationId, group, id);
			});
	}
	
	private makeDeleteExpiredRetryCommand(): ICommand {
		return new Command(
			"delete_expired",
			new ObjectSchema(true),
            async (correlationId: string, args: Parameters) => {
                return await this._logic.deleteExpiredRetries(correlationId);
			}
		);
	}
}