'use client';

import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
} from 'react';
import { Credential, CannedMessage, Link } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  isLoading: boolean;
  credentials: Credential[];
  messages: CannedMessage[];
  links: Link[];
  addCredential: (data: Omit<Credential, 'id'>) => void;
  updateCredential: (id: string, data: Partial<Omit<Credential, 'id'>>) => void;
  deleteCredential: (id: string) => void;
  addMessage: (data: Omit<CannedMessage, 'id'>) => void;
  updateMessage: (id: string, data: Partial<Omit<CannedMessage, 'id'>>) => void;
  deleteMessage: (id: string) => void;
  addLink: (data: Omit<Link, 'id'>) => void;
  updateLink: (id: string, data: Partial<Omit<Link, 'id'>>) => void;
  deleteLink: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false); // No longer loading from firebase

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [messages, setMessages] = useState<CannedMessage[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  // add helper inside AppProvider (near other helpers/state)
  async function sendToSheets(type: 'message' | 'credential' | 'link', data: any) {
    try {
        await fetch('/api/sheets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data }),
        })
    } catch (err) {
        console.error('sheets error', err)
    }
  }

  const addMessage = (data: Omit<CannedMessage, 'id'>) => {
    const newMessage = { ...data, id: uuidv4() }
    setMessages(prev => [...prev, newMessage])
    void sendToSheets('message', newMessage)
  }

  const updateMessage = (id: string, data: Partial<Omit<CannedMessage, 'id'>>) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...data } as CannedMessage : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const addCredential = (data: Omit<Credential, 'id'>) => {
    const newCredential = { ...data, id: uuidv4() }
    setCredentials(prev => [...prev, newCredential])
    void sendToSheets('credential', newCredential)
  }

  const updateCredential = (id: string, data: Partial<Omit<Credential, 'id'>>) => {
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, ...data } as Credential : c));
  };

  const deleteCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id));
  };

  const addLink = (data: Omit<Link, 'id'>) => {
    const newLink = { ...data, id: uuidv4() }
    setLinks(prev => [...prev, newLink])
    void sendToSheets('link', newLink)
  }

  const updateLink = (id: string, data: Partial<Omit<Link, 'id'>>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...data } as Link : l));
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };


  const contextValue = useMemo(
    () => ({
      isLoading,
      credentials,
      messages,
      links,
      addCredential,
      updateCredential,
      deleteCredential,
      addMessage,
      updateMessage,
      deleteMessage,
      addLink,
      updateLink,
      deleteLink,
    }),
    [isLoading, credentials, messages, links]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
