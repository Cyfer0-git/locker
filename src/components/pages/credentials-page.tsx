'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/hooks/use-app';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { CredentialCard } from '@/components/credential-card';
import { AddCredentialModal } from '../modals/add-credential-modal';

export default function CredentialsPage() {
  const { credentials } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCredentials = useMemo(() => {
    if (!searchTerm) return credentials;
    const lowercasedTerm = searchTerm.toLowerCase();
    return credentials.filter(
      c =>
        c.site.toLowerCase().includes(lowercasedTerm) ||
        c.user.toLowerCase().includes(lowercasedTerm) ||
        c.url.toLowerCase().includes(lowercasedTerm)
    );
  }, [credentials, searchTerm]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Credential Manager</h2>
          <p className="text-muted-foreground text-sm">Securely store and manage your login credentials.</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto flex-shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="relative flex-grow w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by site name or user ID..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCredentials.map(cred => (
          <CredentialCard key={cred.id} credential={cred} />
        ))}
      </div>

      {credentials.length === 0 && (
        <div className="text-center py-12 text-muted-foreground col-span-full">
          <p className="font-medium">No credentials saved yet.</p>
          <p className="text-sm">Click "Add New" to get started.</p>
        </div>
      )}

      {credentials.length > 0 && filteredCredentials.length === 0 && (
        <div className="text-center py-12 text-muted-foreground col-span-full">
          <p className="font-medium">No credentials found for "{searchTerm}"</p>
          <p className="text-sm">Try searching for something else.</p>
        </div>
      )}

      <AddCredentialModal isOpen={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}
