import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const EMPTY = { code: '', discountPercent: '', maxDiscount: '', minOrder: '', maxUses: '', expiresAt: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/admin/coupons')
      .then(d => setCoupons(d.coupons))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.code.trim() || !form.discountPercent) { setError('Code and discount % are required'); return; }
    setSaving(true); setError('');
    try {
      const body = {
        code: form.code.toUpperCase(),
        discountPercent: Number(form.discountPercent),
        ...(form.maxDiscount && { maxDiscount: Number(form.maxDiscount) }),
        ...(form.minOrder && { minOrder: Number(form.minOrder) }),
        ...(form.maxUses && { maxUses: Number(form.maxUses) }),
        ...(form.expiresAt && { expiresAt: new Date(form.expiresAt) }),
      };
      const d = await api.post('/admin/coupons', body);
      setCoupons(prev => [d.coupon, ...prev]);
      setForm(EMPTY);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(coupon) {
    try {
      const d = await api.put(`/admin/coupons/${coupon._id}`, { active: !coupon.active });
      setCoupons(prev => prev.map(c => c._id === coupon._id ? d.coupon : c));
    } catch (err) { alert(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/admin/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-coffee">Coupons</h1>
        <button
          onClick={() => { setShowForm(v => !v); setError(''); }}
          className="rounded-xl bg-coffee px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-brown"
        >
          {showForm ? 'Cancel' : '+ New Coupon'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-4 font-display text-base font-semibold text-text">New Coupon</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CField label="Code" value={form.code} onChange={set('code')} placeholder="WELCOME20" />
            <CField label="Discount %" value={form.discountPercent} onChange={set('discountPercent')} placeholder="20" type="number" />
            <CField label="Max Discount (₹)" value={form.maxDiscount} onChange={set('maxDiscount')} placeholder="100 (optional)" type="number" />
            <CField label="Min Order (₹)" value={form.minOrder} onChange={set('minOrder')} placeholder="0" type="number" />
            <CField label="Max Uses" value={form.maxUses} onChange={set('maxUses')} placeholder="unlimited" type="number" />
            <CField label="Expires At" value={form.expiresAt} onChange={set('expiresAt')} type="datetime-local" />
          </div>
          {error && <p className="mt-2 text-sm text-[#a8412f]">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-xl bg-coffee px-5 py-2.5 text-sm font-semibold text-cream hover:bg-brown disabled:opacity-60"
          >
            {saving ? 'Creating…' : 'Create Coupon'}
          </button>
        </form>
      )}

      {/* Coupon list */}
      <div className="rounded-2xl bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Loading…</div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">No coupons yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-cream">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted">
                  {['Code', 'Discount', 'Min Order', 'Uses', 'Expires', 'Active', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {coupons.map(c => (
                  <tr key={c._id} className="hover:bg-cream/40">
                    <td className="px-4 py-3 font-mono font-semibold text-coffee">{c.code}</td>
                    <td className="px-4 py-3 text-text">
                      {c.discountPercent}%{c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}
                    </td>
                    <td className="px-4 py-3 text-muted">₹{c.minOrder}</td>
                    <td className="px-4 py-3 text-muted">
                      {c.uses}{c.maxUses ? `/${c.maxUses}` : ''}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function CField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-text">{label}</span>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-xl border border-brown-light/30 bg-cream px-3 py-2.5 text-sm outline-none focus:border-olive focus:bg-white"
      />
    </label>
  );
}
