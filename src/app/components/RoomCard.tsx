import { motion } from 'motion/react';

export function RoomCard({ title, price, image, features, onClick }: any) {
  return (
    <div 
      className="group bg-[#0a0a0a] border border-white/10 rounded-none overflow-hidden cursor-pointer hover:border-primary transition-all duration-500"
      onClick={onClick}
    >
      <div className="relative h-72 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
        <div className="absolute top-0 right-0 bg-primary text-white px-5 py-2 font-black text-xs uppercase tracking-widest">
          {price?.toLocaleString()} ₽
        </div>
      </div>

      <div className="p-8 space-y-6">
        <h3 className="text-2xl font-black uppercase tracking-tighter">{title}</h3>
        <div className="space-y-2 opacity-40">
          {features.slice(0, 2).map((f: string, i: number) => (
            <p key={i} className="text-[10px] font-black uppercase tracking-widest">• {f}</p>
          ))}
        </div>
        <button className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.3em] group-hover:bg-primary group-hover:text-white transition-all">
          ПОДРОБНЕЕ
        </button>
      </div>
    </div>
  );
}