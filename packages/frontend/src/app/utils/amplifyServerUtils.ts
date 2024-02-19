import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import config from '../../../config';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: {
    Auth: {
      Cognito: {
        userPoolId: config.cognito.USER_POOL_ID!,
        userPoolClientId: config.cognito.APP_CLIENT_ID!,
      },
    },
    API: {
      REST: {
        apiGateway: {
          endpoint: config.apiGateway.URL!,
          region: config.apiGateway.REGION,
        },
      },
    },
  },
  // config
});
