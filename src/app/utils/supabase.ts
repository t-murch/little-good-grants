import { Grant, GrantDAO } from '@/app/types/grants';
import { Database } from '@/app/types/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const DEFAULT_DESCRIPTION = 'No description found';

const supabase = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Failed to connect to DB. Unable to enter Grant Submission.');
  }
  return createClient<Database>(supabaseUrl, supabaseKey);
};

const toGrant = (grantDAOs: GrantDAO[]): Grant[] => {
  return grantDAOs.map((grant) => {
    const toGrant: Grant = {
      deadline_date: grant.deadline_date, // DeadlineType,
      industries_served: grant.industries_served,
      name: grant.name,
      organization_name: grant.organization_name,
      url: grant.url,
      amount: grant.amount ?? 'Unknown',
      date_added: grant.date_added,
      description: grant.description ?? DEFAULT_DESCRIPTION,
    };
    return toGrant;
  });
};

export { supabase, toGrant };
