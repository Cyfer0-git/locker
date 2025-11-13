'use client';

import React, { createContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import { Credential, CannedMessage } from '@/lib/types';
import { deriveKey, encrypt, decrypt } from '@/lib/encryption';
import { v4 as uuidv4 } from 'uuid';

// Helper to check if running on the client
const isClient = typeof window !== 'undefined';

interface AppContextType {
  isLocked: boolean;
  isLoading: boolean;
  credentials: Credential[];
  messages: CannedMessage[];
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  addCredential: (data: Omit<Credential, 'id'>) => void;
  updateCredential: (id: string, data: Omit<Credential, 'id'>) => void;
  deleteCredential: (id: string) => void;
  addMessage: (data: Omit<CannedMessage, 'id'>) => void;
  updateMessage: (id:string, data: Omit<CannedMessage, 'id'>) => void;
  deleteMessage: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [masterKey, setMasterKey] = useState<string | null>(null);

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [messages, setMessages] = useState<CannedMessage[]>([]);

  const saveData = useCallback((key: string, data: any[]) => {
    if (!masterKey || !isClient) return;
    try {
      const encryptedData = data.map(item => {
        const encryptedItem: { [key: string]: any } = { id: item.id };
        Object.keys(item).forEach(prop => {
          if (prop !== 'id') {
            encryptedItem[prop] = encrypt(item[prop], masterKey);
          }
        });
        return encryptedItem;
      });
      localStorage.setItem(key, JSON.stringify(encryptedData));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  }, [masterKey]);

  useEffect(() => {
    if (masterKey) {
      saveData('credentials', credentials);
    }
  }, [credentials, masterKey, saveData]);

  useEffect(() => {
    if (masterKey) {
      saveData('messages', messages);
    }
  }, [messages, masterKey, saveData]);

  const loadData = useCallback((key: string, decryptionKey: string) => {
    if (!isClient) return [];
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        const encryptedItems = JSON.parse(storedData);
        if (!Array.isArray(encryptedItems)) return [];
        return encryptedItems.map((item: any) => {
          const decryptedItem: { [key: string]: any } = { id: item.id };
          Object.keys(item).forEach(prop => {
            if (prop !== 'id') {
              decryptedItem[prop] = decrypt(item[prop], decryptionKey);
            }
          });
          return decryptedItem;
        });
      } catch (error) {
        console.error('Failed to load or decrypt data. Wrong password?', error);
        throw error; // Propagate error to be caught by unlock function
      }
    }
    return [];
  }, []);

  const unlock = useCallback(async (password: string): Promise<boolean> => {
      setIsLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            if (typeof CryptoJS === 'undefined') {
              throw new Error('CryptoJS library not loaded yet.');
            }
            const derivedKey = deriveKey(password);
            const loadedCredentials = loadData('credentials', derivedKey) as Credential[];
            const loadedMessages = loadData('messages', derivedKey) as CannedMessage[];
            
            setCredentials(loadedCredentials);
            setMessages(loadedMessages);
            setMasterKey(derivedKey);
            if (isClient) sessionStorage.setItem('masterKey', derivedKey);
            setIsLocked(false);
            resolve(true);
          } catch (error) {
            console.error('Unlock failed:', error);
            setMasterKey(null);
            setIsLocked(true);
            if (isClient) sessionStorage.removeItem('masterKey');
            resolve(false);
          } finally {
            setIsLoading(false);
          }
        }, 500);
      });
  }, [loadData]);


  const lock = useCallback(() => {
    setMasterKey(null);
    setIsLocked(true);
    setCredentials([]);
    setMessages([]);
    if (isClient) sessionStorage.removeItem('masterKey');
  }, []);
  
  // Check session on initial load
  useEffect(() => {
    if (!isClient) {
      setIsLoading(false);
      return;
    }
    const sessionKey = sessionStorage.getItem('masterKey');
    if (sessionKey) {
      setIsLoading(true);
      setTimeout(() => {
        try {
           if (typeof CryptoJS === 'undefined') {
            throw new Error('CryptoJS library not loaded yet for session unlock.');
          }
          const loadedCredentials = loadData('credentials', sessionKey);
          const loadedMessages = loadData('messages', sessionKey);
          setCredentials(loadedCredentials);
          setMessages(loadedMessages);
          setMasterKey(sessionKey);
          setIsLocked(false);
        } catch (error) {
          console.error("Session unlock failed, locking app.", error);
          lock();
        } finally {
          setIsLoading(false);
        }
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [lock, loadData]);

  const addCredential = (data: Omit<Credential, 'id'>) => {
    setCredentials(prev => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateCredential = (id: string, data: Omit<Credential, 'id'>) => {
    setCredentials(prev => prev.map(c => (c.id === id ? { ...data, id } : c)));
  };

  const deleteCredential = (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id));
  };

  const addMessage = (data: Omit<CannedMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateMessage = (id: string, data: Omit<CannedMessage, 'id'>) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...data, id } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const contextValue = useMemo(() => ({
    isLocked,
    isLoading,
    credentials,
    messages,
    unlock,
    lock,
    addCredential,
    updateCredential,
    deleteCredential,
    addMessage,
    updateMessage,
    deleteMessage,
  }), [isLocked, isLoading, credentials, messages, unlock, lock, updateCredential, deleteCredential, addMessage, updateMessage, deleteMessage]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
