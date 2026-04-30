import { useState } from 'react'
import TravelForm from './components/TravelForm' // On importe ta brique LEGO

function App() {
  // Cette fonction recevra les données de l'enfant (TravelForm)
  const handleSearch = (data) => {
    console.log("Données reçues du formulaire :", data);
    alert(`Recherche lancée pour : ${data.vibe} avec un budget de ${data.budget_max}/3`);
  };

  return (
    // "min-h-screen" force le fond gris à prendre toute la hauteur de l'écran
    <div className="min-h-screen bg-gray-100 py-12 px-4">

      {/* En-tête de l'application */}
      <header className="max-w-md mx-auto text-center mb-10">
        <h1 className="text-4xl font-black text-blue-900 tracking-tight">
          Wallonia<span className="text-blue-500">.ai</span>
        </h1>
        <p className="text-gray-500 font-medium mt-2">
          Find the perfect hidden gem in South Belgium
        </p>
      </header>

      {/* On affiche ton composant Formulaire */}
      {/* onSearch est la "prop" qui permet de faire remonter les données ici */}
      <TravelForm onSearch={handleSearch} />

    </div>
  )
}

export default App
