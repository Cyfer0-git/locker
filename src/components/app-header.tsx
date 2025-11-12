'use client';

import { useApp } from '@/hooks/use-app';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function AppHeader() {
  const { lock } = useApp();

  return (
    <header className="bg-card border-b p-4 flex justify-between items-center sticky top-0 z-30 h-16 shrink-0">
      <h1 className="text-xl md:text-2xl font-bold text-primary">My Secure Data Manager</h1>
      <Button variant="outline" onClick={lock}>
        <LogOut className="mr-2 h-4 w-4" />
        Lock App
      </Button>
    </header>
  );
}
