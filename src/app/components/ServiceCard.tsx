import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  onClick: () => void;
}

export function ServiceCard({ title, description, icon: Icon, image, onClick }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <div className="relative h-48 bg-muted overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <div className="flex items-center gap-2 text-white">
            <Icon className="w-6 h-6" />
            <h4 className="font-medium">{title}</h4>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
