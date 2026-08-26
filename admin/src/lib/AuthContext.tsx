import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { supabase } from './supabase';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAdminProfile = async (accessToken: string) => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        'http://localhost:3000/api/v1';

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        setProfile(null);
        return null;
      }

      const data = await response.json();

      const fetchedProfile = data?.data?.profile || null;

      setProfile(fetchedProfile);

      return fetchedProfile;
    } catch (error) {
      console.error('Failed to load admin profile:', error);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('admin_token', session.access_token);

        await loadAdminProfile(session.access_token);
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('admin_token');
      }

      if (mounted) {
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          localStorage.setItem(
            'admin_token',
            session.access_token
          );

          await loadAdminProfile(session.access_token);
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('admin_token');
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session) {
      throw new Error(
        'Login succeeded but no session was returned.'
      );
    }

    const token = data.session.access_token;

    localStorage.setItem('admin_token', token);
    setUser(data.user);

    const fetchedProfile = await loadAdminProfile(token);

    if (
      !fetchedProfile ||
      !['admin', 'manager'].includes(fetchedProfile.role)
    ) {
      await supabase.auth.signOut();

      localStorage.removeItem('admin_token');

      setUser(null);
      setProfile(null);

      throw new Error(
        'You do not have permission to access the admin dashboard.'
      );
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem('admin_token');

    setUser(null);
    setProfile(null);
  };

  const isAdmin =
    !!profile &&
    ['admin', 'manager'].includes(profile.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}