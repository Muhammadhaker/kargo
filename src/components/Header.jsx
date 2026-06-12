import React from 'react';

function Header({ totalWeight, totalSpend }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-slate-800 pb-6 gap-4">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="bg-gradient-to-tr from-amber-500 to-orange-600 p-3 rounded-xl text-slate-950 text-xl font-black shadow-lg shadow-orange-500/20 shrink-0">
          🇨🇳
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">YUKLARNI KUZATUVCHI</h1>
          <p className="text-xs text-slate-400 font-medium">Xitoy logistika va shaxsiy hisob tizimi</p>
        </div>
      </div>
      
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
  );
}

export default Header;