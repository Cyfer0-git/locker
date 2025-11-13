'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/hooks/use-app';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { MessageCard } from '@/components/message-card';
import { AddMessageModal } from '../modals/add-message-modal';

export default function MessagesPage() {
  const { messages } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;
    const lowercasedTerm = searchTerm.toLowerCase();
    return messages.filter(
      m =>
        m.title.toLowerCase().includes(lowercasedTerm) ||
        m.body.toLowerCase().includes(lowercasedTerm)
    );
  }, [messages, searchTerm]);

  return (
    <div className="mx-auto w-full h-full flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
         <div>
          <h2 className="text-2xl font-bold tracking-tight">Canned Messages</h2>
        </div>
      </div>
      
       <div className="flex flex-col md:flex-row gap-4 w-full">
         <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title or content..."
              className="w-full pl-10 bg-background"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full md:w-auto flex-shrink-0">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New
          </Button>
      </div>

      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
        {filteredMessages.map(msg => (
          <MessageCard key={msg.id} message={msg} />
        ))}
      </div>

      {messages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground col-span-full">
          <p className="font-medium">No messages saved yet.</p>
          <p className="text-sm">Click "Add New" to create your first template.</p>
        </div>
      )}

      {messages.length > 0 && filteredMessages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground col-span-full">
          <p className="font-medium">No messages found for "{searchTerm}"</p>
          <p className="text-sm">Try searching for something else.</p>
        </div>
      )}

      <AddMessageModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
