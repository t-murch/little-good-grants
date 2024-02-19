'use client';

import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { AppContext } from './lib/contextLib';

export function Providers({ children }) {
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [_isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      const { credentials } = await fetchAuthSession();
      if (!credentials) {
        userHasAuthenticated(false);
        setIsAuthenticating(false);
        console.log('No credentials');
        return;
      }
      userHasAuthenticated(true);

      console.log('User is authenticated');
    } catch (e) {
      if (e !== 'No current user') {
        console.log(e);
      }
    }

    setIsAuthenticating(false);
  }

  return (
    <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
}
