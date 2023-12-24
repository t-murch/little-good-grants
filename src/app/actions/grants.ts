'use server';

import { InsertResponse, handlReadRequest, handleInsertRequest } from '@/app/actions/baseController';
import { BaseGrant, GrantDAO } from '@/app/types/grants';
import { AuthError, Session, SupabaseClient, User } from '@supabase/supabase-js';
import isStrongPassword from 'validator/es/lib/isStrongPassword';
import { z } from 'zod';

const DEFAULT_DESCRIPTION = 'No description found';

async function getUnapprovedSubmissions(supabaseClient: () => SupabaseClient): Promise<GrantDAO[] | null> {
  let { data: listings, error } = await supabaseClient().from('submissions').select('*');
  return handlReadRequest<GrantDAO[]>({ data: listings as GrantDAO[], error: error ?? undefined });
}

// NEW DESIGN WITH SEPARATE SUBMISSION AND LISTING TABLES
async function getAllApprovedGrants(supabaseClient: () => SupabaseClient): Promise<GrantDAO[] | null> {
  // console.debug('Getting Listings');
  const { data: listings, error } = await supabaseClient().from('listings').select('*');
  return handlReadRequest<GrantDAO[]>({ data: listings as GrantDAO[], error: error ?? undefined });
}

async function submitGrantForApproval(supabaseClient: () => SupabaseClient, grant: BaseGrant): Promise<InsertResponse | null> {
  const { error, status, statusText } = await supabaseClient()
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

const PASSWORD_VALIDATION = 'Password must be 8-12 alphanumeric-characters, with atleast one uppercase character and symbol. ';

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, { message: PASSWORD_VALIDATION }).max(16),
    confirmPassword: z.string().min(8).max(16),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['confirmPassword'],
      });
    }
    if (!isStrongPassword(password)) {
      ctx.addIssue({
        code: 'custom',
        message: 'The password is not strong enough',
        path: ['password'],
      });
    }
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(16),
});

async function signUpNewUser(supabaseClient: () => SupabaseClient, values: z.infer<typeof signUpSchema>) {
  const myResult: { data: { user: User | null; session: Session | null }; error: AuthError | any } = { data: { user: null, session: null }, error: null };
  // const { email: userEmail, password: userPassword } = signUpSchema.parse(values);
  const some = signUpSchema.safeParse(values);

  if (!some.success) {
    myResult.error = some.error;
    return myResult;
  }
  const { data, error } = await supabaseClient().auth.signUp({
    email: some.data.email,
    password: some.data.password,
    options: {
      emailRedirectTo: 'http//localhost.com/home/login',
    },
  });
  myResult.data = data;
  myResult.error = error;
  console.log('**SUBMITT-ING**', values);
  return myResult;
}

async function loginUser(supabaseClient: () => SupabaseClient, values: z.infer<typeof loginSchema>) {
  const myResult: { data: { user: User | null; session: Session | null }; error: AuthError | any } = { data: { user: null, session: null }, error: null };
  // const { email: userEmail, password: userPassword } = signUpSchema.parse(values);
  const some = loginSchema.safeParse(values);

  if (!some.success) {
    myResult.error = some.error;
    return myResult;
  }
  const { data, error } = await supabaseClient().auth.signInWithPassword({
    email: some.data.email,
    password: some.data.password,
  });
  myResult.data = data;
  myResult.error = error;
  console.log('**SUBMITT-ED**', values);
  return myResult;
}

export { getAllApprovedGrants, getUnapprovedSubmissions, loginUser, signUpNewUser, submitGrantForApproval };
