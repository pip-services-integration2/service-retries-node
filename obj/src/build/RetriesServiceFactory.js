"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetriesServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const persistence_1 = require("../persistence");
const persistence_2 = require("../persistence");
const persistence_3 = require("../persistence");
const logic_1 = require("../logic");
const version1_1 = require("../services/version1");
const RetriesProcessor_1 = require("../logic/RetriesProcessor");
class RetriesServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(RetriesServiceFactory.MemoryPersistenceDescriptor, persistence_3.RetriesMemoryPersistence);
        this.registerAsType(RetriesServiceFactory.FilePersistenceDescriptor, persistence_2.RetriesFilePersistence);
        this.registerAsType(RetriesServiceFactory.MongoDbPersistenceDescriptor, persistence_1.RetriesMongoDbPersistence);
        this.registerAsType(RetriesServiceFactory.ControllerDescriptor, logic_1.RetriesController);
        this.registerAsType(RetriesServiceFactory.CmdHttpServiceDescriptor, version1_1.RetriesCommandableHttpServiceV1);
        this.registerAsType(RetriesServiceFactory.ProcessorDescriptor, RetriesProcessor_1.RetryProcessor);
    }
}
exports.RetriesServiceFactory = RetriesServiceFactory;
RetriesServiceFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("service-retries", "factory", "default", "default", "1.0");
RetriesServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-retries", "persistence", "memory", "*", "1.0");
RetriesServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-retries", "persistence", "file", "*", "1.0");
RetriesServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-retries", "persistence", "mongodb", "*", "1.0");
RetriesServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-retries", "controller", "default", "*", "1.0");
RetriesServiceFactory.CmdHttpServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-retries", "service", "commandable-http", "*", "1.0");
RetriesServiceFactory.ProcessorDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-retries", "processor", "default", "*", "1.0");
//# sourceMappingURL=RetriesServiceFactory.js.map