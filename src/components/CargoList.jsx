import React, { useState } from 'react';

export default function CargoList({ filteredItems, searchQuery, setSearchQuery, calculateCosts, handleEdit, handleDelete }) {
  // Modal oynani boshqarish uchun yangi state'lar
  const [selectedItem, setSelectedItem] = useState(null);
  const [zoomedImg, setZoomedImg] = useState(null);

  return (
    <div className="bg-slate-900/50 p-4 sm:p-6 rounded-2xl border border-slate-800 relative">
      {/* 🔍 Qidiruv qismi */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          📦 Ombor <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded-md">{filteredItems.length} ta yuk</span>
        </h2>
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            placeholder="Trek kod yozib qidiring..."
            className="w-full bg-slate-800 text-white rounded-xl pl-10 pr-4 py-2.5 border border-slate-700 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
        </div>
      </div>

      {/* 📋 Qisqartirilgan Ro'yxat */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">Yuklar topilmadi.</div>
        ) : (
          filteredItems.map(item => {
            const costs = calculateCosts(item);
            return (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)} // Bosganda modal ochiladi
                className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-amber-500/50 cursor-pointer transition-all flex justify-between items-center group shadow-sm"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="yuk" className="w-12 h-12 object-cover rounded-lg border border-slate-600 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-xl border border-slate-600 flex-shrink-0">📦</div>
                  )}
                  <div className="truncate pr-2">
                    <h3 className="text-amber-400 font-bold truncate">{item.trackingCode}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {item.weight} kg • {item.quantity} ta • <span className={`${item.status === 'ombor' ? 'text-slate-400' : item.status === 'yolda' ? 'text-amber-500' : 'text-emerald-500'}`}>{item.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="font-bold text-emerald-400 text-sm">{costs.totalSom.toLocaleString()} so'm</div>
                  </div>
                  {/* Tugmalar bosilganda oyna ochilib ketmasligi uchun e.stopPropagation() ishlatamiz */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEdit(item); }}
                      className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 🚀 MODAL OYNA (BATAFSIL MA'LUMOT) */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div
            className="bg-slate-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1/3 QISM: RASM */}
            <div className="relative h-48 sm:h-56 bg-slate-800 flex-shrink-0 cursor-pointer group" onClick={() => setZoomedImg(selectedItem.imageUrl)}>
              {selectedItem.imageUrl ? (
                <img src={selectedItem.imageUrl} alt="yuk" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
              )}
              {/* Zoom yozuvi */}
              {selectedItem.imageUrl && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white font-bold bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">🔍 Kattalashtirish</span>
                </div>
              )}
              {/* Yopish tugmasi */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              >
                ✕
              </button>
            </div>

            {/* 2/3 QISM: MA'LUMOTLAR */}
            <div className="p-5 overflow-y-auto custom-scrollbar">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-500 break-all text-center mb-5">{selectedItem.trackingCode}</h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block text-xs mb-1">Holati</span>
                  <span className={`font-bold uppercase px-2 py-0.5 rounded text-xs ${selectedItem.status === 'ombor' ? 'bg-slate-700 text-slate-300' :
                      selectedItem.status === 'yolda' ? 'bg-amber-900/50 text-amber-500' :
                        'bg-emerald-900/50 text-emerald-500'
                    }`}>
                    {selectedItem.status === 'ombor' ? '📦 Omborda' : selectedItem.status === 'yolda' ? '🚚 Yo\'lda' : '✅ Keldi'}
                  </span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block text-xs mb-1">Kargo Turi</span>
                  <span className="font-bold uppercase text-white">{selectedItem.cargoType === 'avia' ? '✈️ Avia' : '🚚 Avto'}</span>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block text-xs mb-1">Vazni</span>
                  <span className="font-bold text-white text-lg">{selectedItem.weight} <span className="text-sm font-normal text-slate-400">kg</span></span>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 block text-xs mb-1">Soni</span>
                  <span className="font-bold text-white text-lg">{selectedItem.quantity} <span className="text-sm font-normal text-slate-400">ta</span></span>
                </div>

                <div className="col-span-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 flex justify-between">
                  <div>
                    <span className="text-slate-400 block text-xs mb-1">Yo'lga chiqqan</span>
                    <span className="font-medium text-white">{selectedItem.shippedDate || 'Belgilanmagan'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-xs mb-1">Yetib kelgan</span>
                    <span className="font-medium text-white">{selectedItem.arrivedDate || 'Belgilanmagan'}</span>
                  </div>
                </div>
              </div>

              {/* Moliya qismi */}
              <div className="mt-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-400">Xitoy narxi (Yuan):</span>
                  <span className="text-white">{selectedItem.yuanPrice} ¥ <span className="text-slate-500">(Kurs: {selectedItem.yuanRate})</span></span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-400">Mato Xitoy (So'm):</span>
                  <span className="text-white">{calculateCosts(selectedItem).itemYuanSom.toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-slate-400">Kargo xizmati:</span>
                  <span className="text-amber-400 font-medium">+{selectedItem.shippingCostSom.toLocaleString()} so'm</span>
                </div>
                <div className="border-t border-slate-600 border-dashed pt-3 flex justify-between items-center">
                  <span className="text-slate-300 font-bold text-sm">JAMI TO'LOV:</span>
                  <span className="text-xl font-black text-emerald-400">{calculateCosts(selectedItem).totalSom.toLocaleString()} so'm</span>
                </div>
              </div>

              {/* Modal ichida ham tugmalar */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => { handleEdit(selectedItem); setSelectedItem(null); }}
                  className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-2.5 rounded-xl font-medium transition-colors border border-blue-600/50"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => { handleDelete(selectedItem._id); setSelectedItem(null); }}
                  className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white py-2.5 rounded-xl font-medium transition-colors border border-red-600/50"
                >
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 RASMNI FULLSCREEN KATTALASHTIRISH (ZOOM) */}
      {zoomedImg && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-2 cursor-zoom-out backdrop-blur-lg"
          onClick={() => setZoomedImg(null)}
        >
          <img
            src={zoomedImg}
            alt="zoomed"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
          <button
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-red-500 rounded-full w-12 h-12 flex items-center justify-center text-2xl transition-colors backdrop-blur-md"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}