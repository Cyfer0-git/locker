'use client';

import { useApp } from '@/hooks/use-app';
import { LockScreen } from '@/components/lock-screen';
import { MainLayout } from '@/components/main-layout';
import { GlobalLoader } from '@/components/global-loader';

export default function Home() {
  const { isLocked, isLoading } = useApp();

  if (isLoading) {
    return <GlobalLoader message="Initializing..." />;
  }

  return (
    <>
      {isLocked ? <LockScreen /> : <MainLayout />}
    </>
  );
}
