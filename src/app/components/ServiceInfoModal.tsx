import { X, Info } from 'lucide-react';

export function ServiceInfoModal({ service, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 text-white font-sans">
      <div className="bg-[#0a0a0a] w-full max-w-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8 bg-white/5 flex justify-between items-center border-b border-white/10">
          <h2 className="font-black uppercase tracking-[0.4em] text-xl flex items-center gap-4">
            <Info className="text-primary" /> ИНФОРМАЦИЯ
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-primary"><X size={24}/></button>
        </div>
        
        <div className="p-10 space-y-10">
          <div className="h-64 w-full border border-white/10">
            <img src={service.image} className="w-full h-full object-cover" alt="" />
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
              <h3 className="text-4xl font-black uppercase tracking-tighter">{service.title}</h3>
              <p className="text-2xl font-black text-primary uppercase">{service.price}</p>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest leading-loose opacity-60">
              {service.details}
            </p>
          </div>

          <button onClick={onClose} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all">
            ЗАКРЫТЬ
          </button>
        </div>
      </div>
    </div>
  );
}