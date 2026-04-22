import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Calendar, User, Bed, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';

export function SchedulePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/bookings');
      if (res.ok) setBookings(await res.json());
    } catch (e) {
      console.error("Ошибка загрузки бронирований");
    }
  };

  useEffect(() => {
    if (!user || user.role === 'resident' || user.role === 'guest') {
      navigate('/');
      return;
    }
    fetchBookings();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (confirm('УДАЛИТЬ ЗАПИСЬ ИЗ ЖУРНАЛА?')) {
      await fetch(`http://127.0.0.1:3000/api/bookings/${id}`, { method: 'DELETE' });
      fetchBookings();
    }
  };

  const canEdit = user?.subRole === 'администратор' || user?.role === 'admin';

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '—') return 'СЕГОДНЯ';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-background pb-20 font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-black uppercase flex items-center gap-4">
              <Calendar className="text-primary w-12 h-12" /> Расписание заездов
            </h1>
            <div className="px-6 py-3 bg-card border border-border text-[10px] font-black uppercase tracking-widest">
              ДОСТУП: {user?.subRole || user?.role}
            </div>
          </div>

          <div className="bg-card border border-border overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/50 border-b border-border text-[10px] font-black uppercase opacity-60">
                  <tr>
                    <th className="p-8">Гость</th>
                    <th className="p-8">Объект / Номер</th>
                    <th className="p-8">Даты пребывания</th>
                    <th className="p-8 text-right">Статус</th>
                    {canEdit && <th className="p-8 text-right">Управление</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="p-8 font-black uppercase text-sm tracking-tight">{b.guestName}</td>
                      <td className="p-8">
                        <span className="px-4 py-2 bg-secondary border border-border text-[10px] font-black uppercase tracking-widest">
                          {b.roomType} (№{b.roomNumber})
                        </span>
                      </td>
                      <td className="p-8 text-xs font-bold tracking-widest">
                        {formatDate(b.checkIn)} — {formatDate(b.checkOut)}
                      </td>
                      <td className="p-8 text-right">
                        <span className="px-3 py-1 bg-green-500/10 text-green-600 border border-green-500/20 text-[10px] font-black uppercase">Активно</span>
                      </td>
                      {canEdit && (
                        <td className="p-8 text-right">
                          <button onClick={() => handleDelete(b.id)} className="p-3 text-destructive hover:bg-destructive hover:text-white transition-all">
                            <Trash2 size={20}/>
                          </button>
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
    </div>
  );
}