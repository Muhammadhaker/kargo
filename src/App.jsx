import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CargoForm from './components/CargoForm';
import CargoList from './components/CargoList';

export default function App() {
  // --- STATE (Holatlar) ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // --- BAZADAN MA'LUMOT OLISH ---
  const fetchItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Ma'lumotlarni olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- FORMA YUBORISH (SAQLASH) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    // Vergul yozilsa ham avtomatik nuqtaga o'giruvchi daxshatli funksiya
    const parseNumber = (val) => {
      if (!val) return 0;
      const cleanVal = String(val).replace(',', '.');
      return Number(cleanVal) || 0;
    };

    const cleanData = {
      ...formData,
      weight: parseNumber(formData.weight),
      shippingCostSom: parseNumber(formData.shippingCostSom), 
      yuanPrice: parseNumber(formData.yuanPrice),
      yuanRate: parseNumber(formData.yuanRate),
      quantity: Number(formData.quantity)
    };

    try {
      let res = editId 
        ? await fetch(`${API_URL}?id=${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanData) })
        : await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanData) });
      
      if (res.ok) {
        await fetchItems(); 
        setEditId(null);
        // Formani tozalash
        setFormData({ trackingCode: '', cargoType: 'avia', weight: '', shippingCostSom: '', yuanPrice: '', yuanRate: 1825, imageUrl: '', quantity: 1, status: 'ombor', shippedDate: '', arrivedDate: '' });
      } else {
        alert("Saqlashda xatolik yuz berdi!");
      }
    } catch (err) {
      console.error("Server xatosi:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // 🚀 TO'G'RILANGAN MANTIQ: Vazn faqat o'zi qo'shiladi (soniga ko'paytirilmaydi!)
  const totalWeight = items.reduce((acc, item) => acc + Number(item.weight || 0), 0);
  const totalSpend = items.reduce((acc, item) => acc + Number(item.shippingCostSom || 0), 0);
  const totalQuantity = items.reduce((acc, item) => acc + Number(item.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* 1. Yuqori qism (Statistika) */}
      <Header 
        totalWeight={totalWeight} 
        totalSpend={totalSpend} 
        totalQuantity={totalQuantity} 
      />

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* 2. Chap tomon (Yuk qo'shish formasi) */}
        <div className="xl:col-span-1">
          <CargoForm 
            formData={formData} 
            setFormData={setFormData} 
            handleSubmit={handleSubmit} 
            isSaving={isSaving} 
            editId={editId} 
          />
        </div>

        {/* 3. O'ng tomon (Yuklar ro'yxati) */}
        <div className="xl:col-span-2">
          <CargoList 
            items={items} 
            loading={loading} 
            setEditId={setEditId} 
            setFormData={setFormData} 
            fetchItems={fetchItems} 
            API_URL={API_URL} 
          />
        </div>

      </div>
    </div>
  );
}