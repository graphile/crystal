# Lambda

**THIS INTEGRATION IS EXPERIMENTAL**. PRs improving it are welcome.

Grafserv supports the following AWS lambda configurations:

## AWS API Gateway v2

To deploy Grafserv in API Gateway v2:

- Create a Node.js 22.x lambda following the
  [AWS Lambda Node.js][aws-lambda-nodejs] instructions.
- Add `grafserv` as a dependency using your node package manager of choice
- Replace your lambda's handler implementation with the code below
- Deploy your lambda as a zip package following the
  [Deploy Node.js Lambda dependencies][aws-lambda-deps] instructions.

```js
import { grafserv } from "grafserv/lambda/v1";
import preset from "./graphile.config.mjs";
import schema from "./schema.mjs";

// Create a Grafserv instance
const serv = grafserv({ schema, preset });

// Export a lambda handler for GraphQL
export const handler = serv.createHandler();
```

[aws-lambda-nodejs]: https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html
[aws-lambda-deps]: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html
