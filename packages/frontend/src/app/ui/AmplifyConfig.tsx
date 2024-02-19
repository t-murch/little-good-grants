'use client';

import { Amplify } from 'aws-amplify';
import config from '../../../config';

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: config.cognito.USER_POOL_ID!,
        userPoolClientId: config.cognito.APP_CLIENT_ID!,
        identityPoolId: config.cognito.IDENTITY_POOL_ID!,
      },
      // mandatorySignIn: true,
      // region: config.cognito.REGION,
    },
    API: {
      REST: {
        grants: {
          endpoint: config.apiGateway.URL!,
          region: config.apiGateway.REGION,
        },
      },
    },
  },
  {
    ssr: true,
  },
);

export default function ConfigureSyncing() {
  return null;
}
