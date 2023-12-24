import { loginUser } from '@/app/actions/grants';
import { createClient } from '@/app/actions/supabase';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('THE REQUEST = ', JSON.stringify(request));
  const newUser = await request.json();
  console.log('THE USER = ', JSON.stringify(newUser));
  const cookieStore = cookies();
  const supabaseClient = createClient(cookieStore);
  const myResponse = await loginUser(() => supabaseClient, newUser);
  return Response.json({ myResponse });
}
