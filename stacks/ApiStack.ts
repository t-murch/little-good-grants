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
      "GET /grants/{approved}": "packages/functions/src/grant.list",
      "POST /submission": "packages/functions/src/grant.createSubmission",

      "GET /grant/{id}": "packages/functions/src/grant.get",
      "PUT /grant/{id}": "packages/functions/src/grant.update",
      "DELETE /grant/{id}": "packages/functions/src/grant.remove",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
