
'use client';

import { useContext } from 'react';
import { AppContext } from '@/contexts/app-provider';

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  // We add a dummy user object for components that expect it.
  return { ...context, user: { uid: 'local-user' } };
};
