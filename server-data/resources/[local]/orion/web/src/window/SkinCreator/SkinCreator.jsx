import React, { useEffect } from 'react'
import './SkinCreator.css'

export default function SkinCreator() {

  useEffect(() => {
  }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      // Logique pour envoyer les données au serveur
    };
  return (
    <div className="skinCreator">
      <form onSubmit={handleSubmit}>
        {/* Champs de formulaire pour la personnalisation */}
        <input type="radio" name="dad" value="dad1" onChange={(e) => setDad(e.target.value)} />
        {/* ... autres champs de formulaire */}
      </form>
      {/* ... autres éléments de l'interface */}
    </div>
  );
}
