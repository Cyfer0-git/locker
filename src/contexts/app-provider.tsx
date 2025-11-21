'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Credential, CannedMessage, Link } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { firebaseApp } from '@/firebase/config';
import { SignUpData, SignInData } from '@/lib/auth-types';

interface AppContextType {
  user: User | null;
  isLoading: boolean;
  credentials: Credential[];
  messages: CannedMessage[];
  links: Link[];
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  signIn: (data: SignInData) => Promise<{ success: boolean; error?: string }>;
  logOut: () => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [messages, setMessages] = useState<CannedMessage[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchData(currentUser.uid);
      } else {
        // Clear data on logout
        setCredentials([]);
        setMessages([]);
        setLinks([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const fetchData = async (uid: string) => {
    try {
      setIsLoading(true);
      const credsSnapshot = await getDocs(collection(db, 'users', uid, 'credentials'));
      setCredentials(credsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Credential[]);

      const msgsSnapshot = await getDocs(collection(db, 'users', uid, 'messages'));
      setMessages(msgsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CannedMessage[]);

      const linksSnapshot = await getDocs(collection(db, 'users', uid, 'links'));
      setLinks(linksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Link[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    const { name, email, password } = data;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      // Store user's name in Firestore
      await setDoc(doc(db, 'users', newUser.uid), { name, email });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (data: SignInData) => {
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };


  const addCredential = async (data: Omit<Credential, 'id'>) => {
    if (!user) return;
    const newCredential = { ...data, id: uuidv4() };
    await setDoc(doc(db, 'users', user.uid, 'credentials', newCredential.id), data);
    setCredentials(prev => [...prev, newCredential]);
  };

  const updateCredential = async (id: string, data: Partial<Omit<Credential, 'id'>>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'credentials', id), data);
    setCredentials(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCredential = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'credentials', id));
    setCredentials(prev => prev.filter(c => c.id !== id));
  };

  const addMessage = async (data: Omit<CannedMessage, 'id'>) => {
    if (!user) return;
    const newMessage = { ...data, id: uuidv4() };
    await setDoc(doc(db, 'users', user.uid, 'messages', newMessage.id), data);
    setMessages(prev => [...prev, newMessage]);
  };

  const updateMessage = async (id: string, data: Partial<Omit<CannedMessage, 'id'>>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'messages', id), data);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const deleteMessage = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'messages', id));
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const addLink = async (data: Omit<Link, 'id'>) => {
    if (!user) return;
    const newLink = { ...data, id: uuidv4() };
    await setDoc(doc(db, 'users', user.uid, 'links', newLink.id), data);
    setLinks(prev => [...prev, newLink]);
  };

  const updateLink = async (id: string, data: Partial<Omit<Link, 'id'>>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'links', id), data);
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...data } : l));
  };

  const deleteLink = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'links', id));
    setLinks(prev => prev.filter(l => l.id !== id));
  };


  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      credentials,
      messages,
      links,
      signUp,
      signIn,
      logOut,
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
    [user, isLoading, credentials, messages, links]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
