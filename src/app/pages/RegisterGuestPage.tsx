import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { UserPlus, Check } from 'lucide-react';

// Маппинг категорий для красивого отображения в таблице
const CATEGORY_MAP: Record<string, string> = {
  standard: 'Стандарт',
  business: 'Бизнес',
  lux: 'Люкс',
  penthouse: 'Пентхаус'
};

export function RegisterGuestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passport: '',
    roomNumber: '',
    roomCategory: 'standard',
    checkIn: '',
    checkOut: '',
    guests: '1',
  });

  useEffect(() => {
    if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Получаем текущие бронирования
    const savedData = localStorage.getItem('deep-blue-bookings');
    const currentBookings = savedData ? JSON.parse(savedData) : [];

    // 2. Создаем новое бронирование
    const newBooking = {
      id: Date.now(), // уникальный ID через метку времени
      guestName: formData.fullName,
      roomNumber: formData.roomNumber,
      roomType: CATEGORY_MAP[formData.roomCategory],
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      status: 'upcoming', // По умолчанию новое бронирование - "Ожидается"
    };

    // 3. Сохраняем обновленный массив
    const updatedBookings = [...currentBookings, newBooking];
    localStorage.setItem('deep-blue-bookings', JSON.stringify(updatedBookings));

    // 4. Показываем успех и уходим на страницу расписания
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/schedule');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!user || (user.role !== 'employee' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
                <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Регистрация постояльца</h1>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-foreground">ФИО Гостя</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Иванов Иван Иванович"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="example@mail.ru"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-foreground">Телефон</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="+7 999 123 45 67"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-foreground">Номер комнаты</label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="305"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-foreground">Категория номера</label>
                  <select
                    name="roomCategory"
                    value={formData.roomCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="standard">Стандарт</option>
                    <option value="business">Бизнес</option>
                    <option value="lux">Люкс</option>
                    <option value="penthouse">Пентхаус</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-foreground">Дата заезда</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-foreground">Дата выезда</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 border border-border rounded-xl hover:bg-secondary transition-colors text-foreground font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-bold shadow-lg shadow-primary/20"
                >
                  Зарегистрировать
                </button>
              </div>
            </form>
          </div>

          {showSuccess && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-card rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Успешно!</h2>
                <p className="text-muted-foreground">Данные постояльца сохранены в базе отеля.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}