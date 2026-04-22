import { Sun, Moon, User, LogOut, Calendar, UserPlus, Users, Terminal, ShoppingBag, Eye, EyeOff, Briefcase } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthModals } from './AuthModals';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAccessibility, toggleAccessibility } = useAuth();
  const[showProfileMenu, setShowProfileMenu] = useState(false);
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' as 'login' | 'register' });
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  const isStaff = user?.role === 'employee' || user?.role === 'admin';
  const canRegister = user?.role === 'admin' || user?.subRole?.toLowerCase() === 'ресепшн' || user?.subRole?.toLowerCase() === 'администратор';

  return (
    <>
      <header className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary flex items-center justify-center font-black text-2xl text-primary-foreground">DB</div>
            <h1 className="text-foreground font-black text-2xl tracking-tighter hidden sm:block">DEEP BLUE</h1>
          </Link>

          <div className="flex items-center gap-2 md:gap-6">
            <button onClick={toggleAccessibility} className={`p-4 border-2 transition-all ${isAccessibility ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:bg-foreground hover:text-background'}`}>
              {isAccessibility ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>

            <button onClick={toggleTheme} className="p-4 border-2 border-border text-foreground hover:bg-foreground hover:text-background transition-all">
              {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
            </button>

            {!user ? (
              <div className="flex gap-2">
                <button onClick={() => setAuthModal({ open: true, mode: 'register' })} className="px-8 py-4 bg-primary text-primary-foreground font-black text-xs tracking-widest border-2 border-primary hover:bg-transparent hover:text-primary transition-all">РЕГИСТРАЦИЯ</button>
                <button onClick={() => setAuthModal({ open: true, mode: 'login' })} className="px-8 py-4 border-2 border-border text-foreground font-black text-xs tracking-widest hover:bg-foreground hover:text-background transition-all">ВХОД</button>
              </div>
            ) : (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-4 p-2 bg-card border-2 border-border hover:border-primary transition-all text-foreground">
                  <div className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground font-black text-lg">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block pr-4">
                    <p className="font-black text-xs tracking-widest leading-none mb-1">{user?.fullName?.split(' ')[0] || 'ГОСТЬ'}</p>
                    <p className="text-[9px] font-bold text-primary opacity-70 tracking-widest uppercase">{user?.subRole || user?.role || 'RESIDENT'}</p>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-4 w-80 bg-card border-2 border-border shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-4">
                    <div className="p-6 bg-foreground/5 border-b border-border mb-2 text-foreground">
                      <p className="font-black text-base mb-1 truncate">{user?.fullName || 'БЕЗ ИМЕНИ'}</p>
                      <p className="text-[10px] font-black text-primary tracking-[0.2em] mb-3">СТАТУС: {user?.role?.toUpperCase() || 'RESIDENT'}</p>
                      {user?.subRole && (
                        <p className="text-[10px] font-black text-green-600 flex items-center gap-2"><Briefcase size={12} /> {user.subRole.toUpperCase()}</p>
                      )}
                    </div>

                    <div className="space-y-1 text-foreground">
                      <Link to="/profile" className="flex items-center gap-4 p-4 hover:bg-primary hover:text-primary-foreground transition-all font-black text-[11px]" onClick={() => setShowProfileMenu(false)}><User size={18} /> ЛИЧНЫЙ КАБИНЕТ</Link>
                      {user?.role === 'resident' && <Link to="/" className="flex items-center gap-4 p-4 hover:bg-primary hover:text-primary-foreground transition-all font-black text-[11px]" onClick={() => setShowProfileMenu(false)}><ShoppingBag size={18} /> КУПИТЬ УСЛУГИ</Link>}
                      {isStaff && <Link to="/schedule" className="flex items-center gap-4 p-4 hover:bg-primary hover:text-primary-foreground transition-all font-black text-[11px]" onClick={() => setShowProfileMenu(false)}><Calendar size={18} /> РАСПИСАНИЕ</Link>}
                      {canRegister && <Link to="/register-guest" className="flex items-center gap-4 p-4 hover:bg-primary hover:text-primary-foreground transition-all font-black text-[11px]" onClick={() => setShowProfileMenu(false)}><UserPlus size={18} /> РЕГИСТРАЦИЯ</Link>}
                      {user?.role === 'admin' && (
                        <>
                          <div className="h-[2px] bg-border my-2" />
                          <Link to="/users" className="flex items-center gap-4 p-4 hover:bg-primary hover:text-primary-foreground transition-all font-black text-[11px]" onClick={() => setShowProfileMenu(false)}><Users size={18} /> АДМИН-ПАНЕЛЬ</Link>
                          <Link to="/api-docs" className="flex items-center gap-4 p-4 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all font-black text-[11px]" onClick={() => setShowProfileMenu(false)}><Terminal size={18} /> SWAGGER</Link>
                        </>
                      )}
                    </div>
                    
                    <button onClick={handleLogout} className="flex items-center gap-4 p-4 mt-4 border-t-2 border-border text-destructive hover:bg-destructive hover:text-white w-full font-black text-[11px] transition-all"><LogOut size={18} /> ЗАВЕРШИТЬ СЕАНС</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <AuthModals isOpen={authModal.open} onClose={() => setAuthModal({ ...authModal, open: false })} initialMode={authModal.mode} />
    </>
  );
}