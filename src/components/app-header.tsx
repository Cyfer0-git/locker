'use client';

import { useApp } from '@/hooks/use-app';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { AppSidebarTrigger } from './app-sidebar';

export function AppHeader() {
  const { logOut } = useApp();

  return (
    <header className="bg-transparent p-4 flex justify-between items-center sticky top-0 z-30 h-16 shrink-0">
      <AppSidebarTrigger />
      <Button variant="outline" onClick={logOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </header>
  );
}
