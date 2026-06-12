import React, { useState, useEffect } from 'react';
import { RiPlaneLine, RiTruckLine, RiDeleteBin6Line, RiCoinsLine, RiCalculatorLine, RiImageAddLine, RiLoader4Line } from 'react-icons/ri';

function App() {
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);  
  const [formData, setFormData] = useState({
    trackingCode: '',
    cargoType: 'avia',
    weight: '',
    pricePerKg: 9,
    yuanPrice: '',
    yuanRate: 1825,
    imageUrl: '', 
    quantity: 1
  });

  const IMGBB_API_KEY = '30f95aa52799ec65e58157db5b3d0bba'; 
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const imageFormData = new FormData();
    imageFormData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: imageFormData
      });
      const result = await response.json();
      
      if (result.success) {
        setFormData(prev => ({ ...prev, imageUrl: result.data.url }));
      } else {
        alert("Rasmni yuklashda xatolik yuz berdi!");
      }
    } catch (err) {
      console.error("ImgBB xatoligi:", err);
      alert("Rasm serveriga ulanishda xatolik!");
    } finally {
      setUploading(false);
    }
  };

  const handleCargoTypeChange = (type) => {
    setFormData({
      ...formData,
      cargoType: type,
      pricePerKg: type === 'avia' ? 9 : 6
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) {
      alert("Iltimos, rasm yuklanib bo'lishini kuting!");
      return;
    }
    
    setIsSaving(true);

    const cleanData = {
      ...formData,
      weight: Number(formData.weight),
      yuanPrice: Number(formData.yuanPrice),
      yuanRate: Number(formData.yuanRate),
      quantity: Number(formData.quantity)
    };

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      
      if (res.ok) {
        await fetchItems(); 
        setFormData({
          trackingCode: '',
          cargoType: 'avia',
          weight: '',
          pricePerKg: 9,
          yuanPrice: '',
          yuanRate: 1825,
          imageUrl: '',
          quantity: 1
        });
      } else {
        const errData = await res.json();
        alert("Xatolik: " + errData.error);
      }
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
      alert("Serverga ulanishda xatolik yuz berdi!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu yukni o'chirishni tasdiqlaysizmi?")) {
      await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  // Matematik hisob-kitoblar (Xavfsiz Number o'girmalari bilan)
  const calculateCosts = (item) => {
    const dollarRate = 12200; 
    const weight = parseFloat(item.weight) || 0;
    const pricePerKg = parseFloat(item.pricePerKg) || 0;
    const yuanPrice = parseFloat(item.yuanPrice) || 0;
    const yuanRate = parseFloat(item.yuanRate) || 0;
    const quantity = parseInt(item.quantity) || 1;

    const itemKargoSom = weight * pricePerKg * dollarRate;
    const itemYuanSom = yuanPrice * yuanRate;
    const totalSom = (itemKargoSom + itemYuanSom) * quantity;
    
    return { itemKargoSom, itemYuanSom, totalSom };
  };

  // Umumiy hisob paneli (Reduce amallari mustahkamlandi)
  const totalWeight = items.reduce((sum, item) => sum + ((parseFloat(item.weight) || 0) * (parseInt(item.quantity) || 1)), 0);
  const totalSpend = items.reduce((sum, item) => sum + calculateCosts(item).totalSom, 0);

  return (
    // translate="no" va notranslate klassi Google Translate buzg'unchiligini srazu to'xtatadi!
    <div translate="no" className="notranslate min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
      <div className="container mx-auto px-3 sm:px-4 py-6 max-w-6xl">
        
        {/* HEADER PANEL */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-3 rounded-xl text-slate-950 text-xl font-black shadow-lg shadow-orange-500/20 shrink-0">
              🇨🇳
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">YUKLARNI KUZATUVCHI</h1>
              <p className="text-xs text-slate-400 font-medium">Xitoy logistika va hisob tizimi</p>
            </div>
          </div>
          
          {/* STATISTIKA */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex-1 md:min-w-[140px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Umumiy Vazn</span>
              <span className="text-lg font-black text-amber-400">{totalWeight.toFixed(2)} kg</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex-1 md:min-w-[180px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Jami Xarajat</span>
              <span className="text-lg font-black text-emerald-400">{totalSpend.toLocaleString()} so'm</span>
            </div>
          </div>
        </header>

        {/* ASOSIY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* FORMA */}
          <div className="bg-slate-900 border border-slate-800/80 p-5 sm:p-6 rounded-2xl h-fit">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
              <RiCalculatorLine className="text-amber-500 text-lg" /> Yangi Yuk Qo'shish
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Trek Kod / Tovar Nomi</label>
                <input type="text" value={formData.trackingCode} onChange={e => setFormData({...formData, trackingCode: e.target.value})} placeholder="Masalan: Jinsi shorti full set..." required className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium shadow-inner" />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Kargo Yetkazish Usuli</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleCargoTypeChange('avia')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all ${formData.cargoType === 'avia' ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                    <RiPlaneLine className="text-sm" /> Avia ($9)
                  </button>
                  <button type="button" onClick={() => handleCargoTypeChange('avto')} className={`flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all ${formData.cargoType === 'avto' ? 'bg-green-500/20 border-green-500 text-green-400 shadow-md shadow-green-500/10' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                    <RiTruckLine className="text-sm" /> Avto ($6)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Vazni (kg)</label>
                  <input type="number" step="0.01" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="0.5" required className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium shadow-inner" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Soni (Dona)</label>
                  <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} min="1" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium shadow-inner" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Narxi (Yuan)</label>
                  <input type="number" step="0.01" value={formData.yuanPrice} onChange={e => setFormData({...formData, yuanPrice: e.target.value})} placeholder="26.8" required className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium shadow-inner" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Yuan Kursi</label>
                  <input type="number" value={formData.yuanRate} onChange={e => setFormData({...formData, yuanRate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium shadow-inner" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Tovar Rasmi</label>
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleImageUpload} id="file-upload" className="hidden" />
                  <label htmlFor="file-upload" className={`w-full bg-slate-950 border border-dashed border-slate-700 hover:border-amber-500 rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-slate-400 hover:text-white ${formData.imageUrl ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : ''}`}>
                    {uploading ? (
                      <>
                        <RiLoader4Line className="text-xl animate-spin text-amber-500" />
                        <span className="text-xs font-semibold">Rasm yuklanyapti...</span>
                      </>
                    ) : formData.imageUrl ? (
                      <>
                        <img src={formData.imageUrl} alt="Yuklandi" className="w-10 h-10 object-cover rounded-lg mb-1" />
                        <span className="text-xs font-bold text-emerald-400">Rasm yuklandi!</span>
                      </>
                    ) : (
                      <>
                        <RiImageAddLine className="text-2xl text-slate-500" />
                        <span className="text-xs font-medium">Rasm tanlash</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving || uploading} 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-black py-3.5 rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-2 mt-4 text-xs tracking-wider uppercase cursor-pointer disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <RiLoader4Line className="text-base animate-spin" />
                    Saqlanyapti...
                  </>
                ) : (
                  <>
                    <RiCoinsLine className="text-base" />
                    Hisoblash va Saqlash
                  </>
                )}
              </button>
            </form>
          </div>

          {/* LIST OMBORE */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              📦 Saqlangan Yuklar Ombori <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-bold">{items.length} ta</span>
            </h3>

            {/* MOBIL CARD VERSIYA (Xiaomi 12) */}
            <div className="block sm:hidden space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-sm font-medium">Hozircha kargo buyurtmalari kiritilmadi.</div>
              ) : (
                items.map((item) => {
                  const { itemKargoSom, itemYuanSom, totalSom } = calculateCosts(item);
                  return (
                    <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt="Kargo" className="w-12 h-12 object-cover rounded-xl border border-slate-800 shadow" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">NO IMG</div>
                        )}
                        <div className="truncate pr-8">
                          <h4 className="font-black text-white text-base truncate tracking-tight">{item.trackingCode}</h4>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase mt-1 ${item.cargoType === 'avia' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                            {item.cargoType === 'avia' ? <RiPlaneLine /> : <RiTruckLine />} {item.cargoType}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2.5 text-xs">
                        <div>
                          <span className="text-slate-500 block">Og'irlik / Soni:</span>
                          <span className="text-slate-200 font-bold">{item.weight} kg / {item.quantity} ta</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Kargo Yo'li:</span>
                          <span className="text-slate-200 font-semibold">{itemKargoSom.toLocaleString()} so'm</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Pinduoduo:</span>
                          <span className="text-slate-200 font-semibold">{item.yuanPrice} ¥ ({itemYuanSom.toLocaleString()} so'm)</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Umumiy Tannarx:</span>
                          <span className="text-emerald-400 font-black text-sm">{totalSom.toLocaleString()} so'm</span>
                        </div>
                      </div>

                      <button onClick={() => handleDelete(item._id)} className="absolute top-3 right-3 p-2 bg-slate-950 border border-slate-800 rounded-xl text-red-400 active:bg-red-500/20 active:border-red-500/30 transition-all">
                        <RiDeleteBin6Line className="text-sm" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* DESKTOP TABLE VERSIYA */}
            <div className="hidden sm:block overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] text-slate-400 uppercase tracking-widest font-black">
                    <th className="py-4 px-4">Rasm</th>
                    <th className="py-4 px-4">Buyurtma Nomi</th>
                    <th className="py-4 px-4">Kargo Turi</th>
                    <th className="py-4 px-4">Og'irlik</th>
                    <th className="py-4 px-4">Kargo Yo'li</th>
                    <th className="py-4 px-4">Pinduoduo</th>
                    <th className="py-4 px-4">Jami Tannarx</th>
                    <th className="py-4 px-4 text-center">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-sm">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-16 text-slate-500 font-medium tracking-wide">Hozircha kargo buyurtmalari kiritilmadi.</td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const { itemKargoSom, itemYuanSom, totalSom } = calculateCosts(item);
                      return (
                        <tr key={item._id} className="hover:bg-slate-800/20 transition-all group">
                          <td className="py-4 px-4">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt="Kargo" className="w-12 h-12 object-cover rounded-xl border border-slate-800 bg-slate-950 shadow" />
                            ) : (
                              <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-600">NO IMG</div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-black text-white max-w-[140px] truncate tracking-tight">{item.trackingCode}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${item.cargoType === 'avia' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                              {item.cargoType === 'avia' ? <RiPlaneLine /> : <RiTruckLine />} {item.cargoType}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-200 font-bold tracking-tight">{item.weight} kg <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">{item.quantity} dona</span></td>
                          <td className="py-4 px-4 text-slate-400 font-semibold text-xs">{itemKargoSom.toLocaleString()} so'm</td>
                          <td className="py-4 px-4 text-slate-400 font-semibold text-xs">{item.yuanPrice} ¥ <span className="text-[10px] font-medium text-slate-500 block mt-0.5">{itemYuanSom.toLocaleString()} so'm</span></td>
                          <td className="py-4 px-4">
                            <span className="text-emerald-400 font-black block tracking-tight">{totalSom.toLocaleString()} so'm</span>
                            <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">{(itemKargoSom + itemYuanSom).toLocaleString()} / dona</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <button onClick={() => handleDelete(item._id)} className="p-2.5 bg-slate-950 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-500/20 rounded-xl transition-all shadow-md">
                              <RiDeleteBin6Line className="text-sm" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;