import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="mb-4 text-foreground">О Deep Blue</h3>
            <p className="text-muted-foreground leading-relaxed">
              Отель Deep Blue — идеальное место для отдыха и работы на побережье.
              Роскошные номера, первоклассный сервис и панорамный вид на море.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-foreground">Контакты</h3>
            <div className="space-y-3">
              <a
                href="tel:+79991111112"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +7 999 111 11 12
              </a>
              <a
                href="mailto:DeepBlueSupport@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                DeepBlueSupport@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-foreground">Адрес</h3>
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <p>г. Дубай<br />квартал Пальма Джебель Али</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Deep Blue Hotel. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
