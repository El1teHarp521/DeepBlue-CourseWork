import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Monitor, Cpu, Zap, HardDrive } from 'lucide-react';
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
  restaurant: { imgs:[rest1, rest2, rest3] },
  spa: { imgs: [spa1, spa2, spa3], staff:[{n: 'АННА', img: staff1}, {n: 'МАРИЯ', img: staff2}, {n: 'ИГОРЬ', img: staff3}] },
  parking: { imgs:[park1, park2] },
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

  if (!service) return <div className="min-h-screen bg-background" />;

  const baseAssets = ASSETS[service.id];
  const finalPrice = service.items ? selectedItem?.price : (service.pricePerItem * quantity);

  const handleOpenPayment = () => {
    if (selectedItem?.name === 'МАССАЖ') {
      if (!staff || !date) return alert("ВЫБЕРИТЕ МАСТЕРА И ДАТУ");
      const [hours] = time.split(':').map(Number);
      if (hours < 14 || hours >= 18) return alert("ЗАПИСЬ ТОЛЬКО С 14:30 ДО 18:00");
    }
    setIsPayOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 uppercase">
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-10 text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary transition-all">
          <ChevronLeft size={14} /> НАЗАД В МЕНЮ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none border-l-8 border-primary pl-8">{service.title}</h1>
            
            <Carousel className="w-full border border-border shadow-2xl">
              <CarouselContent>
                {baseAssets.imgs.map((img: any, i: number) => (
                  <CarouselItem key={i}><img src={img} className="w-full h-[50vh] md:h-[65vh] object-cover" /></CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-background/80" /><CarouselNext className="right-4 bg-background/80" />
            </Carousel>

            {service.id === 'gaming' && (
              <div className="bg-card border-2 border-primary p-10 space-y-10 shadow-[10px_10px_0_0_rgba(37,99,235,0.1)]">
                <h3 className="text-3xl font-black tracking-tight flex items-center gap-4">
                  <Monitor className="text-primary" size={32} /> ХАРАКТЕРИСТИКИ ПК
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex items-center gap-4 bg-background p-6 border border-border">
                      <Zap className="text-primary" />
                      <div>
                        <p className="text-[10px] font-black opacity-40">ВИДЕОКАРТА</p>
                        <p className="font-black text-lg">RTX 5090</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-background p-6 border border-border">
                      <Cpu className="text-primary" />
                      <div>
                        <p className="text-[10px] font-black opacity-40">ПРОЦЕССОР</p>
                        <p className="font-black text-lg">AMD RYZEN 9 9950X3D2</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-background p-6 border border-border">
                      <Monitor className="text-primary" />
                      <div>
                        <p className="text-[10px] font-black opacity-40">RAM</p>
                        <p className="font-black text-lg">256 GB DDR5</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 bg-background p-6 border border-border">
                      <HardDrive className="text-primary" />
                      <div>
                        <p className="text-[10px] font-black opacity-40">ПАМЯТЬ</p>
                        <p className="font-black text-lg">NVME 8 TB GEN5</p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            <div className="bg-card border border-border p-8 md:p-12 space-y-12 shadow-lg">
              <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 border-b border-border pb-4">
                <Clock className="text-primary" /> ТАРИФЫ И ВРЕМЯ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.items ? service.items.map((item: any, i: number) => (
                  <div key={i} onClick={() => setSelectedItem(item)} className={`p-8 border-2 transition-all cursor-pointer relative ${selectedItem?.name === item.name ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30 hover:border-foreground/30'}`}>
                    <p className="font-black text-sm uppercase tracking-widest">{item.name}</p>
                    <p className="text-[10px] opacity-60 mt-1 font-bold">{item.time}</p>
                    <p className="text-3xl font-black mt-8">{item.price === 0 ? 'БЕСПЛАТНО' : `${item.price.toLocaleString()} ₽`}</p>
                  </div>
                )) : (
                  <div className="col-span-2 space-y-8 bg-secondary/30 p-10 border border-border">
                    <p className="font-black uppercase text-2xl tracking-tight">ТАРИФ: <span className="text-primary">{service.pricePerItem} ₽</span></p>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">ВЫБЕРИТЕ КОЛИЧЕСТВО ({service.id === 'parking' ? 'МЕСТ' : 'ЧАСОВ'})</label>
                       <input type="number" min="1" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full bg-background border border-border p-6 font-black text-2xl outline-none focus:border-primary text-foreground" />
                    </div>
                  </div>
                )}
              </div>

              {selectedItem?.name === 'МАССАЖ' && (
                <div className="space-y-10 pt-10 border-t border-border">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {baseAssets.staff.map((s: any, i: number) => (
                      <div key={i} onClick={() => setStaff(s.n)} className={`p-4 border-2 transition-all cursor-pointer text-center space-y-4 ${staff === s.n ? 'border-primary bg-primary/10' : 'border-border bg-secondary/30'}`}>
                        <img src={s.img} className="w-full h-48 object-cover border border-border" alt={s.n} />
                        <p className="text-xs font-black uppercase tracking-widest">{s.n}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <input type="date" className="w-full bg-background p-5 border border-border font-black text-sm uppercase outline-none focus:border-primary" onChange={e => setDate(e.target.value)} />
                    <input type="time" min="14:30" max="18:00" className="w-full bg-background p-5 border border-border font-black text-sm outline-none focus:border-primary" value={time} onChange={e => setTime(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-card border border-border p-10 space-y-10 border-t-[12px] border-t-primary shadow-2xl">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">ИТОГО К ОПЛАТЕ</p>
                <div className="text-7xl font-black text-foreground tracking-tighter">
                  {finalPrice.toLocaleString()} <span className="text-2xl text-muted-foreground">₽</span>
                </div>
              </div>
              <button onClick={handleOpenPayment} className="w-full bg-primary text-primary-foreground py-8 font-black text-lg uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-lg active:scale-95">
                ДОКУПИТЬ УСЛУГУ
              </button>
            </div>
          </div>
        </div>
      </div>
      {isPayOpen && <BookingModal title={`${service.title}: ${selectedItem?.name || 'БРОНЬ'}`} type="service" price={finalPrice} metadata={{ serviceId: service.id, itemName: selectedItem?.name, quantity, staff, date, time }} onClose={() => setIsPayOpen(false)} />}
    </div>
  );
}