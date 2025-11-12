'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import CredentialsPage from '@/components/pages/credentials-page';
import MessagesPage from '@/components/pages/messages-page';
import { GlobalLoader } from './global-loader';
import { useApp } from '@/hooks/use-app';

type Page = 'credentials' | 'messages';

export function MainLayout() {
  const [activePage, setActivePage] = useState<Page>('credentials');
  const { isLoading } = useApp();

  return (
    <div className="flex h-screen bg-background">
       {isLoading && <GlobalLoader />}
      <AppSidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activePage === 'credentials' && <CredentialsPage />}
          {activePage === 'messages' && <MessagesPage />}
        </main>
      </div>
    </div>
  );
}
