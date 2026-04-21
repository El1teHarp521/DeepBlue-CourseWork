import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Описание типов данных
export type UserRole = 'guest' | 'resident' | 'employee' | 'admin';
export type EmployeeSubRole = 'maid' | 'valet' | 'bellman' | 'masseur' | 'chef' | 'waiter' | 'bartender' | 'reception' | 'admin';

export interface User {
  id: string;
  fullName: string;
  dob: string;
  passport: string;
  email: string;
  password?: string;
  country: string;
  role: UserRole;
  subRole?: EmployeeSubRole;
  balance: number;
  history: Array<{ id: number; date: string; item: string; price: number }>;
  room?: { number: string; type: string };
  services: string[];
}

interface AuthContextType {
  user: User | null;
  register: (data: Omit<User, 'id' | 'role' | 'balance' | 'history' | 'services'>) => Promise<void>;
  login: (passport: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3000/api/users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('db-active-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      refreshUserData();
    }
  }, []);

  const refreshUserData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/${user.id}`);
      if (response.ok) {
        const freshData = await response.json();
        setUser(freshData);
        localStorage.setItem('db-active-user', JSON.stringify(freshData));
      }
    } catch (error) {
      console.error("Ошибка синхронизации с бэкендом:", error);
    }
  };

  // РЕГИСТРАЦИЯ
  const register = async (data: any) => {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      throw error;
    }
  };

  // ВХОД
  const login = async (passport: string, password: string) => {
    try {
      const response = await fetch(API_URL);
      const users: User[] = await response.json();
      
      const found = users.find(u => u.passport === passport && u.password === password);
      
      if (found) {
        setUser(found);
        localStorage.setItem('db-active-user', JSON.stringify(found));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Ошибка входа:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('db-active-user');
  };

  const updateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`${API_URL}/${updatedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('db-active-user', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Ошибка обновления данных:", error);
    }
  };

  const isAuthorized = user !== null;

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser, refreshUserData, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}