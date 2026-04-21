import { useAuth, User } from '../contexts/AuthContext';
import { useState } from 'react';
// Добавил CreditCard в импорт ниже
import { 
  User as UserIcon, Mail, Phone, Bed, Package, 
  History, Wallet, Globe, ShieldCheck, Plus, CreditCard 
} from 'lucide-react';
import { Button } from '../components/ui/button';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [topUpAmount, setTopUpAmount] = useState('');

  if (!user) return null;

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (amount > 0) {
      const updatedUser: User = {
        ...user,
        balance: user.balance + amount,
        history: [{ 
          id: Date.now(), 
          date: new Date().toISOString(), 
          item: 'Пополнение баланса', 
          price: amount 
        }, ...user.history]
      };
      updateUser(updatedUser);
      setTopUpAmount('');
      alert('Баланс успешно пополнен!');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Верхняя карточка профиля */}
          <div className="bg-card border border-border rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground text-5xl font-black shadow-2xl shadow-primary/40">
              {user.fullName.substring(0, 1)}
            </div>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl font-black text-foreground tracking-tight">{user.fullName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="px-4 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-widest">
                  Роль: {user.role}
                </span>
                {user.subRole && (
                  <span className="px-4 py-1 bg-secondary text-secondary-foreground rounded-full text-[10px] font-black uppercase tracking-widest">
                    Подроль: {user.subRole}
                  </span>
                )}
              </div>
            </div>
            {(user.role === 'resident' || user.role === 'admin') && (
              <div className="md:ml-auto text-center md:text-right">
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Ваш баланс</p>
                <p className="text-5xl font-black text-primary">{user.balance.toLocaleString()} ₽</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Левая колонка: Данные и История */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-lg">
                <h3 className="text-xl font-black uppercase flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary" /> Персональные данные
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={Globe} label="Страна" value={user.country} />
                  <InfoItem icon={CreditCard} label="Паспорт" value={user.passport} />
                  <InfoItem icon={UserIcon} label="Дата рождения" value={new Date(user.dob).toLocaleDateString('ru-RU')} />
                  <InfoItem icon={Mail} label="Email" value={user.email} />
                </div>
              </div>

              {user.history && user.history.length > 0 && (
                <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-lg">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" /> История операций
                  </h3>
                  <div className="space-y-3">
                    {user.history.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 bg-secondary/30 rounded-2xl border border-border">
                        <div>
                          <p className="font-bold text-sm">{item.item}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">
                            {new Date(item.date).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <p className={`font-black ${item.price > 0 ? 'text-green-500' : 'text-destructive'}`}>
                          {item.price > 0 ? `+${item.price.toLocaleString()}` : item.price.toLocaleString()} ₽
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Правая колонка: Действия */}
            <div className="space-y-8">
              {/* Блок пополнения баланса */}
              <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-lg border-t-4 border-t-primary">
                <h3 className="text-xl font-black uppercase flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" /> Пополнение
                </h3>
                <div className="space-y-4">
                  <input 
                    type="number" 
                    value={topUpAmount} 
                    onChange={e => setTopUpAmount(e.target.value)} 
                    placeholder="Сумма (₽)" 
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary font-bold" 
                  />
                  <Button onClick={handleTopUp} className="w-full h-12 gap-2 font-bold">
                    <Plus className="w-4 h-4" /> Пополнить баланс
                  </Button>
                </div>
              </div>

              {/* Блок информации о номере (только для постояльцев) */}
              {user.role === 'resident' && (
                <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-lg">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2">
                    <Bed className="w-5 h-5 text-primary" /> Проживание
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Номер</p>
                      <p className="text-2xl font-black">{user.room?.number || 'НЕ НАЗНАЧЕН'}</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-2xl border border-border">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Категория</p>
                      <p className="text-lg font-bold">{user.room?.type || 'Ожидает заселения'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Блок для персонала */}
              {user.subRole && (
                <div className="bg-primary p-8 rounded-3xl text-primary-foreground space-y-4 shadow-xl shadow-primary/30">
                  <ShieldCheck className="w-12 h-12" />
                  <h3 className="text-2xl font-black uppercase leading-tight">Рабочая зона</h3>
                  <p className="text-sm opacity-80 leading-relaxed font-medium">
                    Ваша подроль: <b>{user.subRole}</b>. Используйте систему согласно вашим правам доступа.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательный компонент для строк информации
function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-4 bg-secondary/50 rounded-2xl border border-border flex items-center gap-4">
      <div className="p-2 bg-background rounded-lg shadow-sm">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="font-bold text-foreground truncate">{value || '—'}</p>
      </div>
    </div>
  );
}