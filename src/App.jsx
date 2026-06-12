import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CargoForm from './components/CargoForm';
import CargoList from './components/CargoList';

function App() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  
  const [editId, setEditId] = useState(null); 

  const [formData, setFormData] = useState({
    trackingCode: '',     
    cargoType: 'avia',
    weight: '',
    shippingCostSom: '',  
    yuanPrice: '',
    yuanRate: 1825,
    imageUrl: '', 
    quantity: 1,
    status: 'ombor',
    shippedDate: '',
    arrivedDate: ''
  });

  const API_URL = '/api/kargo';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
    }
  };

  const calculateCosts = (item) => {
    const yuanPrice = parseFloat(item.yuanPrice) || 0;
    const yuanRate = parseFloat(item.yuanRate) || 0;
    const shippingCostSom = parseFloat(item.shippingCostSom) || 0; 
    const quantity = parseInt(item.quantity) || 1;

    const itemYuanSom = yuanPrice * yuanRate;
    const totalSom = (itemYuanSom + shippingCostSom) * quantity;
    
    return { itemYuanSom, totalSom };
  };

  const totalWeight = items.reduce((sum, item) => sum + ((parseFloat(item.weight) || 0) * (parseInt(item.quantity) || 1)), 0);
  const totalSpend = items.reduce((sum, item) => sum + calculateCosts(item).totalSom, 0);

  const filteredItems = items.filter(item => {
    return (item.trackingCode || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;
    setIsSaving(true);

    const cleanData = {
      ...formData,
      weight: Number(formData.weight),
      shippingCostSom: Number(formData.shippingCostSom), 
      yuanPrice: Number(formData.yuanPrice),
      yuanRate: Number(formData.yuanRate),
      quantity: Number(formData.quantity)
    };

    try {
      let res = editId 
        ? await fetch(`${API_URL}?id=${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanData) })
        : await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanData) });
      
      if (res.ok) {
        await fetchItems(); 
        setEditId(null);
        setFormData({ trackingCode: '', cargoType: 'avia', weight: '', shippingCostSom: '', yuanPrice: '', yuanRate: 1825, imageUrl: '', quantity: 1, status: 'ombor', shippedDate: '', arrivedDate: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("O'chirishni tasdiqlaysizmi?")) {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  return (
    <div translate="no" className="notranslate min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
      <div className="container mx-auto px-3 sm:px-4 py-6 max-w-6xl">
        <Header totalWeight={totalWeight} totalSpend={totalSpend} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CargoForm 
            formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} 
            uploading={uploading} isSaving={isSaving} editId={editId} setEditId={setEditId} 
          />
          <CargoList 
            filteredItems={filteredItems} searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            calculateCosts={calculateCosts} handleEdit={(item) => { setEditId(item._id); setFormData(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }} handleDelete={handleDelete} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;