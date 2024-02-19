'use client';

import { useAppContext } from '@/app/lib/contextLib';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';

export function Logout() {
  const { userHasAuthenticated } = useAppContext();
  const router = useRouter();

  async function logOut() {
    await signOut();

    userHasAuthenticated(false);
    router.push('/');
  }

  return (
    <a className="font-bold text-xl hover:cursor-pointer" onClick={logOut}>
      Sign Out
    </a>
  );
}
