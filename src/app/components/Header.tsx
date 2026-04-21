import { 
  Sun, Moon, User, LogOut, Home, 
  Calendar, UserPlus, Users, Terminal, ShoppingBag, Briefcase, X 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthModals } from './AuthModals';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthorized } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' as 'login' | 'register' });
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  // ЛОГИКА ПРАВ ДОСТУПА НА ОСНОВЕ ПОД-РОЛЕЙ
  const isStaff = user?.role === 'employee' || user?.role === 'admin';
  
  // Регистрация доступна только админу, ресепшену или администратору отеля
  const canRegister = 
    user?.role === 'admin' || 
    user?.subRole?.toLowerCase() === 'ресепшн' || 
    user?.subRole?.toLowerCase() === 'администратор';

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-white/10 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* ЛОГОТИП */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary flex items-center justify-center font-black text-xl text-white transition-transform group-hover:rotate-90">
              DB
            </div>
            <h1 className="text-white font-black text-xl tracking-tighter uppercase hidden sm:block">
              DEEP BLUE
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {/* ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ */}
            <button 
              onClick={toggleTheme} 
              className="p-3 border border-white/10 hover:bg-white hover:text-black transition-all text-white"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {!isAuthorized ? (
              <div className="flex gap-1">
                <button 
                  onClick={() => setAuthModal({ open: true, mode: 'register' })} 
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-white hover:text-black transition-all border border-primary"
                >
                  РЕГИСТРАЦИЯ
                </button>
                <button 
                  onClick={() => setAuthModal({ open: true, mode: 'login' })} 
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white hover:text-black transition-all"
                >
                  ВХОД
                </button>
              </div>
            ) : (
              <div className="relative">
                {/* КНОПКА ПРОФИЛЯ */}
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)} 
                  className="flex items-center gap-4 p-2 bg-white/5 border border-white/10 hover:border-primary transition-all text-white"
                >
                  <div className="w-8 h-8 bg-primary flex items-center justify-center text-white font-black text-xs uppercase">
                    {user?.fullName?.substring(0, 1) || 'U'}
                  </div>
                  <div className="text-left hidden md:block pr-2">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                      {user?.fullName?.split(' ')[0]}
                    </p>
                    <p className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none">
                      {user?.role === 'admin' ? 'ADMIN' : (user?.subRole || user?.role)}
                    </p>
                  </div>
                </button>

                {/* ВЫПАДАЮЩЕЕ МЕНЮ (BRUTAL STYLE) */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#0d0d0d] border border-white/10 shadow-[20px_20px_0_0_rgba(0,0,0,1)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-6 bg-white/5 border-b border-white/10 mb-2">
                      <p className="font-black uppercase text-sm mb-1 truncate text-white">
                        {user?.fullName}
                      </p>
                      <div className="flex flex-col gap-1">
                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">
                          УРОВЕНЬ: {user?.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : user?.role?.toUpperCase()}
                        </p>
                        {user?.subRole && (
                          <p className="text-[8px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-1">
                            <Briefcase size={8} /> ДОЛЖНОСТЬ: {user.subRole.toUpperCase()}
                          </p>
                        )}
                      </div>
                      
                      {user?.role === 'resident' && (
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
                          <span className="text-[9px] font-black text-white/30 uppercase">БАЛАНС</span>
                          <span className="text-xl font-black text-white leading-none">{user.balance?.toLocaleString()} ₽</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-4 p-4 hover:bg-primary text-white transition-all text-[10px] font-black uppercase tracking-widest" 
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User size={16} /> ЛИЧНЫЙ КАБИНЕТ
                      </Link>

                      {user?.role === 'resident' && (
                        <Link 
                          to="/" 
                          className="flex items-center gap-4 p-4 hover:bg-primary text-white transition-all text-[10px] font-black uppercase tracking-widest" 
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <ShoppingBag size={16} /> СЕРВИСЫ ОТЕЛЯ
                        </Link>
                      )}

                      {isStaff && (
                        <Link 
                          to="/schedule" 
                          className="flex items-center gap-4 p-4 hover:bg-primary text-white transition-all text-[10px] font-black uppercase tracking-widest" 
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Calendar size={16} /> РАСПИСАНИЕ ЗАЕЗДОВ
                        </Link>
                      )}

                      {canRegister && (
                        <Link 
                          to="/register-guest" 
                          className="flex items-center gap-4 p-4 hover:bg-primary text-white transition-all text-[10px] font-black uppercase tracking-widest" 
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <UserPlus size={16} /> РЕГИСТРАЦИЯ ГОСТЯ
                        </Link>
                      )}

                      {user?.role === 'admin' && (
                        <>
                          <div className="h-[1px] bg-white/10 my-2 mx-4" />
                          <Link 
                            to="/users" 
                            className="flex items-center gap-4 p-4 hover:bg-primary text-white transition-all text-[10px] font-black uppercase tracking-widest" 
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Users size={16} /> УПРАВЛЕНИЕ БАЗОЙ
                          </Link>
                          <Link 
                            to="/api-docs" 
                            className="flex items-center gap-4 p-4 bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-black uppercase tracking-widest" 
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <Terminal size={16} /> SWAGGER API
                          </Link>
                        </>
                      )}
                    </div>

                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-4 p-4 mt-2 border-t border-white/10 text-destructive hover:bg-destructive hover:text-white w-full text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <LogOut size={16} /> ЗАВЕРШИТЬ СЕАНС
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* МОДАЛКИ АВТОРИЗАЦИИ */}
      <AuthModals 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({ ...authModal, open: false })} 
        initialMode={authModal.mode} 
      />
    </>
  );
}