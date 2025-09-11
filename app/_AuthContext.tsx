import {
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { auth } from './firebase.native';
type User = {
  id: string;
  email: string | null;
  name?: string | null;
  photoURL?: string | null;
};
type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, name?: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  signInWithGithub: () => Promise<User>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fb: FirebaseUser | null) => {
      if (fb) {
        setUser({ id: fb.uid, email: fb.email, name: fb.displayName, photoURL: fb.photoURL });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      const mapped: User = { id: cred.user.uid, email: cred.user.email, name: cred.user.displayName, photoURL: cred.user.photoURL };
      setUser(mapped);
      return mapped;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const mapped: User = { id: cred.user.uid, email: cred.user.email, name: cred.user.displayName, photoURL: cred.user.photoURL };
      setUser(mapped);
      return mapped;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Google Sign-In', 'Native Google sign-in requires AuthSession configuration. I can set it up if you want.');
      throw new Error('Google sign-in not configured for native');
    }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth as any, provider);
      const mapped: User = { id: cred.user.uid, email: cred.user.email, name: cred.user.displayName, photoURL: cred.user.photoURL };
      setUser(mapped);
      return mapped;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    if (Platform.OS !== 'web') {
      Alert.alert('GitHub Sign-In', 'Native GitHub sign-in requires AuthSession configuration. I can set it up if you want.');
      throw new Error('GitHub sign-in not configured for native');
    }
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      const cred = await signInWithPopup(auth as any, provider);
      const mapped: User = { id: cred.user.uid, email: cred.user.email, name: cred.user.displayName, photoURL: cred.user.photoURL };
      setUser(mapped);
      return mapped;
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setLoading(false);
  };

  const value = useMemo(
    () => ({ user, loading, register, login, logout, signInWithGoogle, signInWithGithub }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
