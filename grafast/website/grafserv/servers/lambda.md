# Lambda

Grafserv supports the following AWS lambda configurations:

## AWS API Gateway v2

To deploy Grafserv in API Gateway v2:

- Create an Node 18.x lambda following the instructions at https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html
- Add `grafserv` as a dependency using your node package manager of choice
- Replace your lambda's handler implementation with the code below
- Deploy your lambda as a zip package following the instructions at https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html#nodejs-package-create-dependencies

```js
import { grafserv } from "grafserv/lambda/v1";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Export a lambda handler for GraphQL
export const handler = serv.createHandler();
```
