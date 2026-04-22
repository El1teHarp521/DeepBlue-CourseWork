import { Bed, Users } from 'lucide-react';

export function RoomCard({ title, price, image, features, onClick }: any) {
  return (
    <div 
      className="group bg-card border border-border rounded-none overflow-hidden cursor-pointer hover:border-primary transition-all duration-500 flex flex-col"
      onClick={onClick}
    >
      <div className="relative h-72 overflow-hidden bg-background shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-5 py-2 font-black text-xs uppercase tracking-widest">
          {price?.toLocaleString()} ₽
        </div>
      </div>

      <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">{title}</h3>
          <div className="space-y-2 opacity-50">
            {features.slice(0, 2).map((f: string, i: number) => (
              <p key={i} className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                 {i === 0 ? <Bed size={12} /> : <Users size={12} />} {f}
              </p>
            ))}
          </div>
        </div>
        <button className="w-full py-4 bg-foreground/5 border border-foreground/10 text-foreground font-black uppercase text-[10px] tracking-[0.3em] group-hover:bg-primary group-hover:text-primary-foreground transition-all mt-auto">
          ПОДРОБНЕЕ
        </button>
      </div>
    </div>
  );
}