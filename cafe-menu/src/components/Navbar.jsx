import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-brown-light/20 bg-cream/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-coffee transition hover:bg-white lg:hidden"
          aria-label="Open categories"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-coffee">
            Brew &amp; Bite
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-coffee hover:bg-white"
            >
              Admin Panel
            </Link>
          )}
          {user && user.role !== 'admin' && (
            <Link
              to="/orders"
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-white hover:text-coffee"
            >
              My Orders
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Auth */}
          {user ? (
            <div className="hidden items-center gap-3 lg:flex">
              <span className="text-sm font-medium text-muted">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-brown-light/30 px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-white hover:text-coffee"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg border border-brown-light/30 px-3 py-1.5 text-sm font-medium text-muted transition hover:bg-white hover:text-coffee lg:block"
            >
              Login
            </Link>
          )}

          {/* Cart icon — mobile */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-coffee hover:bg-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.4" fill="currentColor" />
              <circle cx="17" cy="20" r="1.4" fill="currentColor" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-olive px-1 text-[11px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
