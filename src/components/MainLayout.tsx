
import { Outlet } from 'react-router-dom';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
