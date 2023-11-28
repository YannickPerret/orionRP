import React, { useState } from 'react';

export default function Mother({handleMotherChange}) {
  const [mother, setMother] = useState(21);
  const [showMotherTab, setShowMotherTab] = useState(false);

  const handleMotherChanged = (e) => {
    setMother(e.target.value);
    handleMotherChange(e.target.value);
  };

  const createRadioButtons = () => {
    const buttons = [];
    for (let i = 21; i <= 45; i++) { // Ajustez la plage si nécessaire
      buttons.push(
        <label htmlFor={`mere${i}`} key={i}>
          <input 
            type="radio" 
            name="mere" 
            className="mere" 
            value={i.toString()} 
            id={`mere${i}`} 
            checked={mother === i.toString()}
            onChange={handleMotherChanged}
          />
          <div className="img">
            <img src={`Face-${i}.jpg`} alt={`Face ${i}`} />
          </div>
        </label>
      );
    }
    return buttons;
  };

  return (
    <div className="input">
      <div className="label" onClick={() => setShowMotherTab(!showMotherTab)}>Mother's face</div>
      {showMotherTab && (
        <div className="type-img">
          {createRadioButtons()}
        </div>
      )}
    </div>
  );
}
