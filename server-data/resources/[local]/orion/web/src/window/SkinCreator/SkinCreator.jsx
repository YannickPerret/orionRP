import React, { useEffect, useState } from 'react'
import './SkinCreator.css'
import Morphology from './Components/Morphology/Morphology';

export default function SkinCreator() {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const handleSubmit = () => {
    console.log(firstname, lastname);
  };
  return (
    <div className="skinCreator">
     <Morphology />

     <div className='skinCreator__bottom'>
      <input value={firstname} onChange={(e) => setFirstname(e.target.value)} type="text" placeholder="Firstname" />
      <input value={lastname} onChange={(e) => setLastname(e.target.value)} type="text" placeholder="Lastname" />
     </div>

      <div className='skinCreator__valid'>
        <button>Reset</button>
        <button onClick={handleSubmit}>Valider</button>
      </div>
    </div>
  );
}
