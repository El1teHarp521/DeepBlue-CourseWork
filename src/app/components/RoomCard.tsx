import { motion } from 'motion/react';
import { Bed, Users, Wifi, Coffee } from 'lucide-react';

interface RoomCardProps {
  title: string;
  price: number;
  image: string;
  features: string[];
  onClick: () => void;
}

export function RoomCard({ title, price, image, features, onClick }: RoomCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-64 bg-muted overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full">
          от {price.toLocaleString('ru-RU')} ₽/ночь
        </div>
      </div>

      <div className="p-6">
        <h3 className="mb-3 text-foreground">{title}</h3>

        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-muted-foreground">
              {index === 0 && <Bed className="w-4 h-4" />}
              {index === 1 && <Users className="w-4 h-4" />}
              {index === 2 && <Wifi className="w-4 h-4" />}
              {index === 3 && <Coffee className="w-4 h-4" />}
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
          Подробнее
        </button>
      </div>
    </motion.div>
  );
}
