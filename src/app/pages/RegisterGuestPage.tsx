import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export function RegisterGuestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', passport: '', roomNumber: '', roomCategory: 'standard', checkIn: '', checkOut: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('http://127.0.0.1:3000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName: formData.fullName, roomNumber: formData.roomNumber, roomType: formData.roomCategory, checkIn: formData.checkIn, checkOut: formData.checkOut, status: 'active' })
    });
    navigate('/schedule');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
          <ChevronLeft size={14} /> Назад
        </button>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">РЕГИСТРАЦИЯ</h1>
          <p className="text-xs font-black uppercase tracking-[0.4em] text-primary">НОВЫЙ ПОСТОЯЛЕЦ ОТЕЛЯ</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-card p-12 border border-border shadow-xl">
          <div className="space-y-6">
            <input required placeholder="ФИО ГОСТЯ" className="w-full bg-transparent border-b border-border p-4 font-black uppercase text-sm focus:border-primary outline-none" onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required placeholder="ПАСПОРТ" className="w-full bg-transparent border-b border-border p-4 font-black uppercase text-sm focus:border-primary outline-none" onChange={e => setFormData({...formData, passport: e.target.value})} />
            <input required placeholder="EMAIL" type="email" className="w-full bg-transparent border-b border-border p-4 font-black uppercase text-sm focus:border-primary outline-none" onChange={e => setFormData({...formData, email: e.target.value})} />
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase">Заезд</label>
                <input required type="date" className="w-full bg-secondary p-4 text-xs font-black uppercase outline-none" onChange={e => setFormData({...formData, checkIn: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-muted-foreground uppercase">Выезд</label>
                <input required type="date" className="w-full bg-secondary p-4 text-xs font-black uppercase outline-none" onChange={e => setFormData({...formData, checkOut: e.target.value})} />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <input required placeholder="НОМЕР КОМНАТЫ" className="w-full bg-transparent border-b border-border p-4 font-black uppercase text-sm focus:border-primary outline-none" onChange={e => setFormData({...formData, roomNumber: e.target.value})} />
            <select className="w-full bg-secondary border-none p-4 font-black uppercase text-xs outline-none" onChange={e => setFormData({...formData, roomCategory: e.target.value})}>
              <option value="Стандарт">СТАНДАРТ</option>
              <option value="Бизнес">БИЗНЕС</option>
              <option value="Люкс">ЛЮКС</option>
              <option value="Пентхаус">ПЕНТХАУС</option>
            </select>
            <div className="pt-10">
              <button type="submit" className="w-full py-6 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-lg">
                ЗАРЕГИСТРИРОВАТЬ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}