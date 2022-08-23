import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { RetriesMongoDbPersistence } from '../persistence';
import { RetriesFilePersistence } from '../persistence';
import { RetriesMemoryPersistence } from '../persistence';
import { RetriesController } from '../logic';
import { RetriesHttpServiceV1 } from '../services/version1';
import {RetryProcessor} from "../logic/RetriesProcessor";

export class RetriesServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-retries", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("service-retries", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("service-retries", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("service-retries", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("service-retries", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("service-retries", "service", "http", "*", "1.0");
	public static ProcessorDescriptor = new Descriptor("service-retries", "processor", "default", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(RetriesServiceFactory.MemoryPersistenceDescriptor, RetriesMemoryPersistence);
		this.registerAsType(RetriesServiceFactory.FilePersistenceDescriptor, RetriesFilePersistence);
		this.registerAsType(RetriesServiceFactory.MongoDbPersistenceDescriptor, RetriesMongoDbPersistence);
		this.registerAsType(RetriesServiceFactory.ControllerDescriptor, RetriesController);
		this.registerAsType(RetriesServiceFactory.HttpServiceDescriptor, RetriesHttpServiceV1);
		this.registerAsType(RetriesServiceFactory.ProcessorDescriptor, RetryProcessor);
		
	}
}