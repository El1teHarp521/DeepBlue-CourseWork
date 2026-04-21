import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Calendar, User, Bed, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/button';

export function SchedulePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
      navigate('/');
      return;
    }
    const saved = localStorage.getItem('deep-blue-bookings');
    if (saved) setBookings(JSON.parse(saved));
  }, [user, navigate]);

  const handleDeleteBooking = (id: number) => {
    if (user?.role === 'admin' && confirm('Удалить бронирование?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem('deep-blue-bookings', JSON.stringify(updated));
    }
  };

  const isAdmin = user?.role === 'admin' || user?.subRole === 'admin';

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-black uppercase">Расписание Deep Blue</h1>
            </div>
            {isAdmin && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20 animate-pulse">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-xs font-black uppercase">Режим редактирования</span>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest">Гость / Номер</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest">Заезд — Выезд</th>
                  <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest">Статус</th>
                  {isAdmin && <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest opacity-50">Управление</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground flex items-center gap-2">
                          <User className="w-3 h-3 text-primary" /> {booking.guestName}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Bed className="w-3 h-3" /> {booking.roomType} (№{booking.roomNumber})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {new Date(booking.checkIn).toLocaleDateString()} — {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'active' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-600'
                      }`}>
                        {booking.status === 'active' ? 'В отеле' : 'Ожидается'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBooking(booking.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}