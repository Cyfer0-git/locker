'use client';

import { KeyRound, MessageSquareText, PanelLeft, Link } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

type Page = 'credentials' | 'messages' | 'links';

interface AppSidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

export function AppSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={toggleSidebar}
    >
      <PanelLeft />
    </Button>
  );
}


export function AppSidebar({ activePage, setActivePage }: AppSidebarProps) {
  return (
      <Sidebar side="left" className="border-r" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader>
           <h1 className="text-2xl font-bold text-primary px-2">Locker</h1>
        </SidebarHeader>
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
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActivePage('links')}
                isActive={activePage === 'links'}
                tooltip={{ children: 'Links', side: 'right' }}
              >
                <Link />
                <span>Links</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
  );
}
