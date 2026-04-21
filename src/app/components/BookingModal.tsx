import { X, CheckCircle2, AlertCircle, CreditCard, Lock, Fingerprint } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export function BookingModal({ title, type, price = 0, metadata, onClose }: any) {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<'verify' | 'success'>('verify');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(price);

  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [passInput, setPassInput] = useState('');
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    if (type === 'room' && checkIn && checkOut) {
      const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
      setTotalPrice(price * (days > 0 ? days : 1));
    } else { setTotalPrice(price); }
  }, [checkIn, checkOut, price, type]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput !== user?.passport) return setErrorMsg("ПАСПОРТ НЕ СОВПАДАЕТ");
    if (pinInput !== user?.password) return setErrorMsg("НЕВЕРНЫЙ ПАРОЛЬ");
    if (cardNum.length < 16) return setErrorMsg("НЕКОРРЕКТНАЯ КАРТА");

    const updatedUser = { ...user! };
    
    // ЛОГИКА ДОКУПКИ УСЛУГ
    if (type === 'service') {
        if (metadata.serviceId === 'gaming') updatedUser.pcHours += metadata.quantity;
        else if (metadata.serviceId === 'parking') {
            const start = Math.floor(Math.random() * 500) + 100;
            const spots = Array.from({length: metadata.quantity}, (_, i) => `P-${start + i}`);
            updatedUser.parkingSpots = [...(updatedUser.parkingSpots || []), ...spots];
        } else if (metadata.itemName === 'МАССАЖ') {
            updatedUser.massageSessions.push({ staff: metadata.staff, date: metadata.date, time: metadata.time });
        }
        updatedUser.services = [...new Set([...updatedUser.services, title.split(':')[0]])];
    }

    // ЛОГИКА БРОНИРОВАНИЯ НОМЕРА + НАЧИСЛЕНИЕ БОНУСОВ
    if (type === 'room') {
        const roomNum = (Math.floor(Math.random() * 100) + 300).toString();
        updatedUser.room = { number: title.includes('ПЕНТХАУС') ? 'ПЕНТХАУС' : roomNum, type: title };
        
        const bonuses: any = {
            'СТАНДАРТ': { s: ['БАССЕЙН'], pc: 2 },
            'БИЗНЕС': { s: ['БАССЕЙН', 'ЗАВТРАК'], pc: 8 },
            'ЛЮКС': { s: ['БАССЕЙН + БАНИ', 'ПОЛНЫЙ ПАНСИОН'], pc: 12 },
            'ПЕНТХАУС': { s: ['ВСЕ ВКЛЮЧЕНО', 'ПАРКОВКА', 'ТЕРРАСА'], pc: 42 }
        };

        const currentBonuses = bonuses[title.toUpperCase()];
        if (currentBonuses) {
            updatedUser.pcHours += currentBonuses.pc;
            updatedUser.services = [...new Set([...updatedUser.services, ...currentBonuses.s])];
            if (title.toUpperCase() === 'ПЕНТХАУС') updatedUser.parkingSpots.push('VIP-01');
        }
    }

    // Транзакция в истории (Зашли и вышли)
    updatedUser.history = [
        { id: Date.now() + 1, date: new Date().toISOString(), item: `ОПЛАТА: ${title.toUpperCase()}`, price: -totalPrice },
        { id: Date.now(), date: new Date().toISOString(), item: `ВНЕСЕНИЕ СРЕДСТВ (КАРТА)`, price: totalPrice },
        ...updatedUser.history
    ];

    await updateUser(updatedUser);

    if (type === 'room' || type === 'service') {
        await fetch('http://127.0.0.1:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guestName: user?.fullName, roomNumber: updatedUser.room?.number || '—', roomType: title, checkIn: checkIn || '—', checkOut: checkOut || '—', status: 'active' })
        });
    }

    setStep('success');
  };

  if (step === 'success') return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-4 font-sans text-white">
      <div className="bg-[#0a0a0a] p-20 border border-white/10 text-center space-y-10 shadow-2xl">
        <CheckCircle2 size={100} className="text-green-500 mx-auto" />
        <h2 className="text-5xl font-black uppercase tracking-widest">УСПЕШНО</h2>
        <p className="font-black uppercase opacity-40 text-xs tracking-[0.4em]">УСЛУГИ ДОБАВЛЕНЫ В ВАШ ПРОФИЛЬ</p>
        <button onClick={onClose} className="w-full bg-white text-black py-6 font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">ЗАКРЫТЬ</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 text-white font-sans overflow-y-auto">
      <div className="bg-[#0a0a0a] w-full max-w-5xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h2 className="font-black uppercase tracking-[0.5em] text-2xl">БАНКОВСКИЙ ТЕРМИНАЛ</h2>
            <button onClick={onClose} className="p-3 hover:bg-primary transition-all"><X size={28}/></button>
        </div>
        <form onSubmit={handlePayment} className="p-12 space-y-12">
            <div className="bg-white/5 p-10 border border-white/10 flex justify-between items-end relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <div className="min-w-0">
                   <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">ОБЪЕКТ ОПЛАТЫ</p>
                   <p className="text-3xl font-black uppercase truncate text-white">{title}</p>
                </div>
                <p className="text-6xl font-black text-white tracking-tighter">{totalPrice.toLocaleString()} ₽</p>
            </div>
            {errorMsg && <div className="p-6 bg-destructive text-white font-black uppercase text-sm text-center border-l-[12px] border-white/50 shadow-xl">{errorMsg}</div>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-10">
                    <h3 className="font-black uppercase tracking-[0.3em] text-primary border-l-4 border-primary pl-4">ИДЕНТИФИКАЦИЯ</h3>
                    {type === 'room' && (
                        <div className="grid grid-cols-2 gap-4">
                            <input required type="date" className="bg-white/5 border border-white/10 p-5 font-black uppercase text-xs" onChange={e => setCheckIn(e.target.value)} />
                            <input required type="date" className="bg-white/5 border border-white/10 p-5 font-black uppercase text-xs" onChange={e => setCheckOut(e.target.value)} />
                        </div>
                    )}
                    <input required className="w-full bg-white/5 border border-white/10 p-6 font-black uppercase text-base tracking-widest text-white outline-none" placeholder="ПАСПОРТ (10 ЦИФР)" value={passInput} onChange={e => setPassInput(e.target.value)} />
                    <input required type="password" className="w-full bg-white/5 border border-white/10 p-6 font-black text-base text-white outline-none" placeholder="ПАРОЛЬ АККАУНТА" value={pinInput} onChange={e => setPinInput(e.target.value)} />
                </div>
                <div className="space-y-10">
                    <h3 className="font-black uppercase tracking-[0.3em] text-primary border-l-4 border-primary pl-4">ДАННЫЕ КАРТЫ</h3>
                    <div className="bg-black p-12 border border-white/10 space-y-10 relative overflow-hidden">
                        <input required maxLength={16} className="w-full bg-transparent border-b-2 border-white/20 p-2 font-black text-3xl tracking-[0.2em] text-white outline-none focus:border-primary" placeholder="0000 0000 0000 0000" value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, ''))} />
                        <div className="grid grid-cols-2 gap-10">
                            <input required maxLength={5} className="bg-transparent border-b-2 border-white/20 p-2 font-black text-center text-xl outline-none" placeholder="ММ/ГГ" value={cardExp} onChange={e => setCardExp(e.target.value)} />
                            <input required maxLength={3} className="bg-transparent border-b-2 border-white/20 p-2 font-black text-center text-xl outline-none" placeholder="CVC" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, ''))} />
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" className="w-full py-12 bg-white text-black font-black text-3xl uppercase tracking-[0.5em] hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95">ПОДТВЕРДИТЬ ОПЛАТУ</button>
        </form>
      </div>
    </div>
  );
}