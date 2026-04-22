import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

export function AuthModals({ isOpen, onClose, initialMode = 'login' }: any) {
  const [mode, setMode] = useState(initialMode);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [passport, setPassport] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({ fullName: '', dob: '', passport: '', email: '', password: '', country: 'РОССИЯ' });

  useEffect(() => { if (isOpen) setMode(initialMode); }, [isOpen, initialMode]);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(regData.passport)) return alert("ПАСПОРТ: 10 ЦИФР");
    
    await register(regData);
    const success = await login(regData.passport, regData.password);
    if (success) {
      onClose();
      navigate('/profile');
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const success = await login(passport, password);
    if (success) {
      onClose();
      navigate('/profile');
    } else alert('ОШИБКА ВХОДА');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 text-white uppercase">
      <div className="bg-[#0a0a0a] w-full max-w-md border border-white/10 p-10 animate-in zoom-in">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-black tracking-tighter">{mode === 'login' ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-primary"><X /></button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <input required placeholder="ПАСПОРТ" className="w-full bg-white/5 p-4 font-black outline-none border border-white/10 focus:border-primary" onChange={e => setPassport(e.target.value)} />
            <input required type="password" placeholder="ПАРОЛЬ" className="w-full bg-white/5 p-4 font-black outline-none border border-white/10 focus:border-primary" onChange={e => setPassword(e.target.value)} />
            <Button type="submit" className="w-full py-6 font-black tracking-widest">ВОЙТИ</Button>
            <button type="button" onClick={() => setMode('register')} className="w-full text-xs font-black text-primary tracking-widest">СОЗДАТЬ АККАУНТ</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input required placeholder="ФИО ПОЛНОСТЬЮ" className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, fullName: e.target.value.toUpperCase()})} />
            <div className="grid grid-cols-2 gap-2">
                <input required type="date" className="bg-white/5 p-4 font-black text-xs" onChange={e => setRegData({...regData, dob: e.target.value})} />
                <input required placeholder="СТРАНА" className="bg-white/5 p-4 font-black text-xs" onChange={e => setRegData({...regData, country: e.target.value.toUpperCase()})} />
            </div>
            <input required placeholder="ПАСПОРТ (10 ЦИФР)" maxLength={10} className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, passport: e.target.value})} />
            <input required placeholder="EMAIL" type="email" className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, email: e.target.value})} />
            <input required placeholder="ПАРОЛЬ" type="password" className="w-full bg-white/5 p-4 font-black text-sm" onChange={e => setRegData({...regData, password: e.target.value})} />
            <Button type="submit" className="w-full py-6 font-black tracking-widest">ЗАРЕГИСТРИРОВАТЬСЯ</Button>
          </form>
        )}
      </div>
    </div>
  );
}