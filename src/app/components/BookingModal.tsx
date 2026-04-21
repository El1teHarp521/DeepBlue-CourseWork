import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

interface BookingModalProps {
  title: string;
  type: 'room' | 'service';
  price?: number; // Теперь цена передается в модалку
  onClose: () => void;
}

export function BookingModal({ title, type, price = 0, onClose }: BookingModalProps) {
  const { user, isAuthorized, updateUser } = useAuth();
  const [step, setStep] = useState<'form' | 'success' | 'error'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (user.balance < price) {
      setStep('error');
      return;
    }

    // Списание средств и обновление истории
    const updatedUser = {
      ...user,
      balance: user.balance - price,
      history: [
        { id: Date.now(), date: new Date().toISOString(), item: `Оплата: ${title}`, price: -price },
        ...user.history
      ],
      // Если это комната, назначаем её пользователю
      room: type === 'room' ? { number: (Math.floor(Math.random() * 500) + 100).toString(), type: title } : user.room
    };

    updateUser(updatedUser);
    setStep('success');
    
    // Добавляем в общее расписание
    const savedBookings = JSON.parse(localStorage.getItem('deep-blue-bookings') || '[]');
    const newBooking = {
        id: Date.now(),
        guestName: user.fullName,
        roomNumber: updatedUser.room?.number || '—',
        roomType: title,
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 86400000 * 3).toISOString(),
        status: 'upcoming'
    };
    localStorage.setItem('deep-blue-bookings', JSON.stringify([...savedBookings, newBooking]));
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase mb-2">Оплачено!</h2>
          <p className="text-muted-foreground mb-6">Средства списаны с вашего баланса. Приятного отдыха!</p>
          <Button onClick={onClose} className="w-full">Отлично</Button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in">
          <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-destructive/20">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black uppercase mb-2">Ошибка</h2>
          <p className="text-muted-foreground mb-6">Недостаточно средств на балансе. Пополните его в профиле.</p>
          <Button onClick={onClose} variant="secondary" className="w-full">Понятно</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-border" onClick={e => e.stopPropagation()}>
        <div className="p-6 bg-secondary/30 flex justify-between items-center border-b border-border">
          <h2 className="text-xl font-black uppercase tracking-tighter">{type === 'room' ? 'Бронирование' : 'Заказ услуги'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 text-center">
             <p className="text-xs font-black text-primary uppercase mb-1">{title}</p>
             <p className="text-3xl font-black">{price.toLocaleString()} ₽</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-center text-muted-foreground">Для подтверждения оплаты нажмите кнопку ниже. Сумма будет списана с вашего баланса в Deep Blue.</p>
            <div className="flex justify-between text-sm font-bold border-t pt-4">
               <span className="text-muted-foreground">Ваш текущий баланс:</span>
               <span className="text-primary">{user?.balance || 0} ₽</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="secondary" className="flex-1 h-12 font-bold" onClick={onClose}>Отмена</Button>
            <Button type="submit" className="flex-1 h-12 font-bold shadow-lg shadow-primary/20">Оплатить</Button>
          </div>
        </form>
      </div>
    </div>
  );
}