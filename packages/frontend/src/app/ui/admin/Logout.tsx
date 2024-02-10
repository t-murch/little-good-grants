'use client';

import { useRouter } from 'next/navigation';

export function Logout() {
  const router = useRouter();
  async function logOut() {
    let data,
      error = null;
    console.log('Signing out');
    try {
      const myResponse = await fetch('/api/users/logout');
      const returnData = await myResponse.json();
      data = returnData.data;
      error = returnData.error;
      console.debug('SIGNOUT RESPONSE=', JSON.stringify({ data, error }));
      if (error === null) {
        console.log('Should be redirect home. ');
        // redirect('/home');
        router.push('/home');
      } else console.log('*** ADVISE USER OF ERROR SOMEHOW. ***');
    } catch (error) {
      console.log('*** ADVISE USER OF ERROR SOMEHOW. ***');
    }
  }

  return (
    <a className="font-bold text-xl hover:cursor-pointer" onClick={() => logOut()}>
      Sign Out
    </a>
  );
}
