import { useMemo, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import DietFilter from '../components/DietFilter';
import QuickViewModal from '../components/QuickViewModal';
import MenuGrid from '../components/MenuGrid';
import MenuCardSkeleton from '../components/MenuCardSkeleton';
import MiniCart from '../components/MiniCart';
import PageTransition from '../components/PageTransition';
import { imageMap } from '../data/menuData';
import { api } from '../lib/api';

export default function Home() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [dietFilter, setDietFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/menu')
      .then(data => {
        setMenuItems(
          data.items.map(item => ({
            ...item,
            id: item._id,
            image: imageMap[item.name] || item.image,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesDiet =
        dietFilter === 'all' || (dietFilter === 'veg' ? item.veg : !item.veg);
      return matchesCategory && matchesSearch && matchesDiet;
    });
  }, [menuItems, activeCategory, search, dietFilter]);

  return (
    <PageTransition>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1 px-4 py-6 pb-28 lg:px-8 lg:pb-10">
          <div className="mb-4">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="mb-6 overflow-x-auto">
            <DietFilter value={dietFilter} onChange={setDietFilter} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <MenuCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <MenuGrid items={filteredItems} onQuickView={setQuickViewItem} />
          )}
        </main>
      </div>

      <MiniCart />
      <QuickViewModal item={quickViewItem} onClose={() => setQuickViewItem(null)} />
    </PageTransition>
  );
}
