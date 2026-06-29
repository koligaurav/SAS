import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

export default function Login({ admin = false }) {
  const { login, adminLogin, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (admin) {
        const user = await adminLogin(form.email, form.password);
        if (user.role === 'admin') navigate('/admin');
      } else if (tab === 'login') {
        await login(form.email, form.password);
        navigate('/');
      } else {
        if (!form.name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(form.name, form.email, form.password, form.phone);
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-6 block text-center font-display text-2xl font-semibold text-coffee">
            Brew &amp; Bite
          </Link>

          <div className="rounded-2xl bg-white p-7 shadow-card">
            <h1 className="mb-5 font-display text-xl font-semibold text-text">
              {admin ? 'Admin Login' : tab === 'login' ? 'Welcome back' : 'Create account'}
            </h1>

            {/* Tab switcher — customer only */}
            {!admin && (
              <div className="mb-5 flex rounded-xl bg-cream p-1">
                {['login', 'register'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(''); }}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                      tab === t ? 'bg-white text-coffee shadow-sm' : 'text-muted'
                    }`}
                  >
                    {t === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {!admin && tab === 'register' && (
                <>
                  <Field label="Full Name" value={form.name} onChange={set('name')} placeholder="Jordan Lee" />
                  <Field label="Phone (optional)" value={form.phone} onChange={set('phone')} placeholder="98765 43210" type="tel" />
                </>
              )}
              <Field label="Email" value={form.email} onChange={set('email')} placeholder="you@email.com" type="email" />
              <Field label="Password" value={form.password} onChange={set('password')} placeholder="••••••••" type="password" />

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#a8412f]">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-coffee py-2.5 text-sm font-semibold text-cream transition hover:bg-brown disabled:opacity-60"
              >
                {loading ? 'Please wait…' : admin ? 'Login' : tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {!admin && (
              <p className="mt-4 text-center text-sm text-muted">
                {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError(''); }}
                  className="font-medium text-olive hover:underline"
                >
                  {tab === 'login' ? 'Register' : 'Sign In'}
                </button>
              </p>
            )}
          </div>

          <p className="mt-4 text-center text-sm text-muted">
            <Link to="/" className="hover:underline">← Back to menu</Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-text">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-brown-light/30 bg-cream px-3.5 py-2.5 text-sm outline-none transition focus:border-olive focus:bg-white"
      />
    </label>
  );
}
