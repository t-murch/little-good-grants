import { StackContext, Api, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';

function addAuth(funcPath: string): { authorizer: 'iam'; function: string } {
  return {
    authorizer: 'iam',
    function: funcPath,
  };
}

export function API({ stack }: StackContext) {
  const { table } = use(StorageStack);
  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        bind: [table],
      },
    },
    routes: {
      'GET /grants/listings': 'packages/functions/src/grant.listings',
      'POST /grant/submission': 'packages/functions/src/grant.createSubmission',

      'GET /grants/{approved}': addAuth('packages/functions/src/grant.list'),
      'GET /grant/{id}': addAuth('packages/functions/src/grant.get'),
      'PUT /grant/{id}': addAuth('packages/functions/src/grant.update'),
      'DELETE /grant/{id}': addAuth('packages/functions/src/grant.remove'),
      'POST /grants/insert': addAuth('packages/functions/src/grant.bulkInsert'),

      'POST /scrape/lwl': addAuth('packages/functions/src/scrape.lwl'),
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return {
    api,
  };
}
