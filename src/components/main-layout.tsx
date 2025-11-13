'use client';

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import CredentialsPage from '@/components/pages/credentials-page';
import MessagesPage from '@/components/pages/messages-page';
import LinksPage from '@/components/pages/links-page';
import { GlobalLoader } from './global-loader';
import { useApp } from '@/hooks/use-app';
import { SidebarProvider } from './ui/sidebar';

type Page = 'credentials' | 'messages' | 'links';

export function MainLayout() {
  const [activePage, setActivePage] = useState<Page>('credentials');
  const { isLoading, isCryptoReady } = useApp();

  if (isLoading || !isCryptoReady) {
    return <GlobalLoader message="Initializing..." />;
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className='h-full w-full rounded-lg bg-card border p-4 md:p-6'>
              {activePage === 'credentials' && <CredentialsPage />}
              {activePage === 'messages' && <MessagesPage />}
              {activePage === 'links' && <LinksPage />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
