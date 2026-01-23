'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useAuthHook, type User } from '@/hooks/use-auth';
import { createSupabaseClient } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook();
  const [mounted, setMounted] = useState(false);

  // Listen for auth state changes from Supabase
  useEffect(() => {
    setMounted(true);
    const supabase = createSupabaseClient();
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Refresh auth state when session changes
      auth.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth]);

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, loading: true, authenticated: false }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        loading: auth.loading,
        authenticated: auth.authenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
