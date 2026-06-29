import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '▣', end: true },
  { to: '/admin/orders', label: 'Orders', icon: '📋' },
  { to: '/admin/menu', label: 'Menu', icon: '🍽️' },
  { to: '/admin/coupons', label: 'Coupons', icon: '🏷️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-brown-light/20 bg-white px-4 py-6">
        <div className="mb-8 px-2">
          <p className="font-display text-lg font-semibold text-coffee">Brew &amp; Bite</p>
          <p className="mt-0.5 text-xs text-muted">Admin Panel</p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-coffee text-cream' : 'text-text hover:bg-cream'
                }`
              }
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-brown-light/20 pt-4">
          <p className="px-2 text-xs text-muted truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-muted transition hover:bg-cream hover:text-coffee"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
