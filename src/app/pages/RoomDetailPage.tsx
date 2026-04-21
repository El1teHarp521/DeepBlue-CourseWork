import { useParams, useNavigate } from 'react-router';
import { useState } from 'react';
import { Bed, Users, Wifi, Coffee, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BookingModal } from '../components/BookingModal';

// Используем алиас @ для надежности путей
import roomStandard from '@/assets/images/room-standard.jpg';
import roomBusiness from '@/assets/images/room-business.jpg';
import roomLux from '@/assets/images/room-lux.jpg';
import roomPenthouse from '@/assets/images/room-penthouse.jpg';

export const ROOMS_DATA = [
  {
    id: 'standard',
    title: 'Стандарт',
    price: 15000,
    image: roomStandard,
    fullDescription: 'Наши стандартные номера предлагают идеальное сочетание цены и качества. Площадь 25 кв.м.',
    features: ['Двуспальная кровать', '2 гостя', 'Wi-Fi', 'Завтрак включен'],
  },
  {
    id: 'business',
    title: 'Бизнес',
    price: 34000,
    image: roomBusiness,
    fullDescription: 'Номер категории Бизнес создан для тех, кто ценит функциональность и комфорт. Площадь 35 кв.м.',
    features: ['King-size кровать', '2-3 гостя', 'Wi-Fi 6', 'Рабочая зона'],
  },
  {
    id: 'lux',
    title: 'Люкс',
    price: 67000,
    image: roomLux,
    fullDescription: 'Роскошный Люкс с отдельной гостиной и спальней. Из окон открывается панорамный вид. Площадь 60 кв.м.',
    features: ['2 спальни', '4 гостя', 'Wi-Fi', 'Гостиная'],
  },
  {
    id: 'penthouse',
    title: 'Пентхаус',
    price: 152000,
    image: roomPenthouse,
    fullDescription: 'Эксклюзивный пентхаус на верхнем этаже. Собственная терраса и джакузи.',
    features: ['3 спальни', '6+ гостей', 'Wi-Fi', 'Панорамный вид'],
  },
];

export function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const room = ROOMS_DATA.find(r => r.id === roomId);

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Номер не найден</h2>
        <Button onClick={() => navigate('/')} className="mt-4">Назад</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Адаптивная шапка - высота подстраивается под экран */}
      <div className="relative h-[40vh] md:h-[60vh] w-full">
        <img src={room.image} alt={room.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <Button 
          variant="outline" 
          className="absolute top-4 left-4 md:top-8 md:left-8 bg-background/80 backdrop-blur"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Назад
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl md:text-5xl font-bold">{room.title}</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{room.fullDescription}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-border">
              <div className="flex flex-col items-center text-center gap-2">
                <Bed className="h-6 w-6 text-primary" />
                <span className="text-xs md:text-sm font-medium">{room.features[0]}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-xs md:text-sm font-medium">{room.features[1]}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Wifi className="h-6 w-6 text-primary" />
                <span className="text-xs md:text-sm font-medium">{room.features[2]}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <Coffee className="h-6 w-6 text-primary" />
                <span className="text-xs md:text-sm font-medium">{room.features[3]}</span>
              </div>
            </div>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-2xl font-bold">Удобства номера</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
                {['Smart TV 55"', 'Сейф', 'Мини-бар', 'Климат-контроль', 'Халаты и тапочки', 'Чайная станция'].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 md:p-8 bg-card border border-border rounded-2xl shadow-lg space-y-6">
              <div className="text-3xl font-bold">
                {room.price.toLocaleString('ru-RU')} ₽ <span className="text-base font-normal text-muted-foreground">/ ночь</span>
              </div>
              <Button className="w-full h-14 text-lg font-bold" onClick={() => setIsBookingOpen(true)}>
                Забронировать
              </Button>
              <p className="text-center text-xs text-muted-foreground">Бесплатная отмена за 24 часа</p>
            </div>
          </div>
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal title={room.title} type="room" onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}