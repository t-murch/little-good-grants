import { logoutUser } from '@/app/actions/grants';
import { createClient } from '@/app/actions/supabase';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);
  const myResponse = await logoutUser(() => supabaseClient);
  return Response.json(myResponse);
}
