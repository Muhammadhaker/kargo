import React from 'react';
import { RiSearchLine, RiPlaneLine, RiTruckLine, RiTimeLine, RiCalendarCheckLine, RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';

function CargoList({ filteredItems, searchQuery, setSearchQuery, calculateCosts, handleEdit, handleDelete }) {
  return (
    <div className="lg:col-span-2 space-y-4 min-w-0"> {/* min-w-0 siqilishni oldini oladi */}
      
      {/* AQLLI QIDIRUV INPUTI */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <RiSearchLine className="text-slate-500 text-lg" />
        </span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Trek kod yoki kiyim nomini yozib qidiring..."
          className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-white placeholder:text-slate-500 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none transition-all text-sm font-medium shadow-md"
        />
      </div>

      <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider pt-2">
        📦 Saqlangan Yuklar Ombori <span className="bg-slate-900 text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-lg text-xs font-bold">{filteredItems.length} ta</span>
      </h3>

      {/* MOBIL CARD VERSIYA (Xiaomi 12) */}
      <div className="block sm:hidden space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-sm font-medium">Hech qanday yuk topilmadi.</div>
        ) : (
          filteredItems.map((item) => {
            const { totalSom } = calculateCosts(item);
            return (
              <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="Kargo" className="w-12 h-12 object-cover rounded-xl border border-slate-800 shadow" />
                  ) : (
                    <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">NO IMG</div>
                  )}
                  <div className="truncate pr-16">
                    <h4 className="font-black text-white text-base truncate tracking-tight">{item.trackingCode}</h4>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${item.cargoType === 'avia' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                        {item.cargoType === 'avia' ? <RiPlaneLine /> : <RiTruckLine />} {item.cargoType}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold ${item.status === 'keldi' ? 'bg-emerald-500/20 text-emerald-400' : item.status === 'yolda' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                        {item.status === 'keldi' ? 'Keldi 🇺🇿' : item.status === 'yolda' ? 'Yo\'lda 🚚' : 'Omborda 🇨🇳'}
                      </span>
                    </div>
                  </div>
                </div>

                {(item.shippedDate || item.arrivedDate) && (
                  <div className="bg-slate-950/40 p-2 rounded-xl border border-slate-800/40 text-[11px] space-y-1 text-slate-400">
                    {item.shippedDate && <div className="flex items-center gap-1"><RiTimeLine className="text-amber-500" /> Yo'lga chiqdi: {item.shippedDate}</div>}
                    {item.arrivedDate && <div className="flex items-center gap-1"><RiCalendarCheckLine className="text-emerald-500" /> Yetib keldi: {item.arrivedDate}</div>}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block">Og'irlik / Soni:</span>
                    <span className="text-slate-200 font-bold">{item.weight} kg / {item.quantity} ta</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Yo'l Haqiqi (Kargo):</span>
                    <span className="text-amber-400 font-bold">{(parseFloat(item.shippingCostSom) || 0).toLocaleString()} s</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pinduoduo (Puli):</span>
                    <span className="text-slate-200 font-semibold">{item.yuanPrice} ¥</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Umumiy Tannarx:</span>
                    <span className="text-emerald-400 font-black text-sm">{totalSom.toLocaleString()} so'm</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button onClick={() => handleEdit(item)} className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 active:bg-amber-500/10">
                    <RiEdit2Line className="text-xs" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-red-400 active:bg-red-500/10">
                    <RiDeleteBin6Line className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VERSIYA - Paddinglar qisqartirildi, skrol chizig'i butunlay yo'qoladi */}
      <div className="hidden sm:block border border-slate-800 rounded-2xl bg-slate-900 overflow-hidden">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60 text-[9px] text-slate-400 uppercase tracking-wider font-black">
              <th className="py-3 px-2 pl-3">Rasm</th>
              <th className="py-3 px-2">Trek / Nomi</th>
              <th className="py-3 px-2">Holat</th>
              <th className="py-3 px-2">Kargo</th>
              <th className="py-3 px-2">Vazn</th>
              <th className="py-3 px-2">Yo'l haqi</th>
              <th className="py-3 px-2">Pinduoduo</th>
              <th className="py-3 px-2">Tannarx</th>
              <th className="py-3 px-2 text-center pr-3">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-xs">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-16 text-slate-500 font-medium tracking-wide">Hech qanday yuk topilmadi.</td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const { totalSom } = calculateCosts(item);
                return (
                  <tr key={item._id} className="hover:bg-slate-800/20 transition-all group">
                    <td className="py-3 px-2 pl-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="Kargo" className="w-9 h-9 object-cover rounded-lg border border-slate-800 bg-slate-950 shadow" />
                      ) : (
                        <div className="w-9 h-9 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center text-[8px] font-black text-slate-600">NO IMG</div>
                      )}
                    </td>
                    <td className="py-3 px-2 font-black text-white max-w-[110px] truncate tracking-tight">{item.trackingCode}</td>
                    
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${item.status === 'keldi' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.status === 'yolda' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>
                        {item.status === 'keldi' ? 'Keldi 🇺🇿' : item.status === 'yolda' ? 'Yo\'lda 🚚' : 'Ombor 🇨🇳'}
                      </span>
                    </td>

                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${item.cargoType === 'avia' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400'}`}>
                        {item.cargoType}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-200 font-bold tracking-tight text-xs">
                      {item.weight} kg
                      <span className="text-[10px] font-normal text-slate-500 block">{item.quantity} ta</span>
                    </td>
                    <td className="py-3 px-2 text-amber-400 font-bold text-xs">{(parseFloat(item.shippingCostSom) || 0).toLocaleString()} s</td>
                    <td className="py-3 px-2 text-slate-400 font-medium text-xs">{item.yuanPrice} ¥</td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className="text-emerald-400 font-black block tracking-tight text-xs">{totalSom.toLocaleString()} so'm</span>
                    </td>
                    <td className="py-3 px-2 text-center pr-3">
                      <div className="flex justify-center gap-1">
                        <button onClick={() => handleEdit(item)} className="p-1.5 bg-slate-950 hover:bg-amber-500/10 text-slate-500 hover:text-amber-400 border border-slate-800 rounded-lg transition-all shadow-sm">
                          <RiEdit2Line className="text-xs" />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-slate-950 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-slate-800 rounded-lg transition-all shadow-sm">
                          <RiDeleteBin6Line className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default CargoList;