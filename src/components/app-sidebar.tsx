'use client';

import { KeyRound, MessageSquareText } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';

type Page = 'credentials' | 'messages';

interface AppSidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export function AppSidebar({ activePage, setActivePage }: AppSidebarProps) {
  return (
    <SidebarProvider>
      <Sidebar side="left" className="border-r" variant="sidebar">
        <SidebarHeader />
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActivePage('credentials')}
                isActive={activePage === 'credentials'}
                tooltip={{ children: 'Credentials', side: 'right' }}
              >
                <KeyRound />
                <span>Credentials</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActivePage('messages')}
                isActive={activePage === 'messages'}
                tooltip={{ children: 'Messages', side: 'right' }}
              >
                <MessageSquareText />
                <span>Messages</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
