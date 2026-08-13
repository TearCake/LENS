import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="bg-surface-bright text-on-surface antialiased min-h-screen">
      <Sidebar />
      <Header />
      
      {/* Main Content Canvas */}
      <main className="ml-[260px] pt-16 pb-xxl px-gutter">
        <Outlet />
      </main>
    </div>
  );
}
