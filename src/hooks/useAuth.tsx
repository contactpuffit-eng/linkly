import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  user_id: string;
  email: string;
  name: string;
  role: 'admin' | 'vendor' | 'affiliate';
  username?: string;
  bio?: string;
  avatar_url?: string;
  theme_color?: string;
  landing_page_enabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: 'vendor' | 'affiliate') => Promise<{ error: any }>;
  signIn: (email: string, password: string, role?: 'vendor' | 'affiliate') => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo mode, no real auth needed
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string, role: 'vendor' | 'affiliate') => {
    // For demo purposes, create a fake user session
    const fakeUser = {
      id: `fake-${Date.now()}`,
      email,
      user_metadata: { name, role }
    };

    // Create a fake profile
    const fakeProfile = {
      user_id: fakeUser.id,
      email,
      name,
      role
    };

    setUser(fakeUser as any);
    setProfile(fakeProfile as any);

    return { error: null };
  };

  const signIn = async (email: string, password: string, role?: 'vendor' | 'affiliate') => {
    // For demo purposes, accept any email/password
    const fakeUser = {
      id: `fake-${Date.now()}`,
      email,
      user_metadata: { name: email.split('@')[0], role: role || 'affiliate' }
    };

    // Create a fake profile
    const fakeProfile = {
      user_id: fakeUser.id,
      email,
      name: email.split('@')[0],
      role: role || 'affiliate'
    };

    setUser(fakeUser as any);
    setProfile(fakeProfile as any);
    setLoading(false);

    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setSession(null);
    return { error: null };
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}