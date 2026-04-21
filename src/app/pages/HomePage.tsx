import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { RoomCard } from '../components/RoomCard';
import { ServiceCard } from '../components/ServiceCard';
import { ServiceInfoModal } from '../components/ServiceInfoModal';
import { Utensils, Waves, Car, Gamepad2 } from 'lucide-react';

// Картинки
import heroBg from '@/assets/images/hero-bg.jpg';
import roomStandard from '@/assets/images/room-standard.jpg';
import roomBusiness from '@/assets/images/room-business.jpg';
import roomLux from '@/assets/images/room-lux.jpg';
import roomPenthouse from '@/assets/images/room-penthouse.jpg';
import serviceRest from '@/assets/images/service-restaurant.jpg';
import serviceSpa from '@/assets/images/service-spa.jpg';
import servicePark from '@/assets/images/service-parking.jpg';
import serviceGame from '@/assets/images/service-gaming.jpg';

const ROOM_IMG: Record<string, string> = { standard: roomStandard, business: roomBusiness, lux: roomLux, penthouse: roomPenthouse };
const SERVICE_IMG: Record<string, string> = { restaurant: serviceRest, spa: serviceSpa, parking: servicePark, gaming: serviceGame };
const SERVICE_ICON: Record<string, any> = { restaurant: Utensils, spa: Waves, parking: Car, gaming: Gamepad2 };

export function HomePage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  useEffect(() => {
    // Загружаем комнаты
    fetch('http://localhost:3000/api/rooms')
      .then(res => res.json())
      .then(data => setRooms(data));

    // Загружаем услуги
    fetch('http://localhost:3000/api/services')
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="relative h-[75vh] bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">Deep Blue</h1>
          <p className="text-xl md:text-2xl font-light opacity-80 uppercase tracking-[0.3em]">Premium Hotel & Resort</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-20">
        {/* Номера */}
        <section className="mb-32">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Наши номера</h2>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                title={room.title}
                price={room.price}
                image={ROOM_IMG[room.id] || roomStandard}
                features={room.features}
                onClick={() => navigate(`/room/${room.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Услуги */}
        <section>
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">Услуги отеля</h2>
            <div className="h-1.5 w-24 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={SERVICE_ICON[service.id] || Utensils}
                image={SERVICE_IMG[service.id] || serviceRest}
                onClick={() => setSelectedService(service)}
              />
            ))}
          </div>
        </section>
      </main>

      {selectedService && (
        <ServiceInfoModal
          service={{
            ...selectedService,
            image: SERVICE_IMG[selectedService.id] || serviceRest
          }}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}