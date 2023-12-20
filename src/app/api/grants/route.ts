import { submitGrantForApproval } from '@/app/actions/grants';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  console.log('THE REQUEST = ', JSON.stringify(request));
  const grant = await request.json();
  console.log('THE GRANT = ', JSON.stringify(grant));
  const myResponse = await submitGrantForApproval(grant);
  return Response.json({ myResponse });
}
