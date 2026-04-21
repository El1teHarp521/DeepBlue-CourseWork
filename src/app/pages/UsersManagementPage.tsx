import { useAuth, UserRole, User } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Shield, Trash2, Bed, Tag, Users, Settings2, Database } from 'lucide-react';
import { Button } from '../components/ui/button';

export function UsersManagementPage() {
  const { user: adminUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [tab, setTab] = useState<'users' | 'prices'>('users');

  const fetchData = async () => {
    try {
      const [uRes, rRes, sRes] = await Promise.all([
        fetch('http://127.0.0.1:3000/api/users'),
        fetch('http://127.0.0.1:3000/api/rooms'),
        fetch('http://127.0.0.1:3000/api/services')
      ]);
      if (uRes.ok) setUsers(await uRes.json());
      if (rRes.ok) setRooms(await rRes.json());
      if (sRes.ok) setServices(await sRes.json());
    } catch (e) { console.error("ERR"); }
  };

  useEffect(() => {
    if (adminUser?.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, [adminUser]);

  const updateUserInfo = async (id: string, data: any) => {
    await fetch(`http://127.0.0.1:3000/api/users/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    fetchData();
  };

  const updatePrice = async (type: 'rooms' | 'services', id: string, newValue: any) => {
    const payload = type === 'rooms' ? { price: Number(newValue) } : { price: String(newValue) };
    await fetch(`http://127.0.0.1:3000/api/${type}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    fetchData();
  };

  return (
    <div className="container mx-auto py-8 md:py-12 px-4 space-y-10 font-sans min-w-0">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-primary text-white rotate-3 shadow-2xl"><Shield size={40} /></div>
          <div className="min-w-0">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter break-words">Управление</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] opacity-70">DEEP BLUE ADMIN</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row bg-secondary p-1.5 border border-border w-full lg:w-auto">
          <button onClick={() => setTab('users')} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'users' ? 'bg-card text-primary shadow-xl' : 'text-muted-foreground opacity-60'}`}>Персонал</button>
          <button onClick={() => setTab('prices')} className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'prices' ? 'bg-card text-primary shadow-xl' : 'text-muted-foreground opacity-60'}`}>Цены</button>
        </div>
      </div>

      {tab === 'users' ? (
        <div className="bg-card border border-border overflow-hidden shadow-2xl border-b-8 border-b-primary">
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-secondary/50 border-b border-border text-[10px] font-black uppercase tracking-widest opacity-60">
                <tr>
                  <th className="p-8">Пользователь</th>
                  <th className="p-8">Доступ</th>
                  <th className="p-8">Роль</th>
                  <th className="p-8">Баланс (₽)</th>
                  <th className="p-8 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="p-8 min-w-0">
                      <p className="font-black text-lg uppercase italic truncate max-w-[200px]">{u.fullName}</p>
                      <p className="text-[10px] font-bold text-muted-foreground mt-1 truncate">{u.email}</p>
                    </td>
                    <td className="p-8">
                      <select value={u.role} onChange={(e) => updateUserInfo(u.id, { role: e.target.value })} className="bg-background border-2 border-border p-2 text-[10px] font-black uppercase tracking-widest outline-none">
                        <option value="resident">Resident</option>
                        <option value="employee">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-8">
                      {u.role !== 'resident' ? (
                        <select value={u.subRole || 'ресепшн'} onChange={(e) => updateUserInfo(u.id, { subRole: e.target.value })} className="bg-primary/5 border-2 border-primary/20 p-2 text-[10px] font-black uppercase tracking-widest text-primary outline-none font-bold">
                          {['горничная','парковщик','бельмен','массажист','повар','официант','бармен','ресепшн','администратор'].map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                        </select>
                      ) : <span className="text-[10px] font-black opacity-20 uppercase">Клиент</span>}
                    </td>
                    <td className="p-8 font-black text-xl text-primary">{u.balance?.toLocaleString()}</td>
                    <td className="p-8 text-right">
                       {u.id !== adminUser?.id && (
                          <button onClick={async () => { if(confirm('Удалить?')) { await fetch(`http://127.0.0.1:3000/api/users/${u.id}`, {method:'DELETE'}); fetchData(); } }} className="p-4 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all transform hover:rotate-6"><Trash2 size={20}/></button>
                       )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6 bg-card p-6 md:p-10 border border-border shadow-xl min-w-0">
            <h2 className="text-3xl font-black uppercase flex items-center gap-4 italic mb-8 border-b border-border pb-4"><Database size={32} className="text-primary"/> Тарифы</h2>
            <div className="space-y-4">
                {rooms.map(r => (
                <div key={r.id} className="bg-secondary/30 p-6 flex flex-col sm:flex-row justify-between items-center border border-border gap-4">
                    <span className="font-black uppercase text-xs tracking-widest truncate max-w-[150px]">{r.title}</span>
                    <input type="number" defaultValue={r.price} className="w-full sm:w-36 bg-card border-2 border-border p-2 font-black text-right text-primary outline-none" onBlur={(e) => updatePrice('rooms', r.id, e.target.value)} />
                </div>
                ))}
            </div>
          </div>
          <div className="space-y-6 bg-card p-6 md:p-10 border border-border shadow-xl min-w-0">
            <h2 className="text-3xl font-black uppercase flex items-center gap-4 italic mb-8 border-b border-border pb-4"><Settings2 size={32} className="text-primary"/> Сервисы</h2>
            <div className="space-y-4">
                {services.map(s => (
                <div key={s.id} className="bg-secondary/30 p-6 flex flex-col sm:flex-row justify-between items-center border border-border gap-4">
                    <span className="font-black uppercase text-xs tracking-widest truncate max-w-[150px]">{s.title}</span>
                    <input type="text" defaultValue={s.price} className="w-full sm:w-48 bg-card border-2 border-border p-2 font-black text-right text-primary text-xs outline-none" onBlur={(e) => updatePrice('services', s.id, e.target.value)} />
                </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}