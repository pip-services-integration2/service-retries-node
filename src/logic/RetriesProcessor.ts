import { ConfigParams, FixedRateTimer, IConfigurable, IReferenceable, IOpenable, IReferences, Descriptor } from "pip-services3-commons-nodex";
import { CompositeLogger } from "pip-services3-components-nodex";
import { Parameters } from "pip-services3-commons-nodex";
import { IRetriesController } from "./IRetriesController";


export class RetryProcessor implements IConfigurable, IReferenceable, IOpenable {
    private _logger: CompositeLogger = new CompositeLogger();
    private _timer: FixedRateTimer = new FixedRateTimer();
    private _controller: IRetriesController;
    private _correlationId: string = "Integration.Retries";
    private _interval: number = 300000;

    public constructor() {
    }

    public configure(config: ConfigParams): void {
        this._logger.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._controller = references.getOneRequired<IRetriesController>(new Descriptor("service-retries", "controller", "default", "*", "1.0"));
    }

    public async open(correlationId: string): Promise<void> {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setTask({
            notify: (correlationId: string, args: Parameters) => {
                this._deleteExpiredRetries();
            }
        });
        this._timer.start();
    }

    public async close(correlationId: string): Promise<void> {
        this._timer.stop();
    }

    public isOpen(): boolean {
        return this._timer != null && this._timer.isStarted();
    }

    private async _deleteExpiredRetries(): Promise<void> {
        this._timer.stop();
        this._logger.info(this._correlationId, "Deleting expired retries...");

        await this._controller.deleteExpiredRetries(this._correlationId);

        this._logger.info(this._correlationId, "Expired retries deleted.");
        this._timer.start();
    }
}
