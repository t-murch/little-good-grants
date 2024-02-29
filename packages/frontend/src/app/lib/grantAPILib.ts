import { cookies } from 'next/headers';
import { runWithAmplifyServerContext } from '../utils/amplifyServerUtils';
import { get } from 'aws-amplify/api/server';
import { onError } from './errorLib';
import { Grant } from '../../../../core/src/types/grants';

/*
 * SERVER ACTIONS BELOW
 */

export async function getApprovedGrants(): Promise<Grant[]> {
  const grants: Grant[] = [];

  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const { body } = await get(contextSpec, {
          apiName: 'grants',
          path: '/grants/listings',
        }).response;

        console.log('body= \n', body);
        console.log('body.json()= \n', await body.json());
        grants.push(...((await body.json()) as Grant[]));
      } catch (error) {
        onError(`loadApprovedGrants`, error);
      }
    },
  });

  return grants;
}

export async function getUnapprovedGrants(): Promise<Grant[]> {
  const grants: Grant[] = [];
  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const { body } = await get(contextSpec, {
          apiName: 'grants',
          path: '/grants/false',
        }).response;

        grants.push(...((await body.json()) as Grant[]));
      } catch (error) {
        onError(`loadUnapprovedGrants`, error);
        return [];
      }
      return grants;
    },
  });
  return grants;
}
