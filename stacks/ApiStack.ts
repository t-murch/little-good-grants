import { StackContext, Api, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function API({ stack }: StackContext) {
  const { table } = use(StorageStack);
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      "GET /listings": "packages/functions/src/listings.list",
      "POST /listings": "packages/functions/src/listings.create",
      "PUT /listings/:id": "packages/functions/src/listings.update",
      "DELETE /listings/:id": "packages/functions/src/listings.delete",

      "GET /submissions": "packages/functions/src/submissions.list",
      "POST /submissions": "packages/functions/src/submissions.create",
      "PUT /submissions/:id": "packages/functions/src/submissions.update",
      "DELETE /submissions/:id": "packages/functions/src/submissions.delete",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
