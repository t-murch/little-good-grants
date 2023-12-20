import { PostgrestError } from '@supabase/supabase-js';

interface SupabaseReadResponse<T> {
  data?: T;
  error?: PostgrestError;
}

interface SupabaseInsertResponse {
  data: {
    status: number;
    statusText: string;
  };
  error?: PostgrestError;
}

interface InsertResponse {
  status: number;
  statusText: string;
}

// export type SupabaseInsertResponse = z.infer<typeof supabaseInsertResponse>;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function handlReadRequest<T>(request: SupabaseReadResponse<T>): T | null {
  try {
    if (request.error) {
      handleSupabaseError(request.error);
      return null;
    }

    return request.data || null;
  } catch (error) {
    // Handle unexpected errors (e.g., network issues)
    console.error('Unexpected error:', error);
    return null;
  }
}

function handleInsertRequest(request: SupabaseInsertResponse): InsertResponse | null {
  try {
    if (request.error) {
      handleSupabaseError(request.error);
      return null;
    }

    return request.data || null;
  } catch (error) {
    // Handle unexpected errors (e.g., network issues)
    console.error('Unexpected error:', error);
    return null;
  }
}

function handleSupabaseError(error: PostgrestError): PostgrestError {
  // Extract useful information from the error
  const { message, details, code, hint } = error;

  // Log the error for debugging purposes
  console.error('Supabase error:', error);

  return error;
}

export { handlReadRequest, handleInsertRequest, handleSupabaseError, type InsertResponse, type SupabaseInsertResponse, type SupabaseReadResponse };
