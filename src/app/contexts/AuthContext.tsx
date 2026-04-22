import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'guest' | 'resident' | 'employee' | 'admin';

export interface User {
  id: string;
  fullName: string;
  dob: string;
  passport: string;
  email: string;
  password?: string;
  country: string;
  role: UserRole;
  subRole?: string;
  balance: number;
  history: Array<{ id: number; date: string; item: string; price: number }>;
  room?: { number: string; type: string; checkIn: string; checkOut: string };
  services: string[];
  pcHours: number;
  parkingSpots: string[];
  massageSessions: Array<{ staff: string; date: string; time: string }>;
  diningAccess: string[];
  savedCard?: { number: string; exp: string; cvc: string };
}

interface AuthContextType {
  user: User | null;
  isAccessibility: boolean;
  toggleAccessibility: () => void;
  register: (data: any) => Promise<void>;
  login: (passport: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
  refreshUserData: () => Promise<void>;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = 'http://127.0.0.1:3000/api/users';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('db-active-user');
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });

  const [isAccessibility, setIsAccessibility] = useState(() => localStorage.getItem('db-access') === 'true');

  // Управление режимом для слабовидящих
  useEffect(() => {
    if (isAccessibility) {
      document.documentElement.classList.add('accessibility-mode');
    } else {
      document.documentElement.classList.remove('accessibility-mode');
    }
    localStorage.setItem('db-access', isAccessibility.toString());
  }, [isAccessibility]);

  // Синхронизация при загрузке
  useEffect(() => { 
    if (user) refreshUserData(); 
  }, []);

  const refreshUserData = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`${API_URL}/${user.id}`);
      if (res.ok) {
        const freshData = await res.json();
        setUser(freshData);
        localStorage.setItem('db-active-user', JSON.stringify(freshData));
      }
    } catch (e) { 
      console.error("Ошибка обновления данных:", e); 
    }
  };

  const register = async (data: any) => {
    try {
      await fetch(API_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(data) 
      });
    } catch (e) {
      console.error("Ошибка регистрации:", e);
    }
  };

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
    } catch (e) {
      console.error("Ошибка входа:", e);
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
        body: JSON.stringify(updatedUser)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('db-active-user', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
    }
  };

  const isAuthorized = user !== null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAccessibility, 
      toggleAccessibility: () => setIsAccessibility(!isAccessibility), 
      register, 
      login, 
      logout, 
      updateUser, 
      refreshUserData, 
      isAuthorized 
    }}>
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