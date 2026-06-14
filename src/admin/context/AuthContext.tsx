import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usersDB, session, AdminUser, initDatabase } from '../db/database';

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<AdminUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initDatabase();
    const currentSession = session.get();
    if (currentSession) {
      const foundUser = usersDB.findById(currentSession.userId);
      if (foundUser) setUser(foundUser);
      else session.clear();
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 600));

    const foundUser = usersDB.findByEmail(email);
    if (!foundUser) {
      return { success: false, error: 'No account found with this email address.' };
    }
    if (foundUser.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    session.set(foundUser.id);
    setUser(foundUser);
    return { success: true };
  };

  const logout = () => {
    session.clear();
    setUser(null);
  };

  const updateUser = (updates: Partial<AdminUser>) => {
    if (!user) return;
    const updated = usersDB.update(user.id, updates);
    if (updated) setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
