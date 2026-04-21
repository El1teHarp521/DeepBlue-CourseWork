import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RoomCard } from '../components/RoomCard';
import { ServiceCard } from '../components/ServiceCard';
import { Utensils, Waves, Car, Gamepad2 } from 'lucide-react';

// Картинки
import heroBg from '@/assets/images/hero-bg.jpg';
import roomStandard from '@/assets/images/room-standard-1.jpg';
import roomBusiness from '@/assets/images/room-business-1.jpg';
import roomLux from '@/assets/images/room-lux-1.jpg';
import roomPenthouse from '@/assets/images/room-penthouse-1.jpg';

import serviceRest from '@/assets/images/service-restaurant-1.jpg';
import serviceSpa from '@/assets/images/service-spa-1.jpg';
import servicePark from '@/assets/images/service-parking-1.jpg';
import serviceGame from '@/assets/images/service-gaming-1.jpg';

const ROOM_IMG: any = { standard: roomStandard, business: roomBusiness, lux: roomLux, penthouse: roomPenthouse };
const SERVICE_IMG: any = { restaurant: serviceRest, spa: serviceSpa, parking: servicePark, gaming: serviceGame };
const SERVICE_ICON: any = { restaurant: Utensils, spa: Waves, parking: Car, gaming: Gamepad2 };

export function HomePage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);

  const loadData = async () => {
    try {
      const r = await fetch('http://127.0.0.1:3000/api/rooms');
      if (r.ok) {
        const data = await r.json();
        setRooms(data);
      }
      
      const s = await fetch('http://127.0.0.1:3000/api/services');
      if (s.ok) {
        const data = await s.json();
        setServices(data);
      }
    } catch (e) {
      console.error("КРИТИЧЕСКАЯ ОШИБКА ПОДКЛЮЧЕНИЯ К БЭКЕНДУ");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white font-sans selection:bg-primary">
      {/* HERO SECTION */}
      <div className="relative h-[85vh] bg-cover bg-center flex items-center justify-center border-b border-white/10" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 text-center px-4 space-y-4">
          <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-none">DEEP BLUE</h1>
          <p className="text-sm md:text-xl font-black uppercase tracking-[0.8em] opacity-60">ОТЕЛЬ И КУРОРТ</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-32 space-y-40">
        
        {/* НОМЕРА */}
        <section>
          <div className="flex items-center gap-10 mb-20">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">НОМЕРА</h2>
            <div className="h-[2px] flex-1 bg-white/10" />
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em] hidden md:block italic">SELECT YOUR STAY</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.length > 0 ? rooms.map((room: any) => (
              <RoomCard
                key={room.id}
                title={room.title}
                price={room.price}
                image={ROOM_IMG[room.id] || roomStandard}
                features={room.features || []}
                onClick={() => navigate(`/room/${room.id}`)}
              />
            )) : (
              <p className="col-span-full text-center font-black opacity-20 uppercase tracking-widest py-20 border border-dashed border-white/10">
                Загрузка данных с сервера...
              </p>
            )}
          </div>
        </section>

        {/* УСЛУГИ */}
        <section>
          <div className="flex items-center gap-10 mb-20">
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter">СЕРВИС</h2>
            <div className="h-[2px] flex-1 bg-white/10" />
            <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.5em] hidden md:block italic">PREMIUM EXPERIENCE</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.length > 0 ? services.map((service: any) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={SERVICE_ICON[service.id] || Utensils}
                image={SERVICE_IMG[service.id]}
                onClick={() => navigate(`/service/${service.id}`)}
              />
            )) : (
              <p className="col-span-full text-center font-black opacity-20 uppercase tracking-widest py-20 border border-dashed border-white/10">
                Синхронизация услуг...
              </p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}