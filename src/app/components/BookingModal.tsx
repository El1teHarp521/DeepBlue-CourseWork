import { X, CheckCircle2, AlertCircle, CreditCard, Lock, Fingerprint } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export function BookingModal({ title, type, price = 0, metadata, onClose }: any) {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<'verify' | 'success'>('verify');
  const [errorMsg, setErrorMsg] = useState('');
  const [useSavedCard, setUseSavedCard] = useState(!!user?.savedCard);

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

  const handlePayment = async (e: any) => {
    e.preventDefault();
    if (passInput !== user?.passport) return setErrorMsg("ПАСПОРТ НЕ ВЕРЕН");
    if (pinInput !== user?.password) return setErrorMsg("ПАРОЛЬ НЕ ВЕРЕН");
    if (!useSavedCard && cardNum.length < 16) return setErrorMsg("ПРОВЕРЬТЕ НОМЕР КАРТЫ");

    const updatedUser = { ...user! };
    
    // ЛОГИКА ДОКУПКИ СЕРВИСОВ
    if (type === 'service') {
        if (metadata.serviceId === 'gaming') updatedUser.pcHours = (updatedUser.pcHours || 0) + metadata.quantity;
        if (metadata.serviceId === 'parking') {
            const start = Math.floor(Math.random() * 900);
            const spots = Array.from({length: metadata.quantity}, (_, i) => `P-${start+i}`);
            updatedUser.parkingSpots = [...(updatedUser.parkingSpots || []), ...spots];
        }
        if (metadata.itemName === 'МАССАЖ') {
            updatedUser.massageSessions = [...(updatedUser.massageSessions || []), { staff: metadata.staff, date: metadata.date, time: metadata.time }];
        }
        if (metadata.serviceId === 'restaurant') {
            updatedUser.diningAccess = [...new Set([...(updatedUser.diningAccess || []), metadata.itemName])];
        }
        updatedUser.services = [...new Set([...(updatedUser.services || []), title.split(':')[0]])];
    }

    // ЛОГИКА НОМЕРА (БОНУСЫ)
    if (type === 'room') {
        const roomNum = (Math.floor(Math.random() * 100) + 300).toString();
        updatedUser.room = { number: roomNum, type: title, checkIn, checkOut };
        const bon = {
            'СТАНДАРТ': { s:['БАССЕЙН'], pc: 2, d:[] },
            'БИЗНЕС': { s:['БАССЕЙН'], pc: 8, d: ['ЗАВТРАК'] },
            'ЛЮКС': { s: ['БАССЕЙН + БАНИ'], pc: 12, d:['ЗАВТРАК', 'ОБЕД', 'УЖИН'] },
            'ПЕНТХАУС': { s:['ВСЕ ВКЛЮЧЕНО', 'ПАРКОВКА', 'ТЕРРАСА'], pc: 42, d:['ЗАВТРАК', 'ОБЕД', 'УЖИН'] }
        };
        const currentBon = bon[title.toUpperCase()];
        if (currentBon) {
            updatedUser.pcHours = (updatedUser.pcHours || 0) + currentBon.pc;
            updatedUser.services = [...new Set([...(updatedUser.services || []), ...currentBon.s])];
            updatedUser.diningAccess = [...new Set([...(updatedUser.diningAccess || []), ...currentBon.d])];
            if (title.toUpperCase() === 'ПЕНТХАУС') updatedUser.parkingSpots = [...(updatedUser.parkingSpots || []), 'VIP-01'];
        }
    }

    // ИСТОРИЯ
    if (type === 'topup') {
        updatedUser.balance += totalPrice;
        updatedUser.history = [{ id: Date.now(), date: new Date().toISOString(), item: 'ПОПОЛНЕНИЕ СЧЕТА', price: totalPrice }, ...updatedUser.history];
    } else {
        updatedUser.history = [
            { id: Date.now() + 1, date: new Date().toISOString(), item: `ОПЛАТА: ${title.toUpperCase()}`, price: -totalPrice },
            { id: Date.now(), date: new Date().toISOString(), item: `ВНЕСЕНИЕ СРЕДСТВ`, price: totalPrice },
            ...updatedUser.history
        ];
    }

    await updateUser(updatedUser);

    if (type !== 'topup') {
        await fetch('http://127.0.0.1:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                guestName: user?.fullName, 
                roomNumber: updatedUser.room?.number || '—', 
                roomType: title, 
                checkIn: checkIn || new Date().toLocaleDateString(), 
                checkOut: checkOut || new Date().toLocaleDateString(), 
                status: 'active' 
            })
        });
    }
    setStep('success');
  };

  if (step === 'success') return (
    <div className="fixed inset-0 z-[200] bg-background/95 flex items-center justify-center p-4 text-foreground">
      <div className="bg-card p-20 border border-border text-center space-y-8 shadow-2xl">
        <CheckCircle2 size={100} className="text-green-500 mx-auto" />
        <h2 className="text-5xl font-black uppercase tracking-widest">УСПЕШНО</h2>
        <button onClick={onClose} className="w-full bg-primary text-primary-foreground px-12 py-5 font-black uppercase tracking-widest hover:opacity-90">ЗАКРЫТЬ</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 text-foreground font-sans overflow-y-auto">
      <div className="bg-card w-full max-w-5xl border border-border shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 border-b border-border flex justify-between items-center bg-secondary/30">
            <h2 className="font-black uppercase tracking-[0.4em] text-xl">ПЛАТЕЖНЫЙ ТЕРМИНАЛ</h2>
            <button onClick={onClose} className="p-2 hover:text-destructive transition-all"><X size={32}/></button>
        </div>
        <form onSubmit={handlePayment} className="p-8 md:p-12 space-y-12">
            <div className="bg-secondary/30 p-8 border border-border flex flex-col md:flex-row justify-between md:items-end gap-6 relative">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <div className="pl-4">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">ОБЪЕКТ ОПЛАТЫ</p>
                   <p className="text-3xl font-black uppercase">{title}</p>
                </div>
                <div className="md:text-right pl-4 md:pl-0">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">СУММА ТРАНЗАКЦИИ</p>
                   <p className="text-6xl font-black tracking-tighter text-primary">{totalPrice.toLocaleString()} ₽</p>
                </div>
            </div>
            {errorMsg && <div className="p-4 bg-destructive/10 border-l-4 border-destructive text-destructive font-black uppercase text-sm">{errorMsg}</div>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-foreground">
                <div className="space-y-6">
                    <h3 className="font-black uppercase tracking-widest text-primary border-l-4 border-primary pl-4">ПРОВЕРКА</h3>
                    {type === 'room' && (
                        <div className="grid grid-cols-2 gap-4">
                            <input required type="date" className="w-full bg-background border border-border p-4 font-black uppercase text-xs text-foreground" onChange={e => setCheckIn(e.target.value)} />
                            <input required type="date" className="w-full bg-background border border-border p-4 font-black uppercase text-xs text-foreground" onChange={e => setCheckOut(e.target.value)} />
                        </div>
                    )}
                    <input required className="w-full bg-background border border-border p-4 font-black uppercase text-sm text-foreground outline-none" placeholder="ПАСПОРТ РФ" value={passInput} onChange={e => setPassInput(e.target.value)} />
                    <input required type="password" title="ПАРОЛЬ" className="w-full bg-background border border-border p-4 font-black text-sm text-foreground outline-none" placeholder="••••••••" value={pinInput} onChange={e => setPinInput(e.target.value)} />
                </div>
                <div className="space-y-6">
                    <h3 className="font-black uppercase tracking-widest text-primary border-l-4 border-primary pl-4">БАНКОВСКАЯ КАРТА</h3>
                    {user?.savedCard && (
                      <div className={`p-6 border transition-all cursor-pointer ${useSavedCard ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary/20 text-muted-foreground'}`} onClick={() => setUseSavedCard(true)}>
                         <p className="text-[10px] font-black uppercase mb-2">ПРИВЯЗАННАЯ КАРТА</p>
                         <p className="text-2xl font-black tracking-widest">**** {user.savedCard.number.slice(-4)}</p>
                         <button type="button" onClick={(e) => {e.stopPropagation(); setUseSavedCard(false)}} className="text-[10px] font-bold mt-2 underline">ВВЕСТИ ДРУГУЮ</button>
                      </div>
                    )}
                    <div className={`bg-secondary/30 p-8 border border-border space-y-6 transition-all ${useSavedCard ? 'opacity-30 pointer-events-none' : ''}`}>
                        <input required={!useSavedCard} maxLength={16} className="w-full bg-background border border-border p-4 font-black text-xl tracking-[0.2em] text-foreground outline-none" placeholder="0000 0000 0000 0000" value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g, ''))} />
                        <div className="grid grid-cols-2 gap-6">
                            <input required={!useSavedCard} maxLength={5} className="w-full bg-background border border-border p-4 font-black text-center text-lg text-foreground outline-none" placeholder="ММ/ГГ" value={cardExp} onChange={e => setCardExp(e.target.value)} />
                            <input required={!useSavedCard} maxLength={3} type="password" title="CVC" className="w-full bg-background border border-border p-4 font-black text-center text-lg text-foreground outline-none" placeholder="•••" value={cardCvc} onChange={e => setCardCvc(e.target.value.replace(/\D/g, ''))} />
                        </div>
                    </div>
                </div>
            </div>
            <button type="submit" className="w-full py-8 bg-primary text-primary-foreground font-black text-2xl uppercase tracking-[0.4em] hover:opacity-90 transition-all shadow-xl">ОПЛАТИТЬ</button>
        </form>
      </div>
    </div>
  );
}