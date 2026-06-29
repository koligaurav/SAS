import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { formatPrice } from '../../utils/format';

const CATEGORIES = ['pizza', 'burger', 'sandwich', 'pasta', 'wrap', 'snacks', 'appetizer', 'dessert', 'beverage', 'coffee'];

const EMPTY_FORM = { name: '', category: 'pizza', price: '', rating: '4.5', veg: true, description: '', featured: false, available: true };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | item
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function fetchAll() {
    api.get('/menu?all=true')
      .then(d => setItems(d.items))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchAll(); }, []);

  function openAdd() { setForm(EMPTY_FORM); setError(''); setModal('add'); }
  function openEdit(item) {
    setForm({ ...item, price: String(item.price), rating: String(item.rating) });
    setError('');
    setModal(item);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) { setError('Name and price are required'); return; }
    setSaving(true); setError('');
    try {
      const body = { ...form, price: Number(form.price), rating: Number(form.rating) };
      if (modal === 'add') {
        const d = await api.post('/admin/menu', body);
        setItems(prev => [d.item, ...prev]);
      } else {
        const d = await api.put(`/admin/menu/${modal._id}`, body);
        setItems(prev => prev.map(i => i._id === d.item._id ? d.item : i));
      }
      setModal(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailable(item) {
    try {
      const d = await api.put(`/admin/menu/${item._id}`, { available: !item.available });
      setItems(prev => prev.map(i => i._id === item._id ? d.item : i));
    } catch (err) { alert(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/admin/menu/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) { alert(err.message); }
  }

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-coffee">Menu Items</h1>
        <button
          onClick={openAdd}
          className="rounded-xl bg-coffee px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-brown"
        >
          + Add Item
        </button>
      </div>

      <div className="rounded-2xl bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-cream">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted">
                  {['Name', 'Category', 'Price', 'Veg', 'Available', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {items.map(item => (
                  <tr key={item._id} className="hover:bg-cream/40">
                    <td className="px-4 py-3 font-medium text-text">{item.name}</td>
                    <td className="px-4 py-3 capitalize text-muted">{item.category}</td>
                    <td className="px-4 py-3 text-coffee font-medium">{formatPrice(item.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block h-3 w-3 rounded-full ${item.veg ? 'bg-green-500' : 'bg-red-500'}`} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleAvailable(item)}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'}`}
                      >
                        {item.available ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${item.featured ? 'text-amber-600' : 'text-muted'}`}>
                        {item.featured ? '★ Yes' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="rounded-lg bg-cream px-2.5 py-1 text-xs font-medium text-text hover:bg-brown-light/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-featured">
            <h2 className="mb-4 font-display text-lg font-semibold text-text">
              {modal === 'add' ? 'Add Menu Item' : `Edit — ${modal.name}`}
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <MField label="Name" value={form.name} onChange={set('name')} placeholder="Margherita Pizza" />
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-text">Category</span>
                  <select
                    value={form.category}
                    onChange={set('category')}
                    className="w-full rounded-xl border border-brown-light/30 bg-cream px-3 py-2.5 text-sm capitalize outline-none focus:border-olive"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
                <MField label="Price (₹)" value={form.price} onChange={set('price')} placeholder="299" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <MField label="Rating" value={form.rating} onChange={set('rating')} placeholder="4.5" type="number" step="0.1" min="0" max="5" />
              </div>
              <MField label="Description" value={form.description} onChange={set('description')} placeholder="Short description…" />
              <div className="flex gap-5 text-sm">
                <Checkbox label="Vegetarian" checked={form.veg} onChange={set('veg')} />
                <Checkbox label="Featured" checked={form.featured} onChange={set('featured')} />
                <Checkbox label="Available" checked={form.available} onChange={set('available')} />
              </div>
              {error && <p className="text-sm text-[#a8412f]">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 rounded-xl border border-brown-light/30 py-2.5 text-sm font-medium text-muted hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-coffee py-2.5 text-sm font-semibold text-cream hover:bg-brown disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MField({ label, value, onChange, placeholder, type = 'text', step, min, max }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-text">{label}</span>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        step={step} min={min} max={max}
        className="w-full rounded-xl border border-brown-light/30 bg-cream px-3 py-2.5 text-sm outline-none focus:border-olive focus:bg-white"
      />
    </label>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-olive" />
      <span className="font-medium text-text">{label}</span>
    </label>
  );
}
