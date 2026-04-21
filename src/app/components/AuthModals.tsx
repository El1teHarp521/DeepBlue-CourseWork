import { useState, useEffect } from 'react';
import { X, Lock, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export function AuthModals({ isOpen, onClose, initialMode = 'login' }: any) {
  const [mode, setMode] = useState(initialMode);
  const { login, register } = useAuth();
  const [passport, setPassport] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ fullName: '', dob: '', passport: '', email: '', password: '', country: 'Россия' });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const success = await login(passport, password);
    if (success) onClose(); else alert('Ошибка входа! Проверьте паспорт и пароль.');
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      await register(regData);
      alert('Регистрация успешна! Теперь войдите в систему.');
      setMode('login');
    } catch (err) {
      alert('Ошибка при регистрации.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl p-8 border border-border animate-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors"><X /></button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Паспортные данные</label>
              <input required value={passport} onChange={e => setPassport(e.target.value)} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-bold" placeholder="0000 000000" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Пароль</label>
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-bold" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 mt-4">Войти</Button>
            <div className="text-center pt-2">
               <span className="text-sm text-muted-foreground">Нет аккаунта? </span>
               <button type="button" onClick={() => setMode('register')} className="text-sm text-primary font-black uppercase tracking-widest hover:underline">Создать</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              <input required placeholder="ФИО полностью" onChange={e => setRegData({...regData, fullName: e.target.value})} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none font-bold" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" title="Дата рождения" onChange={e => setRegData({...regData, dob: e.target.value})} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none font-bold" />
                <input required placeholder="Страна" onChange={e => setRegData({...regData, country: e.target.value})} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none font-bold" />
              </div>
              <input required placeholder="Серия и номер паспорта" onChange={e => setRegData({...regData, passport: e.target.value})} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none font-bold" />
              <input required type="email" placeholder="Электронная почта" onChange={e => setRegData({...regData, email: e.target.value})} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none font-bold" />
              <input required type="password" placeholder="Придумайте пароль" onChange={e => setRegData({...regData, password: e.target.value})} className="w-full px-5 py-3 bg-secondary rounded-xl outline-none font-bold" />
            </div>
            <Button type="submit" className="w-full h-14 mt-6 font-black uppercase tracking-widest shadow-xl shadow-primary/20">Зарегистрироваться</Button>
            <div className="text-center pt-4 border-t border-border mt-4">
               <span className="text-sm text-muted-foreground">Вы постоялец? </span>
               <button type="button" onClick={() => setMode('login')} className="text-sm text-primary font-black uppercase tracking-widest hover:underline">Войти</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}