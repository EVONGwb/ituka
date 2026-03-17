import { Outlet, useLocation } from 'react-router-dom';
import CustomerBottomNav from './CustomerBottomNav';

export default function CustomerTabLayout() {
  return (
    <div className="min-h-screen bg-ituka-cream-soft">
      <div className="pb-20">
        <Outlet />
      </div>
      <CustomerBottomNav />
    </div>
  );
}
