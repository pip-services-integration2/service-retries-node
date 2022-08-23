# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Retries microservice

This is Retries microservice from Pip.Services library. 
It stores Retries 

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca
* Persistence: Flat Files, MongoDB

This microservice has no dependencies on other microservices.

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services/client-retries-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)

## Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class RetryV1 {
    public id: string;
    public group: string;
    public attempt_count: number;
    public last_attempt_time: Date;
    public expiration_time: Date;
}

interface IRetriesController {
    getGroupNames(correlationId: string): Promise<Array<string>>;

    getRetries(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<RetryV1>>;

    addRetry(correlationId: string, group: string, id: string, timeToLive: number): Promise<RetryV1>;

    addRetries(correlationId: string, group: string, ids: string[], timeToLive: number): Promise<RetryV1[]>;

    getRetryById(correlationId: string, group: string, id: string): Promise<RetryV1>;

    getRetryByIds(correlationId: string, group: string, ids: string[]): Promise<RetryV1[]>;

    deleteRetry(correlationId: string, group: string, id: string): Promise<void>;

    deleteExpiredRetries(correlationId: string): Promise<void>;
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-integration2/service-retries-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 

Example of microservice configuration
```yaml
- descriptor: "pip-services-container:container-info:default:default:1.0"
  name: "service-retries"
  description: "Retries microservice"

- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "service-retries:persistence:file:default:1.0"
  path: "./data/retries.json"

- descriptor: "service-retries:controller:default:default:1.0"

- descriptor: "service-retries:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "client-retries-node": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
let sdk = new require('client-retries-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
let config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
let client = sdk.RetriesHttpClientV1(config);

// Connect to the microservice
await client.open(null);

// Work with the microservice
...
```

Now the client is ready to perform operations
```javascript
// Create a new retry
let  retry = {{
    id: '1',
    group: "c1",
    attempt_count: 1,
    last_attempt_time: new Date(),
    expiration_time: new Date()        
};

let retry = await client.createRetry(
    null,
    retry
);
```

```javascript
// Get the list of retries on 'time management' topic
let page = await client.getRetries(
    null,
    {
        id: '1',
        group: "c1",
    },
    {
        total: true,
        skip: 0,
        take: 10
    }
);
```    

## Acknowledgements

This microservice was created and currently maintained by 
- *Sergey Seroukhov* 
- *Sergey Khoroshikh*
- *Levichev Dmitry*

