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
      "GET /listing/{id}": "packages/functions/src/listing.get",
      "GET /listings": "packages/functions/src/listing.list",
      "POST /listing": "packages/functions/src/listing.create",
      "PUT /listing/{id}": "packages/functions/src/listing.update",
      "DELETE /listing/{id}": "packages/functions/src/listing.delete",

      "GET /submission/{id}": "packages/functions/src/submission.get",
      "GET /submissions": "packages/functions/src/submission.list",
      "POST /submission": "packages/functions/src/submission.create",
      "PUT /submission/{id}": "packages/functions/src/submission.update",
      "DELETE /submission/{id}": "packages/functions/src/submission.remove",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
