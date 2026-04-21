import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export function AuthModals({ isOpen, onClose, initialMode = 'login' }: any) {
  const [mode, setMode] = useState(initialMode);
  const { login, register } = useAuth();
  const [passport, setPassport] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ fullName: '', dob: '', passport: '', email: '', password: '', country: 'Россия' });

  useEffect(() => { if (isOpen) setMode(initialMode); }, [isOpen, initialMode]);

  const validateRegistration = () => {
    if (regData.fullName.trim().split(' ').length < 2) return "ВВЕДИТЕ ФАМИЛИЮ И ИМЯ";
    if (!/^\d{10}$/.test(regData.passport)) return "ПАСПОРТ ДОЛЖЕН СОДЕРЖАТЬ 10 ЦИФР";
    if (regData.password.length < 6) return "ПАРОЛЬ МИНИМУМ 6 СИМВОЛОВ";
    if (!regData.email.includes('@')) return "НЕКОРРЕКТНЫЙ EMAIL";
    return null;
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const err = validateRegistration();
    if (err) return alert(err);
    await register(regData);
    alert('УСПЕХ! ТЕПЕРЬ ВОЙДИТЕ');
    setMode('login');
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const success = await login(passport, password);
    if (success) onClose(); else alert('ОШИБКА ВХОДА');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 text-white">
      <div className="bg-[#0a0a0a] w-full max-w-md border border-white/10 p-10 animate-in zoom-in">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">{mode === 'login' ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-primary"><X /></button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <input required placeholder="ПАСПОРТ (10 ЦИФР)" className="w-full bg-white/5 p-4 font-black outline-none border border-white/10 focus:border-primary" onChange={e => setPassport(e.target.value)} />
            <input required type="password" placeholder="ПАРОЛЬ" className="w-full bg-white/5 p-4 font-black outline-none border border-white/10 focus:border-primary" onChange={e => setPassword(e.target.value)} />
            <Button type="submit" className="w-full py-6 font-black uppercase tracking-widest">ВОЙТИ</Button>
            <button type="button" onClick={() => setMode('register')} className="w-full text-xs font-black uppercase text-primary tracking-widest">СОЗДАТЬ АККАУНТ</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input required placeholder="ФИО ПОЛНОСТЬЮ" className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, fullName: e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
                <input required type="date" className="bg-white/5 p-4 font-black text-xs" onChange={e => setRegData({...regData, dob: e.target.value})} />
                <input required placeholder="СТРАНА" className="bg-white/5 p-4 font-black text-xs" onChange={e => setRegData({...regData, country: e.target.value})} />
            </div>
            <input required placeholder="ПАСПОРТ (10 ЦИФР)" maxLength={10} className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, passport: e.target.value})} />
            <input required placeholder="EMAIL" type="email" className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, email: e.target.value})} />
            <input required placeholder="ПАРОЛЬ" type="password" className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, password: e.target.value})} />
            <Button type="submit" className="w-full py-6 font-black uppercase tracking-widest">ЗАРЕГИСТРИРОВАТЬСЯ</Button>
          </form>
        )}
      </div>
    </div>
  );
}