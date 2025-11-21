
'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { Credential, CannedMessage, Link } from '@/lib/types';
import { deriveKey, encrypt, decrypt } from '@/lib/encryption';
import { v4 as uuidv4 } from 'uuid';

const isClient = typeof window !== 'undefined';

interface AppContextType {
  isLocked: boolean;
  isLoading: boolean;
  isCryptoReady: boolean;
  credentials: Credential[];
  messages: CannedMessage[];
  links: Link[];
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
  addCredential: (data: Omit<Credential, 'id'>) => void;
  updateCredential: (id: string, data: Omit<Credential, 'id'>) => void;
  deleteCredential: (id: string) => void;
  addMessage: (data: Omit<CannedMessage, 'id'>) => void;
  updateMessage: (id: string, data: Omit<CannedMessage, 'id'>) => void;
  deleteMessage: (id: string) => void;
  addLink: (data: Omit<Link, 'id'>) => void;
  updateLink: (id: string, data: Omit<Link, 'id'>) => void;
  deleteLink: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isCryptoReady, setIsCryptoReady] = useState(false);
  const [masterKey, setMasterKey] = useState<string | null>(null);

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [messages, setMessages] = useState<CannedMessage[]>([]);
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    // This effect runs only once to check for CryptoJS and attempt session unlock.
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const cryptoLoaded = isClient && typeof (window as any).CryptoJS !== 'undefined';

      if (cryptoLoaded) {
        clearInterval(interval);
        setIsCryptoReady(true);
        const sessionKey = sessionStorage.getItem('masterKey');
        if (sessionKey) {
          try {
            const loadedCredentials = loadData('credentials', sessionKey, true);
            const loadedMessages = loadData('messages', sessionKey, true);
            const loadedLinks = loadData('links', sessionKey, true);

            setCredentials(loadedCredentials as Credential[]);
            setMessages(loadedMessages as CannedMessage[]);
            setLinks(loadedLinks as Link[]);
            setMasterKey(sessionKey);
            setIsLocked(false);
          } catch (error) {
            console.error('Session unlock failed, locking app.', error);
            lock();
          } finally {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } else if (attempts > 50) { // Timeout after ~5 seconds
        clearInterval(interval);
        console.error("CryptoJS failed to load.");
        setIsLoading(false); // Stop loading to show an error or the lock screen
      }
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const saveData = useCallback(
    (key: string, data: any[]) => {
      if (!masterKey || !isClient || !isCryptoReady) return;
      try {
        const encryptedData = data.map((item) => {
          const encryptedItem: { [key: string]: any } = { id: item.id };
          Object.keys(item).forEach((prop) => {
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
    },
    [masterKey, isCryptoReady]
  );

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

  useEffect(() => {
    if (masterKey) {
      saveData('links', links);
    }
  }, [links, masterKey, saveData]);

  const loadData = useCallback((key: string, decryptionKey: string, cryptoMustBeReady: boolean = false) => {
    if (!isClient) return [];
    if (cryptoMustBeReady && (typeof (window as any).CryptoJS === 'undefined')) {
      throw new Error(`CryptoJS library not ready for key: ${key}`);
    }
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        const encryptedItems = JSON.parse(storedData);
        if (!Array.isArray(encryptedItems)) return [];
        return encryptedItems.map((item: any) => {
          const decryptedItem: { [key: string]: any } = { id: item.id };
          Object.keys(item).forEach((prop) => {
            if (prop !== 'id') {
              decryptedItem[prop] = decrypt(item[prop], decryptionKey);
            }
          });
          return decryptedItem;
        });
      } catch (error) {
        console.error('Failed to load or decrypt data. Wrong password?', error);
        throw error;
      }
    }
    return [];
  }, []);

  const unlock = useCallback(
    async (password: string): Promise<boolean> => {
      if (!isCryptoReady) {
        console.error('Unlock failed: CryptoJS not ready.');
        return false;
      }
      setIsLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            const derivedKey = deriveKey(password);
            const loadedCredentials = loadData('credentials', derivedKey) as Credential[];
            const loadedMessages = loadData('messages', derivedKey) as CannedMessage[];
            const loadedLinks = loadData('links', derivedKey) as Link[];

            setCredentials(loadedCredentials);
            setMessages(loadedMessages);
            setLinks(loadedLinks);
            setMasterKey(derivedKey);
            if (isClient) sessionStorage.setItem('masterKey', derivedKey);
            setIsLocked(false);
            setIsLoading(false);
            resolve(true);
          } catch (error) {
            console.error('Unlock failed:', error);
            setMasterKey(null);
            setIsLocked(true);
            if (isClient) sessionStorage.removeItem('masterKey');
            setIsLoading(false);
            resolve(false);
          }
        }, 500);
      });
    },
    [loadData, isCryptoReady]
  );

  const lock = useCallback(() => {
    setMasterKey(null);
    setIsLocked(true);
    setCredentials([]);
    setMessages([]);
    setLinks([]);
    if (isClient) sessionStorage.removeItem('masterKey');
  }, []);

  const addCredential = (data: Omit<Credential, 'id'>) => {
    setCredentials((prev) => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateCredential = (id: string, data: Omit<Credential, 'id'>) => {
    setCredentials((prev) => prev.map((c) => (c.id === id ? { ...data, id } : c)));
  };

  const deleteCredential = (id: string) => {
    setCredentials((prev) => prev.filter((c) => c.id !== id));
  };

  const addMessage = (data: Omit<CannedMessage, 'id'>) => {
    setMessages((prev) => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateMessage = (id: string, data: Omit<CannedMessage, 'id'>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...data, id } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const addLink = (data: Omit<Link, 'id'>) => {
    setLinks((prev) => [...prev, { ...data, id: uuidv4() }]);
  };

  const updateLink = (id: string, data: Omit<Link, 'id'>) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...data, id } : l)));
  };

  const deleteLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  };

  const contextValue = useMemo(
    () => ({
      isLocked,
      isLoading,
      isCryptoReady,
      credentials,
      messages,
      links,
      unlock,
      lock,
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
    [isLocked, isLoading, isCryptoReady, credentials, messages, links, unlock, lock]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
