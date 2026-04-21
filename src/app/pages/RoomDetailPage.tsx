import { useParams, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Star, ShieldCheck, Bed, Users } from 'lucide-react';
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

const FALLBACK_SERVICES: any = {
  'Стандарт': ['БЕСПЛАТНЫЙ БАССЕЙН', '2 ЧАСА ПК КЛУБА'],
  'Бизнес': ['БЕСПЛАТНЫЙ БАССЕЙН', 'ЗАВТРАК (ШВЕДСКИЙ СТОЛ)', '8 ЧАСОВ ПК КЛУБА'],
  'Люкс': ['БАССЕЙН + БАНИ', 'ПОЛНЫЙ ПАНСИОН', '12 ЧАСОВ ПК КЛУБА'],
  'Пентхаус': ['ВСЕ УСЛУГИ ОТЕЛЯ БЕСПЛАТНО', 'VIP ТЕРРАСА', 'ЛИЧНАЯ ПАРКОВКА']
};

const ROOM_GALLERIES: any = {
  standard: [rs1, rs2, rs3, rs4],
  business: [rb1, rb2, rb3, rb4, rb5],
  lux: [rl1, rl2, rl3, rl4, rl5, rl6],
  penthouse: [rp1, rp2, rp3, rp4, rp5, rp6]
};

export function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/api/rooms`).then(res => res.json()).then(data => {
      setRoom(data.find((r: any) => r.id === roomId));
    });
  }, [roomId]);

  if (!room) return <div className="min-h-screen bg-black flex items-center justify-center font-bold text-white uppercase tracking-widest">ЗАГРУЗКА DEEP BLUE...</div>;

  const images = ROOM_GALLERIES[room.id] || [rs1];

  return (
    <div className="min-h-screen bg-black pb-20 text-white font-sans selection:bg-primary">
      <div className="container mx-auto px-4 py-6">
        
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/50 hover:text-white transition-all"
        >
          <ChevronLeft size={14} /> НАЗАД В КАТАЛОГ
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8 space-y-12 min-w-0">
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-primary font-black text-xs uppercase tracking-[0.4em]">
                <div className="w-12 h-[2px] bg-primary"></div>
                КАТЕГОРИЯ: {room.id.toUpperCase()}
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-tight break-words">
                {room.title}
              </h1>
            </div>

            {/* ГАЛЕРЕЯ */}
            <div className="relative group">
              <Carousel className="w-full border border-white/10 shadow-2xl">
                <CarouselContent>
                  {images.map((src: any, idx: number) => (
                    <CarouselItem key={idx}>
                      <div className="relative h-[50vh] md:h-[65vh] w-full bg-zinc-900">
                        <img src={src} className="w-full h-full object-cover" alt={`Слайд ${idx + 1}`} />
                        <div className="absolute bottom-6 left-6 bg-black/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-white/10">
                           ФОТО {idx + 1} / {images.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-black/80 hover:bg-primary border-none text-white scale-125" />
                <CarouselNext className="right-4 bg-black/80 hover:bg-primary border-none text-white scale-125" />
              </Carousel>
            </div>

            <div className="flex flex-wrap gap-4">
              {room.features?.map((f: string, i: number) => (
                <div key={i} className="px-6 py-3 bg-white/5 border border-white/10 font-bold uppercase text-[10px] tracking-widest">
                  {f}
                </div>
              ))}
            </div>

            <div className="bg-primary p-12 relative overflow-hidden shadow-2xl">
               <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
               <h3 className="text-3xl font-black uppercase mb-10 tracking-tight border-b border-white/20 pb-4 inline-block">
                  ВКЛЮЧЕНО В СТОИМОСТЬ
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {(room.includedServices || FALLBACK_SERVICES[room.title])?.map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-black/20 p-5 border border-white/5">
                       <CheckCircle2 size={18} className="text-white" />
                       <span className="font-bold uppercase text-[11px] tracking-wider leading-tight">{s}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-[#0d0d0d] border border-white/10 p-10 space-y-10 shadow-2xl border-t-[10px] border-t-primary">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">ТАРИФ ЗА 24 ЧАСА</p>
                <div className="text-6xl font-black text-white tracking-tighter">
                  {room.price?.toLocaleString()} <span className="text-2xl font-normal opacity-30">₽</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-white text-black py-8 font-black text-lg uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
                >
                  ЗАБРОНИРОВАТЬ
                </button>
                <div className="flex flex-col items-center gap-2 opacity-30 text-center">
                  <div className="h-[1px] w-12 bg-white"></div>
                  <p className="text-[9px] font-black uppercase tracking-widest">БЕЗОПАСНАЯ ТРАНЗАКЦИЯ</p>
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