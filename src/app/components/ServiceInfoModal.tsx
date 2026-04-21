import { X } from 'lucide-react';
import { Button } from './ui/button';

interface ServiceInfoModalProps {
  service: {
    title: string;
    description: string;
    image: string;
    price?: string;
    details: string;
  };
  onClose: () => void;
}

export function ServiceInfoModal({ service, onClose }: ServiceInfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-card border border-border rounded-2xl overflow-hidden max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-foreground">{service.title}</h2>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
              {service.price || 'Уточняйте цену'}
            </div>
          </div>
          
          <p className="text-foreground font-medium">{service.description}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">{service.details}</p>
          
          <Button onClick={onClose} className="w-full mt-2" variant="secondary">
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
}