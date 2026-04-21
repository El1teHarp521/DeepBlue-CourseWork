import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, Clock, User, ShieldCheck, AlertTriangle } from 'lucide-react';
import { BookingModal } from '../components/BookingModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';

import rest1 from '@/assets/images/service-restaurant-1.jpg';
import rest2 from '@/assets/images/service-restaurant-2.jpg';
import rest3 from '@/assets/images/service-restaurant-3.jpg';
import spa1 from '@/assets/images/service-spa-1.jpg';
import spa2 from '@/assets/images/service-spa-2.jpg';
import spa3 from '@/assets/images/service-spa-3.jpg';
import staff1 from '@/assets/images/staff-massage-1.jpg';
import staff2 from '@/assets/images/staff-massage-2.jpg';
import staff3 from '@/assets/images/staff-massage-3.jpg';
import park1 from '@/assets/images/service-parking-1.jpg';
import park2 from '@/assets/images/service-parking-2.jpg';
import game1 from '@/assets/images/service-gaming-1.jpg';
import game2 from '@/assets/images/service-gaming-2.jpg';

const ASSETS: any = {
  restaurant: { imgs: [rest1, rest2, rest3] },
  spa: { imgs: [spa1, spa2, spa3], staff: [{n: 'АННА', img: staff1}, {n: 'МАРИЯ', img: staff2}, {n: 'ИГОРЬ', img: staff3}] },
  parking: { imgs: [park1, park2] },
  gaming: { imgs: [game1, game2] }
};

export function ServiceDetailPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [staff, setStaff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:30');

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/services`).then(res => res.json()).then(data => {
      const found = data.find((s: any) => s.id === serviceId);
      setService(found);
      if (found?.items) setSelectedItem(found.items[0]);
    });
  }, [serviceId]);

  if (!service) return <div className="min-h-screen bg-black" />;

  const baseAssets = ASSETS[service.id];
  const finalPrice = service.items ? selectedItem?.price : (service.pricePerItem * quantity);

  // Валидация времени и переход к оплате
  const handleOpenPayment = () => {
    if (selectedItem?.name === 'МАССАЖ') {
      if (!staff) return alert("ВЫБЕРИТЕ СПЕЦИАЛИСТА");
      if (!date) return alert("ВЫБЕРИТЕ ДАТУ СЕАНСА");
      
      const [hours, minutes] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const minLimit = 14 * 60 + 30;
      const maxLimit = 18 * 60;

      if (totalMinutes < minLimit || totalMinutes > maxLimit) {
        alert("ОШИБКА: ЗАПИСЬ ВОЗМОЖНА ТОЛЬКО В ИНТЕРВАЛЕ С 14:30 ДО 18:00");
        return;
      }
    }
    setIsPayOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 selection:bg-primary">
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
          <ChevronLeft size={14} /> НАЗАД В МЕНЮ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12 min-w-0">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none border-l-8 border-primary pl-8">
              {service.title}
            </h1>
            
            <Carousel className="w-full border border-white/10 shadow-2xl">
              <CarouselContent>
                {baseAssets.imgs.map((img: any, i: number) => (
                  <CarouselItem key={i}>
                    <img src={img} className="w-full h-[50vh] md:h-[65vh] object-cover" alt="Service" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-black/80 hover:bg-primary border-none" />
              <CarouselNext className="right-4 bg-black/80 hover:bg-primary border-none" />
            </Carousel>

            <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 space-y-12 shadow-xl">
              <h3 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 italic underline decoration-primary decoration-4">
                <Clock className="text-primary" /> ТАРИФНЫЙ ПЛАН
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.items ? service.items.map((item: any, i: number) => (
                  <div key={i} onClick={() => setSelectedItem(item)} className={`p-8 border-2 transition-all cursor-pointer relative overflow-hidden ${selectedItem?.name === item.name ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                    {selectedItem?.name === item.name && <div className="absolute top-0 right-0 w-8 h-8 bg-primary flex items-center justify-center font-black text-[10px]">OK</div>}
                    <p className="font-black text-sm uppercase tracking-widest">{item.name}</p>
                    <p className="text-[10px] opacity-40 mt-1 font-bold">РАБОЧИЕ ЧАСЫ: {item.time}</p>
                    <p className="text-3xl font-black mt-8 text-white">{item.price === 0 ? '0' : item.price.toLocaleString()} ₽</p>
                  </div>
                )) : (
                  <div className="col-span-2 space-y-8 bg-white/5 p-10 border border-white/5">
                    <p className="font-black uppercase text-2xl tracking-tight">ФИКСИРОВАННЫЙ ТАРИФ: <span className="text-primary">{service.pricePerItem} ₽</span></p>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black opacity-30 uppercase tracking-[0.2em]">ВЫБЕРИТЕ КОЛИЧЕСТВО ({service.id === 'parking' ? 'МЕСТ' : 'ЧАСОВ'})</label>
                       <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full bg-black border border-white/20 p-6 font-black text-2xl outline-none focus:border-primary transition-all" />
                    </div>
                  </div>
                )}
              </div>

              {/* СПЕЦИАЛЬНЫЙ БЛОК ДЛЯ МАССАЖА */}
              {selectedItem?.name === 'МАССАЖ' && (
                <div className="space-y-10 pt-10 border-t border-white/10 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-black uppercase tracking-widest text-primary italic">ЗАПИСЬ К СПЕЦИАЛИСТУ</h4>
                    <div className="bg-destructive/20 text-destructive border border-destructive/30 px-4 py-2 text-[10px] font-black uppercase">ИНТЕРВАЛ: 14:30 — 18:00</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {baseAssets.staff.map((s: any, i: number) => (
                      <div key={i} onClick={() => setStaff(s.n)} className={`p-4 border-2 transition-all cursor-pointer text-center space-y-4 relative ${staff === s.n ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}>
                        <img src={s.img} className="w-full h-48 object-cover border border-white/10" alt={s.n} />
                        <p className="text-xs font-black uppercase tracking-widest">{s.n}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">ДАТА ПОСЕЩЕНИЯ</label>
                        <input type="date" className="w-full bg-white/5 p-5 border border-white/10 font-black text-sm uppercase outline-none focus:border-primary" onChange={e => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black opacity-30 uppercase tracking-widest">ВРЕМЯ (14:30 - 18:00)</label>
                        <input type="time" min="14:30" max="18:00" className="w-full bg-white/5 p-5 border border-white/10 font-black text-sm outline-none focus:border-primary" value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* КАРТОЧКА ОПЛАТЫ */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-[#0d0d0d] border border-white/10 p-10 space-y-10 border-t-[12px] border-t-primary shadow-2xl relative overflow-hidden">
              <ShieldCheck className="absolute -right-4 -top-4 w-20 h-20 opacity-5" />
              <div className="space-y-4 relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">ИТОГО К СПИСАНИЮ</p>
                <div className="text-7xl font-black text-white tracking-tighter">
                  {finalPrice.toLocaleString()} <span className="text-2xl opacity-20">₽</span>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <button onClick={handleOpenPayment} className="w-full bg-white text-black py-8 font-black text-xl uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95">
                  ДОКУПИТЬ
                </button>
                <p className="text-[9px] text-center font-black uppercase text-white opacity-20 tracking-widest">ТРАНЗАКЦИЯ ПРОВОДИТСЯ ЧЕРЕЗ ТЕРМИНАЛ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPayOpen && (
        <BookingModal 
          title={`${service.title}: ${selectedItem?.name || 'БРОНЬ'}`} 
          type="service" 
          price={finalPrice} 
          metadata={{ 
            serviceId: service.id, 
            itemName: selectedItem?.name, 
            quantity, 
            staff, 
            date: date ? new Date(date).toLocaleDateString('ru-RU') : '', 
            time 
          }}
          onClose={() => setIsPayOpen(false)} 
        />
      )}
    </div>
  );
}