import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Calendar, User, Bed, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';

export function SchedulePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {
    const res = await fetch('http://localhost:3000/api/bookings');
    setBookings(await res.json());
  };

  useEffect(() => {
    if (!user || user.role === 'resident' || user.role === 'guest') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (confirm('Удалить бронирование?')) {
      await fetch(`http://localhost:3000/api/bookings/${id}`, { method: 'DELETE' });
      fetchBookings();
    }
  };

  const canEdit = user?.subRole === 'администратор' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black uppercase flex items-center gap-3">
              <Calendar className="text-primary w-10 h-10" /> Расписание заездов
            </h1>
            <div className="px-4 py-2 bg-secondary rounded-xl text-[10px] font-black uppercase tracking-widest border border-border">
              Доступ: {user?.subRole}
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-secondary/50 border-b border-border text-[10px] font-black uppercase opacity-60">
                <tr>
                  <th className="p-6">Гость</th>
                  <th className="p-6">Номер</th>
                  <th className="p-6">Даты</th>
                  <th className="p-6 text-right">Статус</th>
                  {canEdit && <th className="p-6 text-right">Управление</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-6 font-bold">{b.guestName}</td>
                    <td className="p-6"><span className="px-3 py-1 bg-secondary rounded-lg text-xs font-bold">{b.roomType} (№{b.roomNumber})</span></td>
                    <td className="p-6 text-sm font-medium">{new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}</td>
                    <td className="p-6 text-right">
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase tracking-tighter">Активно</span>
                    </td>
                    {canEdit && (
                      <td className="p-6 text-right">
                        <Button variant="ghost" onClick={() => handleDelete(b.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 size={16}/>
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