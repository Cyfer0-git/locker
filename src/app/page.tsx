'use client';

import { useApp } from '@/hooks/use-app';
import { AuthPage } from '@/components/auth-page';
import { MainLayout } from '@/components/main-layout';
import { GlobalLoader } from '@/components/global-loader';

export default function Home() {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return <GlobalLoader message="Initializing..." />;
  }

  return (
    <>
      {!user ? <AuthPage /> : <MainLayout />}
    </>
  );
}
