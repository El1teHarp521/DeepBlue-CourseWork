import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { 
  User as UserIcon, Mail, History, Wallet, Globe, ShieldCheck, 
  Plus, CreditCard, Briefcase, ChevronLeft, Zap, Car, Clock, Star 
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { BookingModal } from '../components/BookingModal';

export function ProfilePage() {
  const { user } = useAuth();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black pb-32 text-white font-sans">
      <div className="container mx-auto px-4 py-12 space-y-16">
        
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
          <ChevronLeft size={14} /> НА ГЛАВНУЮ
        </button>

        {/* ШАПКА */}
        <div className="bg-[#0a0a0a] border border-white/10 p-12 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
            <div className="w-40 h-40 bg-white flex items-center justify-center text-black text-6xl font-black">{user.fullName?.substring(0, 1)}</div>
            <div className="text-center md:text-left space-y-4">
              <h1 className="text-6xl font-black uppercase tracking-tighter">{user.fullName}</h1>
              <div className="flex gap-4">
                <div className="px-6 py-2 bg-primary text-white font-black text-[10px] uppercase tracking-widest">{user.role}</div>
                {user.subRole && <div className="px-6 py-2 border border-white/20 text-white font-black text-[10px] uppercase tracking-widest">{user.subRole}</div>}
              </div>
            </div>
            <div className="md:ml-auto text-right bg-white/5 p-8 border border-white/10 min-w-[280px]">
              <p className="text-[10px] text-white/30 font-black uppercase mb-2">БАЛАНС СЧЕТА</p>
              <p className="text-5xl font-black tracking-tighter">{user.balance?.toLocaleString()} ₽</p>
            </div>
        </div>
        <section className="space-y-10">
            <div className="flex items-center gap-6">
                <h2 className="text-4xl font-black uppercase tracking-tighter">ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ</h2>
                <div className="h-[2px] flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* ПК КЛУБ */}
                <div className="bg-[#0a0a0a] border border-white/10 p-10 space-y-6 relative overflow-hidden group">
                    <Zap className="absolute -right-4 -top-4 w-24 h-24 opacity-5 group-hover:text-primary transition-all" />
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">ПК КЛУБ / ДОСТУП</p>
                    <h4 className="text-5xl font-black tracking-tighter">{user.pcHours || 0} <span className="text-lg opacity-30">ЧАСОВ</span></h4>
                    <p className="text-[9px] font-bold opacity-40 uppercase leading-relaxed">ВРЕМЯ СУММИРУЕТСЯ ПРИ КАЖДОЙ ПОКУПКЕ И БРОНИРОВАНИИ НОМЕРА</p>
                </div>

                {/* ПАРКОВКА */}
                <div className="bg-[#0a0a0a] border border-white/10 p-10 space-y-6 relative overflow-hidden group">
                    <Car className="absolute -right-4 -top-4 w-24 h-24 opacity-5 group-hover:text-primary transition-all" />
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">ПАРКОВКА / МЕСТА</p>
                    <div className="flex flex-wrap gap-2">
                        {user.parkingSpots?.length > 0 ? user.parkingSpots.map((spot: string, i: number) => (
                            <span key={i} className="px-4 py-2 bg-primary text-white font-black text-xs">{spot}</span>
                        )) : <p className="text-xl font-black opacity-20">МЕСТ НЕТ</p>}
                    </div>
                    <p className="text-[9px] font-bold opacity-40 uppercase leading-relaxed">ВАШИ ЗАРЕЗЕРВИРОВАННЫЕ МЕСТА НА КРУГЛОСУТОЧНОМ ПАРКИНГЕ</p>
                </div>

                {/* МАССАЖ */}
                <div className="bg-[#0a0a0a] border border-white/10 p-10 space-y-6 relative overflow-hidden group">
                    <Clock className="absolute -right-4 -top-4 w-24 h-24 opacity-5 group-hover:text-primary transition-all" />
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">ЗАПИСИ НА МАССАЖ</p>
                    <div className="space-y-4">
                        {user.massageSessions?.length > 0 ? user.massageSessions.map((s: any, i: number) => (
                            <div key={i} className="bg-white/5 p-4 border border-white/5">
                                <p className="text-[10px] font-black uppercase text-primary">{s.date} @ {s.time}</p>
                                <p className="text-xs font-bold mt-1 uppercase">МАСТЕР: {s.staff}</p>
                            </div>
                        )) : <p className="text-xl font-black opacity-20">ЗАПИСЕЙ НЕТ</p>}
                    </div>
                </div>
            </div>

            {/* ПРОЧИЕ УСЛУГИ */}
            <div className="bg-[#0a0a0a] border border-white/10 p-10">
                <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-6 italic">АКТИВИРОВАННЫЕ СЕРВИСЫ</p>
                <div className="flex flex-wrap gap-4">
                    {user.services?.map((s: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 font-black text-[10px] uppercase tracking-widest">
                            <Star size={12} className="text-primary fill-primary" /> {s}
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10 border-t border-white/10">
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-[#0a0a0a] border border-white/10 p-10 space-y-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter border-b border-white/10 pb-6">ПЕРСОНАЛЬНЫЕ ДАННЫЕ</h3>
                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-1">
                        <p className="text-[9px] opacity-30 font-black uppercase tracking-widest">СТРАНА</p>
                        <p className="font-black uppercase">{user.country}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] opacity-30 font-black uppercase tracking-widest">ПАСПОРТ</p>
                        <p className="font-black uppercase">{user.passport}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] opacity-30 font-black uppercase tracking-widest">ПОЧТА</p>
                        <p className="font-black uppercase">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] opacity-30 font-black uppercase tracking-widest">ДАТА РОЖДЕНИЯ</p>
                        <p className="font-black uppercase">{user.dob}</p>
                    </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 p-10 space-y-10 shadow-xl">
                  <h3 className="text-2xl font-black uppercase tracking-tighter border-b border-white/10 pb-6 flex items-center gap-4">
                    <History size={24} className="text-primary" /> ЖУРНАЛ ОПЕРАЦИЙ
                  </h3>
                  <div className="space-y-4">
                    {user.history.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-6 bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                        <div className="space-y-1">
                          <p className="font-black text-xs uppercase tracking-widest">{item.item}</p>
                          <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">{new Date(item.date).toLocaleString('ru-RU')}</p>
                        </div>
                        <p className={`text-xl font-black tracking-tighter ${item.price > 0 ? 'text-green-500' : 'text-white'}`}>
                          {item.price > 0 ? `+${item.price.toLocaleString()}` : item.price.toLocaleString()} ₽
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-10">
                <div className="bg-[#0a0a0a] border border-white/10 p-10 space-y-10 border-t-[10px] border-t-primary">
                    <h3 className="text-xl font-black uppercase tracking-tighter">КАССА ОТЕЛЯ</h3>
                    <div className="space-y-6">
                        <input type="number" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/5 border border-white/10 p-6 font-black text-3xl outline-none" />
                        <button onClick={() => setIsTopUpOpen(true)} className="w-full py-8 bg-white text-black font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">ВНЕСТИ СРЕДСТВА</button>
                    </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-10 space-y-10">
                    <h3 className="text-xl font-black uppercase tracking-tighter">ПРОЖИВАНИЕ</h3>
                    <div className="space-y-4">
                        <div className="p-8 bg-primary/10 border border-primary/20 text-center">
                            <p className="text-[10px] font-black text-primary uppercase mb-2">НОМЕР</p>
                            <p className="text-5xl font-black">{user.room?.number || '—'}</p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 text-center">
                            <p className="font-black uppercase text-xs">{user.room?.type || 'ОЖИДАНИЕ'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {isTopUpOpen && <BookingModal type="topup" price={Number(topUpAmount)} onClose={() => {setIsTopUpOpen(false); setTopUpAmount('')}} />}
    </div>
  );
}