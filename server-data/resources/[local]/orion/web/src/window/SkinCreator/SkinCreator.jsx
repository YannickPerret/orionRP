import React, { useEffect } from 'react'
import './SkinCreator.css'
import Morphology from './Components/Morphology/Morphology';

export default function SkinCreator() {

  useEffect(() => {
  }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      // Logique pour envoyer les données au serveur
    };
  return (
    <div className="skinCreator">
     <Morphology />
    </div>
  );
}
