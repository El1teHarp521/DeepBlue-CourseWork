import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BookingModal } from '../components/BookingModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../components/ui/carousel';

import rs1 from '@/assets/images/room-standard-1.jpg';
import rs2 from '@/assets/images/room-standard-2.jpg';
import rs3 from '@/assets/images/room-standard-3.jpg';
import rs4 from '@/assets/images/room-standard-4.jpg';

import rb1 from '@/assets/images/room-business-1.jpg';
import rb2 from '@/assets/images/room-business-2.jpg';
import rb3 from '@/assets/images/room-business-3.jpg';
import rb4 from '@/assets/images/room-business-4.jpg';
import rb5 from '@/assets/images/room-business-5.jpg';

import rl1 from '@/assets/images/room-lux-1.jpg';
import rl2 from '@/assets/images/room-lux-2.jpg';
import rl3 from '@/assets/images/room-lux-3.jpg';
import rl4 from '@/assets/images/room-lux-4.jpg';
import rl5 from '@/assets/images/room-lux-5.jpg';
import rl6 from '@/assets/images/room-lux-6.jpg';

import rp1 from '@/assets/images/room-penthouse-1.jpg';
import rp2 from '@/assets/images/room-penthouse-2.jpg';
import rp3 from '@/assets/images/room-penthouse-3.jpg';
import rp4 from '@/assets/images/room-penthouse-4.jpg';
import rp5 from '@/assets/images/room-penthouse-5.jpg';
import rp6 from '@/assets/images/room-penthouse-6.jpg';

const ROOM_GALLERIES: any = {
  standard:[rs1, rs2, rs3, rs4],
  business:[rb1, rb2, rb3, rb4, rb5],
  lux:[rl1, rl2, rl3, rl4, rl5, rl6],
  penthouse:[rp1, rp2, rp3, rp4, rp5, rp6]
};

const FALLBACK_SERVICES: any = {
  'Стандарт':['БЕСПЛАТНЫЙ БАССЕЙН', '2 ЧАСА ПК КЛУБА'],
  'Бизнес':['БЕСПЛАТНЫЙ БАССЕЙН', 'ЗАВТРАК (ШВЕДСКИЙ СТОЛ)', '8 ЧАСОВ ПК КЛУБА'],
  'Люкс':['БАССЕЙН + БАНИ', 'ПОЛНЫЙ ПАНСИОН', '12 ЧАСОВ ПК КЛУБА'],
  'Пентхаус':['ВСЕ УСЛУГИ ОТЕЛЯ БЕСПЛАТНО', 'VIP ТЕРРАСА', 'ЛИЧНАЯ ПАРКОВКА']
};

export function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const[isBookingOpen, setIsBookingOpen] = useState(false);
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/rooms`).then(res => res.json()).then(data => {
      setRoom(data.find((r: any) => r.id === roomId));
    });
  },[roomId]);

  if (!room) return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-foreground uppercase tracking-widest">ЗАГРУЗКА...</div>;
  const images = ROOM_GALLERIES[room.id] || [rs1];

  return (
    <div className="min-h-screen bg-background pb-20 text-foreground font-sans">
      <div className="container mx-auto px-4 py-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
          <ChevronLeft size={16} /> Назад в каталог
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10 min-w-0">
            <div className="space-y-2">
              <p className="text-primary font-bold text-xs uppercase tracking-widest">Категория Премиум</p>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{room.title}</h1>
            </div>

            {/* КАРУСЕЛЬ С ФОТОГРАФИЯМИ */}
            <Carousel className="w-full border border-border shadow-2xl bg-card">
              <CarouselContent>
                {images.map((src: string, idx: number) => (
                  <CarouselItem key={idx}>
                    <div className="relative">
                       {/* ФОТО ЦВЕТНЫЕ */}
                       <img src={src} className="w-full h-[40vh] md:h-[55vh] object-cover" alt={`Фото ${idx + 1}`} />
                       <div className="absolute bottom-4 left-4 bg-background/90 text-foreground px-4 py-2 font-bold text-[10px] tracking-widest border border-border">
                          ФОТО {idx + 1} ИЗ {images.length}
                       </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-background/80 hover:bg-primary border-none text-foreground hover:text-primary-foreground transition-all" />
              <CarouselNext className="right-4 bg-background/80 hover:bg-primary border-none text-foreground hover:text-primary-foreground transition-all" />
            </Carousel>

            <div className="flex flex-wrap gap-3">
              {room.features?.map((f: string, i: number) => (
                <div key={i} className="px-5 py-2 bg-background border border-border font-bold uppercase text-xs tracking-wider text-muted-foreground">{f}</div>
              ))}
            </div>

            <div className="bg-card p-10 border border-border relative overflow-hidden shadow-xl">
               <ShieldCheck className="absolute -right-6 -bottom-6 w-48 h-48 opacity-5 text-primary" />
               <h3 className="text-2xl font-black uppercase mb-8 tracking-tight border-b border-border pb-4">Включено в проживание</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {(room.includedServices || FALLBACK_SERVICES[room.title])?.map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-background p-4 border border-border">
                       <CheckCircle2 size={20} className="text-primary shrink-0" />
                       <span className="font-bold uppercase text-xs tracking-wider">{s}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-card border border-border p-10 space-y-8 shadow-2xl border-t-4 border-t-primary">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Стоимость за сутки</p>
                <div className="text-5xl font-black text-foreground tracking-tighter">
                  {room.price?.toLocaleString()} <span className="text-2xl font-normal opacity-30">₽</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <button onClick={() => setIsBookingOpen(true)} className="w-full bg-primary text-primary-foreground py-6 font-black text-lg uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                  ЗАБРОНИРОВАТЬ
                </button>
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="h-[1px] w-8 bg-border"></div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-center">Мгновенное подтверждение</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isBookingOpen && <BookingModal title={room.title} type="room" price={room.price} onClose={() => setIsBookingOpen(false)} />}
    </div>
  );
}