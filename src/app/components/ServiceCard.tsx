export function ServiceCard({ title, description, icon: Icon, image, onClick }: any) {
  return (
    <div 
      className="group relative h-96 border border-white/10 rounded-none overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-8 space-y-4">
        <div className="w-12 h-12 bg-primary flex items-center justify-center">
          <Icon className="text-white" size={24} />
        </div>
        <h4 className="text-2xl font-black uppercase tracking-tighter">{title}</h4>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}