import { Sun, Moon, User, LogOut, Home, Calendar, UserPlus, Users, Terminal, ShoppingBag } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthModals } from './AuthModals';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthorized } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [authModal, setAuthModal] = useState<{open: boolean, mode: 'login' | 'register'}>({open: false, mode: 'login'});
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  const isReceptionOrAdmin = user?.role === 'admin' || user?.subRole === 'reception' || user?.subRole === 'admin';

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/80 border-b border-border backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold">DB</span>
            </div>
            <h1 className="text-foreground font-black text-xl tracking-tighter hidden sm:block uppercase">Deep Blue</h1>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-2.5 rounded-xl hover:bg-secondary transition-colors mr-2">
              {theme === 'light' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-yellow-500" />}
            </button>

            {!isAuthorized ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setAuthModal({open: true, mode: 'register'})} 
                  className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Регистрация
                </button>
                <button 
                  onClick={() => setAuthModal({open: true, mode: 'login'})} 
                  className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-foreground hover:bg-secondary rounded-xl transition-all"
                >
                  Вход
                </button>
              </div>
            ) : (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2 p-1.5 pr-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-all border border-border">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground text-xs font-black">
                    {user.fullName.substring(0, 1)}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter hidden md:block">{user.fullName.split(' ')[0]}</span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-card border border-border rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-4 border-b border-border mb-2 bg-secondary/20">
                      <p className="font-black text-foreground truncate uppercase text-sm tracking-tight">{user.fullName}</p>
                      <p className="text-[9px] text-primary font-black uppercase mt-1 tracking-[0.2em] opacity-80">
                        {user.role === 'admin' ? 'SYSTEM / ADMINISTRATOR' : (user.subRole ? `STAFF / ${user.subRole}` : 'HOTEL RESIDENT')}
                      </p>
                      {user.role === 'resident' && (
                        <div className="mt-3 flex items-center justify-between">
                           <span className="text-[10px] font-black text-muted-foreground uppercase">Баланс:</span>
                           <span className="text-lg font-black text-green-500">{user.balance.toLocaleString()} ₽</span>
                        </div>
                      )}
                    </div>

                    <div className="px-2 space-y-1">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl transition-colors font-bold text-xs uppercase tracking-wider" onClick={() => setShowProfileMenu(false)}>
                        <User className="w-4 h-4 text-primary" /> Профиль
                      </Link>

                      {user.role === 'resident' && (
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl transition-colors font-bold text-xs uppercase tracking-wider" onClick={() => setShowProfileMenu(false)}>
                          <ShoppingBag className="w-4 h-4 text-primary" /> Сервисы отеля
                        </Link>
                      )}

                      {(user.role === 'employee' || user.role === 'admin') && (
                        <Link to="/schedule" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl transition-colors font-bold text-xs uppercase tracking-wider" onClick={() => setShowProfileMenu(false)}>
                          <Calendar className="w-4 h-4 text-primary" /> Расписание
                        </Link>
                      )}

                      {isReceptionOrAdmin && (
                        <Link to="/register-guest" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl transition-colors font-bold text-xs uppercase tracking-wider" onClick={() => setShowProfileMenu(false)}>
                          <UserPlus className="w-4 h-4 text-primary" /> Регистрация
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <>
                          <Link to="/users" className="flex items-center gap-3 px-4 py-3 hover:bg-secondary rounded-xl transition-colors font-bold text-xs uppercase tracking-wider" onClick={() => setShowProfileMenu(false)}>
                            <Users className="w-4 h-4 text-primary" /> Управление
                          </Link>
                          <Link to="/api-docs" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl transition-colors font-black text-xs uppercase tracking-[0.1em]" onClick={() => setShowProfileMenu(false)}>
                            <Terminal className="w-4 h-4" /> Swagger API
                          </Link>
                        </>
                      )}
                    </div>

                    <div className="border-t border-border mt-3 pt-3 px-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 w-full text-left text-destructive font-black text-xs uppercase tracking-widest rounded-xl transition-colors">
                        <LogOut className="w-4 h-4" /> Выйти
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModals 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({...authModal, open: false})} 
        initialMode={authModal.mode} 
      />
    </>
  );
}