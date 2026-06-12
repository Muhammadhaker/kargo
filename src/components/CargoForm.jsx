import React from 'react';
import { RiCalculatorLine, RiPlaneLine, RiTruckLine, RiLoader4Line, RiCoinsLine } from 'react-icons/ri';

function CargoForm({ formData, setFormData, handleSubmit, handleImageUpload, uploading, isSaving, editId, setEditId }) {
  
  const handleCargoTypeChange = (type) => {
    setFormData({ ...formData, cargoType: type });
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 p-5 sm:p-6 rounded-2xl h-fit">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 uppercase tracking-wider">
        <RiCalculatorLine className="text-amber-500 text-lg" /> 
        {editId ? "Yukni Tahrirlash" : "Yangi Yuk Qo'shish"}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Trek Kod / Kiyim Nomi</label>
          <input type="text" value={formData.trackingCode} onChange={e => setFormData({...formData, trackingCode: e.target.value})} placeholder="Masalan: JT548885... yoki Black Hoodie" required className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium" />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Yuk Holati (Status)</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium">
            <option value="ombor">Xitoy Omborida 🇨🇳</option>
            <option value="yolda">Yo'lga Chiqqan 🚚</option>
            <option value="keldi">Yetib Kelgan 🇺🇿</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Yo'lga chiqqan</label>
            <input type="date" value={formData.shippedDate} onChange={e => setFormData({...formData, shippedDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none transition-all text-xs font-medium" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Yetib kelgan</label>
            <input type="date" value={formData.arrivedDate} onChange={e => setFormData({...formData, arrivedDate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-300 rounded-xl px-3 py-2.5 focus:outline-none transition-all text-xs font-medium" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Vazni (kg)</label>
            <input type="number" step="0.01" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="0.5" required className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Soni (Dona)</label>
            <input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} min="1" className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1.5">Yo'l haqi (Jami so'mda)</label>
          <input type="number" value={formData.shippingCostSom} onChange={e => setFormData({...formData, shippingCostSom: e.target.value})} placeholder="Masalan: 15000" required className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-black text-amber-400" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Narxi (Yuan)</label>
            <input type="number" step="0.01" value={formData.yuanPrice} onChange={e => setFormData({...formData, yuanPrice: e.target.value})} placeholder="26.8" required className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-600 rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium" />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Yuan Kursi</label>
            <input type="number" value={formData.yuanRate} onChange={e => setFormData({...formData, yuanRate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-4 py-3 focus:outline-none transition-all text-sm font-medium" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">Kargo turi va Rasm</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button type="button" onClick={() => handleCargoTypeChange('avia')} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${formData.cargoType === 'avia' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <RiPlaneLine /> Avia
            </button>
            <button type="button" onClick={() => handleCargoTypeChange('avto')} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${formData.cargoType === 'avto' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              <RiTruckLine /> Avto
            </button>
          </div>
          
          <div className="relative">
            <input type="file" accept="image/*" onChange={handleImageUpload} id="file-upload" className="hidden" />
            <label htmlFor="file-upload" className={`w-full bg-slate-950 border border-dashed border-slate-700 hover:border-amber-500 rounded-xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer transition-all text-slate-400 hover:text-white ${formData.imageUrl ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' : ''}`}>
              {uploading ? (
                <>
                  <RiLoader4Line className="text-base animate-spin text-amber-500" />
                  <span className="text-xs font-semibold">Yuklanyapti...</span>
                </>
              ) : formData.imageUrl ? (
                <span className="text-xs font-bold text-emerald-400">Rasm tanlandi!</span>
              ) : (
                <span className="text-xs font-medium">Rasm tanlash</span>
              )}
            </label>
          </div>
        </div>

        <button type="submit" disabled={isSaving || uploading} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-black py-3.5 rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-2 mt-4 text-xs tracking-wider uppercase cursor-pointer disabled:cursor-not-allowed">
          {isSaving ? <RiLoader4Line className="text-base animate-spin" /> : <RiCoinsLine className="text-base" />}
          {isSaving ? 'Saqlanyapti...' : editId ? 'Ma\'lumotni Yangilash' : 'Hisoblash va Saqlash'}
        </button>

        {editId && (
          <button type="button" onClick={() => { setEditId(null); setFormData({ trackingCode: '', cargoType: 'avia', weight: '', shippingCostSom: '', yuanPrice: '', yuanRate: 1825, imageUrl: '', quantity: 1, status: 'ombor', shippedDate: '', arrivedDate: '' }); }} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all">
            Bekor qilish
          </button>
        )}
      </form>
    </div>
  );
}

export default CargoForm;