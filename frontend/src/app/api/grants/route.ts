import { submitGrantForApproval } from '@/app/actions/grants';
import { createClient } from '@/app/actions/supabase';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('THE REQUEST = ', JSON.stringify(request));
  const grant = await request.json();
  console.log('THE GRANT = ', JSON.stringify(grant));
  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);
  const myResponse = await submitGrantForApproval(() => supabaseClient, grant);
  return Response.json({ myResponse });
}
