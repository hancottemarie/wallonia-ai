import React, { useState } from 'react';

export default function TravelForm({ onSearch }) {
  const [vibe, setVibe] = useState('Adventure');
  const [budget, setBudget] = useState(2);
  const [province, setProvince] = useState('toutes')

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ vibe, budget_max: budget, province });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl max-w-md mx-auto mt-10 border border-slate-100 dark:border-slate-800 transition-colors duration-500"
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white transition-colors">
        Where to in Wallonia?
      </h2>

      {/* Sélecteur de Vibe */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
          What's your mood?
        </label>
        <select
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          <option value="Adventure">Adventure 🧗</option>
          <option value="Chill">Chill 🧘</option>
          <option value="Culture">Culture 🏛️</option>
          <option value="Food">Food 🍟</option>
        </select>
      </div>

	{/* 3. NOUVEAU SÉLECTEUR DE PROVINCE */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
          Which area?
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          <option value="toutes">All Wallonia 🇧🇪</option>
          <option value="Brabant Wallon">Brabant Wallon</option>
          <option value="Hainaut">Hainaut</option>
          <option value="Liège">Liège</option>
          <option value="Luxembourg">Luxembourg</option>
          <option value="Namur">Namur</option>
        </select>
      </div>

      {/* Slider de Budget */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 transition-colors">
          Budget Level
        </label>
        <input
          type="range" min="1" max="3"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value))}
          className="w-full h-2 bg-blue-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 px-1 transition-colors">
          <span>Budget</span>
          <span>Moderate</span>
          <span>Luxury</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg active:scale-95"
      >
        Find my hidden gem ✨
      </button>
    </form>
  );
}
