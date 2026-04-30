import React, { useState } from 'react';

export default function TravelForm({ onSearch }) {
  // 1. Définition de l'état (la mémoire du formulaire)
  const [vibe, setVibe] = useState('Adventure');
  const [budget, setBudget] = useState(2);

  // 2. Fonction appelée lors de la soumission
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche la page de se recharger
    onSearch({ vibe, budget_max: budget });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-blue-900">Where to in Wallonia?</h2>

      {/* Sélecteur de Vibe */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">What's your mood?</label>
        <select
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
        >
          <option value="Adventure">Adventure 🧗</option>
          <option value="Chill">Chill 🧘</option>
          <option value="Culture">Culture 🏛️</option>
          <option value="Food">Food 🍟</option>
        </select>
      </div>

      {/* Slider de Budget */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Budget Level</label>
        <input
          type="range" min="1" max="3"
          value={budget}
          onChange={(e) => setBudget(parseInt(e.target.value))}
          className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs font-medium text-gray-500 mt-2 px-1">
          <span>Budget</span>
          <span>Moderate</span>
          <span>Luxury</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-md"
      >
        Find my hidden gem ✨
      </button>
    </form>
  );
}
