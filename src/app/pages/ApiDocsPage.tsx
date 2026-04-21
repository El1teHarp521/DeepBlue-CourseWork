import { useEffect } from 'react';

export function ApiDocsPage() {
  useEffect(() => {
    window.location.href = 'http://localhost:3000/api-docs';
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Переход к API Documentation...</h2>
        <p className="text-muted-foreground">Вы будете перенаправлены на сервер Swagger</p>
      </div>
    </div>
  );
}