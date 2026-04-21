import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { SchedulePage } from './pages/SchedulePage';
import { RegisterGuestPage } from './pages/RegisterGuestPage';
import { UsersManagementPage } from './pages/UsersManagementPage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: '/room/:roomId',
    element: <Layout><RoomDetailPage /></Layout>,
  },
  {
    path: '/api-docs',
    element: <Layout><ApiDocsPage /></Layout>,
  },
  {
    path: '/profile',
    element: <Layout><ProfilePage /></Layout>,
  },
  {
    path: '/schedule',
    element: <Layout><SchedulePage /></Layout>,
  },
  {
    path: '/register-guest',
    element: <Layout><RegisterGuestPage /></Layout>,
  },
  {
    path: '/users',
    element: <Layout><UsersManagementPage /></Layout>,
  },
  {
    path: '*',
    element: (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground mb-6">Страница не найдена</p>
            <a href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">На главную</a>
          </div>
        </div>
      </Layout>
    ),
  },
]);