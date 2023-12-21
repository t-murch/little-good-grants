'use server';

import { Database } from '@/app/types/supabase';
import { createClient } from '@supabase/supabase-js';
import { BaseGrant, GrantDAO } from '../types/grants';
import { InsertResponse, handlReadRequest, handleInsertRequest } from './baseController';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const DEFAULT_DESCRIPTION = 'No description found';

const supabase = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Failed to connect to DB. Unable to enter Grant Submission.');
  }
  console.debug('Creating Supabase Client. Should only happen once.');
  return createClient<Database>(supabaseUrl, supabaseKey);
};

async function getUnapprovedSubmissions(): Promise<GrantDAO[] | null> {
  let { data: listings, error } = await supabase().from('submissions').select('*');
  return handlReadRequest<GrantDAO[]>({ data: listings as GrantDAO[], error: error ?? undefined });
}

// NEW DESIGN WITH SEPARATE SUBMISSION AND LISTING TABLES
async function getAllApprovedGrants(): Promise<GrantDAO[] | null> {
  // console.debug('Getting Listings');
  const { data: listings, error } = await supabase().from('listings').select('*');
  return handlReadRequest<GrantDAO[]>({ data: listings as GrantDAO[], error: error ?? undefined });
}

async function submitGrantForApproval(grant: BaseGrant): Promise<InsertResponse | null> {
  const { error, status, statusText } = await supabase()
    .from('submissions')
    .insert(
      [
        {
          name: grant.name,
          deadline_date: grant.deadline_date,
          industries_served: grant.industries_served,
          organization_name: grant?.organization_name,
          submitted: true,
          url: grant.url,
        },
      ],
      { defaultToNull: true },
    );

  return handleInsertRequest({ data: { status: status, statusText: statusText }, error: error ?? undefined });
}

export { getAllApprovedGrants, getUnapprovedSubmissions, submitGrantForApproval };
