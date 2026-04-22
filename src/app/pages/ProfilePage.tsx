import { useAuth, User } from '../contexts/AuthContext';
import { useState } from 'react';
import { 
  User as UserIcon, Mail, History, Wallet, Globe, ShieldCheck, 
  CreditCard, Briefcase, ChevronLeft, Zap, Car, Clock, Trash2, Bed, Utensils 
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { BookingModal } from '../components/BookingModal';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const saveCard = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const num = formData.get('num') as string;
    if (num.length !== 16) return alert("ОШИБКА: НОМЕР КАРТЫ 16 ЦИФР");
    await updateUser({ ...user, savedCard: { number: num, exp: '01/29', cvc: '000' } });
    alert("КАРТА ПРИВЯЗАНА");
  };

  const getRoleName = (role: string = '') => {
    const r = role.toLowerCase();
    if (r === 'admin') return 'АДМИНИСТРАТОР СИСТЕМЫ';
    if (r === 'employee') return 'СОТРУДНИК ОТЕЛЯ';
    if (r === 'resident') return 'ПОСТОЯЛЕЦ DEEP BLUE';
    return 'ГОСТЬ';
  };

  return (
    <div className="min-h-screen bg-background pb-32 text-foreground font-sans uppercase">
      <div className="container mx-auto px-4 py-10 space-y-10">
        
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-all uppercase">
          <ChevronLeft size={16} /> НА ГЛАВНУЮ
        </button>

        {/* ШАПКА */}
        <div className="bg-card border border-border p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-center relative shadow-2xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
            <div className="w-32 h-32 bg-primary text-primary-foreground flex items-center justify-center text-6xl font-black">
              {user.fullName ? user.fullName[0] : 'U'}
            </div>
            <div className="text-center lg:text-left space-y-4 flex-1 min-w-0">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">{user.fullName || 'ПОЛЬЗОВАТЕЛЬ'}</h1>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <div className="px-6 py-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest">
                  {getRoleName(user.role)}
                </div>
                {user.subRole && (
                  <div className="px-6 py-2 border border-border text-foreground font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={14} /> {user.subRole}
                  </div>
                )}
              </div>
            </div>
            <div className="md:ml-auto bg-background p-8 border border-border min-w-[280px] text-center lg:text-right">
              <p className="text-[10px] text-muted-foreground font-black uppercase mb-2 tracking-[0.2em]">БАЛАНС СЧЕТА</p>
              <p className="text-5xl font-black tracking-tighter text-primary">{user.balance?.toLocaleString() || 0} <span className="text-xl opacity-50">₽</span></p>
            </div>
        </div>

        {/* СЕРВИСЫ */}
        <section className="space-y-8">
            <div className="flex items-center gap-6">
                <h2 className="text-3xl font-black uppercase tracking-tight">Мои сервисы</h2>
                <div className="h-[1px] flex-1 bg-border"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                <div className="bg-card border border-border p-8 space-y-6 bg-primary text-primary-foreground relative overflow-hidden">
                    <Zap className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
                    <p className="text-[10px] font-black opacity-80 tracking-widest uppercase">ПК Клуб / Часы</p>
                    <h4 className="text-5xl font-black tracking-tighter">{user.pcHours || 0} <span className="text-xl">Ч.</span></h4>
                </div>
                <div className="bg-card border border-border p-8 space-y-6 relative overflow-hidden">
                    <Car className="absolute -right-4 -top-4 w-32 h-32 text-foreground/5" />
                    <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Парковка</p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {user.parkingSpots?.length > 0 ? user.parkingSpots.map((s, i) => <span key={i} className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs">{s}</span>) : <p className="text-xl font-bold text-muted-foreground">НЕТ МЕСТ</p>}
                    </div>
                </div>
                <div className="bg-card border border-border p-8 space-y-6 relative overflow-hidden">
                    <Clock className="absolute -right-4 -top-4 w-32 h-32 text-foreground/5" />
                    <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Массаж</p>
                    <div className="space-y-3 relative z-10">
                        {user.massageSessions?.length > 0 ? user.massageSessions.map((s: any, i: number) => (
                            <div key={i} className="p-3 border border-border bg-background">
                                <p className="text-xs font-black text-primary">{s.date} — {s.time}</p>
                                <p className="text-[10px] font-bold mt-1 uppercase text-muted-foreground">МАСТЕР: {s.staff}</p>
                            </div>
                        )) : <p className="text-xl font-bold text-muted-foreground">НЕТ ЗАПИСЕЙ</p>}
                    </div>
                </div>
                <div className="bg-card border border-border p-8 space-y-6 relative overflow-hidden">
                    <Utensils className="absolute -right-4 -top-4 w-32 h-32 text-foreground/5" />
                    <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Питание</p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                        {user.diningAccess?.length > 0 ? user.diningAccess.map((s, i) => <span key={i} className="px-4 py-2 bg-foreground text-background font-bold text-xs uppercase">{s}</span>) : <p className="text-xl font-bold text-muted-foreground">НЕТ ПАКЕТОВ</p>}
                    </div>
                </div>
            </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <div className="bg-card border border-border p-10 space-y-8 shadow-sm">
                <h3 className="text-2xl font-black uppercase flex items-center gap-3"><CreditCard className="text-primary" /> Банковские карты</h3>
                {user.savedCard ? (
                    <div className="bg-background border border-border p-8 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground mb-2 uppercase tracking-widest">ПРИВЯЗАННАЯ КАРТА</p>
                            <p className="text-3xl font-black tracking-widest">**** **** **** {user.savedCard.number.slice(-4)}</p>
                        </div>
                        <button onClick={() => updateUser({...user, savedCard: undefined})} className="p-4 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"><Trash2 size={24}/></button>
                    </div>
                ) : (
                    <form onSubmit={saveCard} className="flex flex-col md:flex-row gap-4">
                        <input name="num" required maxLength={16} placeholder="НОМЕР КАРТЫ" className="flex-1 bg-background border border-border p-5 font-bold text-lg outline-none focus:border-primary text-foreground" />
                        <button type="submit" className="px-10 py-5 bg-primary text-primary-foreground font-black tracking-widest uppercase hover:opacity-90 transition-all">СОХРАНИТЬ</button>
                    </form>
                )}
              </div>

              <div className="bg-card border border-border p-10 space-y-8 shadow-sm">
                  <h3 className="text-2xl font-black uppercase flex items-center gap-3"><History className="text-primary" /> Журнал операций</h3>
                  <div className="space-y-3">
                    {user.history?.map((h: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-6 bg-background border border-border hover:border-primary/50 transition-all">
                        <div className="space-y-1">
                          <p className="font-black text-sm uppercase tracking-wide">{h.item}</p>
                          <p className="text-[10px] font-bold text-muted-foreground">{new Date(h.date).toLocaleString('ru-RU')}</p>
                        </div>
                        <p className={`text-xl font-black tracking-tighter ${h.price > 0 ? 'text-green-500' : 'text-foreground'}`}>
                          {h.price > 0 ? `+${h.price.toLocaleString()}` : h.price.toLocaleString()} ₽
                        </p>
                      </div>
                    ))}
                  </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <div className="bg-card border border-border p-10 space-y-8 border-t-4 border-t-primary shadow-sm">
                    <h3 className="text-2xl font-black uppercase flex items-center gap-3"><Wallet className="text-primary" size={24} /> КАССА</h3>
                    <div className="space-y-4">
                        <input type="number" value={topUpAmount} onChange={e => setTopUpAmount(e.target.value)} placeholder="0.00" className="w-full bg-background border border-border p-5 font-black text-2xl outline-none text-foreground focus:border-primary" />
                        <button onClick={() => setIsTopUpOpen(true)} className="w-full py-6 bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all">ВНЕСТИ СРЕДСТВА</button>
                    </div>
                </div>

                <div className="bg-card border border-border p-10 space-y-8 shadow-sm">
                    <h3 className="text-2xl font-black uppercase flex items-center gap-3"><Bed className="text-primary" size={24} /> ОТЕЛЬ</h3>
                    {user.room ? (
                        <div className="space-y-6">
                            <div className="p-8 bg-primary/10 border border-primary/20 text-center">
                                <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest">НОМЕР</p>
                                <p className="text-6xl font-black text-foreground">{user.room.number}</p>
                            </div>
                            <div className="space-y-2 text-center border-t border-border pt-6 text-foreground">
                                <p className="font-black text-sm uppercase tracking-widest text-primary">{user.room.type}</p>
                                <p className="font-bold text-[10px] text-muted-foreground">{user.room.checkIn} — {user.room.checkOut}</p>
                            </div>
                        </div>
                    ) : <p className="text-center font-bold text-muted-foreground py-12 text-xs tracking-widest uppercase">НЕТ БРОНИРОВАНИЙ</p>}
                </div>
            </div>
        </div>
      </div>
      {isTopUpOpen && <BookingModal type="topup" title="ПОПОЛНЕНИЕ СЧЕТА" price={Number(topUpAmount)} onClose={() => {setIsTopUpOpen(false); setTopUpAmount('')}} />}
    </div>
  );
}