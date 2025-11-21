'use client';

import { Button } from './ui/button';
import { AppSidebarTrigger } from './app-sidebar';

export function AppHeader() {

  return (
    <header className="bg-transparent p-4 flex justify-between items-center sticky top-0 z-30 h-16 shrink-0">
      <AppSidebarTrigger />
       <h1 className="text-xl font-semibold text-primary">Locker</h1>
    </header>
  );
}
