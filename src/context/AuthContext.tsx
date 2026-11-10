import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';
import { getSupabaseClient } from '../lib/supabase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  supabaseUid?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  currentRole: UserRole;
  login: (role: UserRole, customUser?: AuthUser) => void;
  signInWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpDirectorGeneral: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
  isStudent: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset executive identity for Muneeb ur Rehman (Founder & Director General)
export const DIRECTOR_GENERAL_PROFILE: AuthUser = {
  id: 'usr-admin-director',
  name: 'Muneeb ur Rehman',
  email: 'director@jamiasalahuddin.edu.pk',
  role: 'admin',
  title: 'Founder & Director General',
};

const PRESET_USERS: Record<UserRole, AuthUser | null> = {
  public: null,
  admin: DIRECTOR_GENERAL_PROFILE,
  teacher: {
    id: 'usr-teacher',
    name: 'Maulana Abdul Qayyum',
    email: 'abdul.qayyum@jamiasalahuddin.edu.pk',
    role: 'teacher',
    title: 'Senior Asatiza & Head of Dars-e-Nizami',
  },
  student: {
    id: 'usr-student',
    name: 'Muhammad Usman Khan',
    email: 'usman.khan@student.jsa',
    role: 'student',
    title: 'Student (Roll No: JSA-2026-101)',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('jsa_auth_role');
    return (saved as UserRole) || 'public';
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('jsa_auth_role');
    const role = (saved as UserRole) || 'public';
    const savedUserJson = localStorage.getItem('jsa_auth_user');
    if (savedUserJson) {
      try {
        return JSON.parse(savedUserJson);
      } catch {}
    }
    return PRESET_USERS[role];
  });

  // Listen to Supabase Auth state changes if client is available
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Query user_roles table if present
        let detectedRole: UserRole = 'admin';
        try {
          const { data: roleRow } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (roleRow?.role === 'staff' || roleRow?.role === 'teacher') {
            detectedRole = 'teacher';
          }
        } catch {
          // Keep admin as default management tier
        }

        const authUser: AuthUser = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Muneeb ur Rehman',
          email: session.user.email || 'director@jamiasalahuddin.edu.pk',
          role: detectedRole,
          title: session.user.user_metadata?.title || 'Founder & Director General',
          supabaseUid: session.user.id,
        };

        setCurrentRole(detectedRole);
        setCurrentUser(authUser);
        localStorage.setItem('jsa_auth_role', detectedRole);
        localStorage.setItem('jsa_auth_user', JSON.stringify(authUser));
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = (role: UserRole, customUser?: AuthUser) => {
    const user = customUser || PRESET_USERS[role];
    setCurrentRole(role);
    setCurrentUser(user);
    localStorage.setItem('jsa_auth_role', role);
    if (user) {
      localStorage.setItem('jsa_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jsa_auth_user');
    }
  };

  const signInWithSupabase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      // Graceful local authenticated sign-in if Supabase credentials are not yet saved
      login('admin', {
        ...DIRECTOR_GENERAL_PROFILE,
        email: email.trim(),
      });
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || 'Muneeb ur Rehman',
          email: data.user.email || email,
          role: 'admin',
          title: 'Founder & Director General',
          supabaseUid: data.user.id,
        };
        login('admin', authUser);
      }

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Authentication failed' };
    }
  };

  const signUpDirectorGeneral = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return { success: false, error: 'Supabase client is not configured yet. Configure Supabase in Database Settings first.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            title: 'Founder & Director General',
            role: 'director_general',
          },
        },
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      // Record in user_roles table if user was created
      if (data.user) {
        try {
          await supabase.from('user_roles').insert([{
            user_id: data.user.id,
            email: email.trim(),
            full_name: fullName.trim(),
            role: 'director_general',
          }]);
        } catch {}

        const authUser: AuthUser = {
          id: data.user.id,
          name: fullName.trim(),
          email: email.trim(),
          role: 'admin',
          title: 'Founder & Director General',
          supabaseUid: data.user.id,
        };
        login('admin', authUser);
      }

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    setCurrentRole('public');
    setCurrentUser(null);
    localStorage.setItem('jsa_auth_role', 'public');
    localStorage.removeItem('jsa_auth_user');
  };

  const isAdmin = currentRole === 'admin';
  const isStaff = currentRole === 'admin' || currentRole === 'teacher';
  const isStudent = currentRole === 'student';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        login,
        signInWithSupabase,
        signUpDirectorGeneral,
        logout,
        isAdmin,
        isStaff,
        isStudent,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
