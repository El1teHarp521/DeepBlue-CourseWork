import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/HomePage';
import { RoomDetailPage } from './pages/RoomDetailPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SchedulePage } from './pages/SchedulePage';
import { RegisterGuestPage } from './pages/RegisterGuestPage';
import { UsersManagementPage } from './pages/UsersManagementPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <Layout><HomePage /></Layout> },
  { path: '/room/:roomId', element: <Layout><RoomDetailPage /></Layout> },
  { path: '/service/:serviceId', element: <Layout><ServiceDetailPage /></Layout> },
  { path: '/profile', element: <Layout><ProfilePage /></Layout> },
  { path: '/schedule', element: <Layout><SchedulePage /></Layout> },
  { path: '/register-guest', element: <Layout><RegisterGuestPage /></Layout> },
  { path: '/users', element: <Layout><UsersManagementPage /></Layout> },
  { path: '/api-docs', element: <Layout><ApiDocsPage /></Layout> },
]);