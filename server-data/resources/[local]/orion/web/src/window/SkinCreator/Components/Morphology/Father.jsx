import React, { useState } from 'react';

export default function Father({handleFatherChange}) {
  const [father, setFather] = useState('0');
  const [showFatherTab, setShowFatherTab] = useState(false);


  const handleFatherChanged = (e) => {
    setFather(e.target.value);
    handleFatherChange(e.target.value);
  };

  const createRadioButtons = () => {
    const buttons = [];
    for (let i = 0; i <= 24; i++) {
      buttons.push(
        <label htmlFor={`pere${i}`} key={i}>
          <input 
            type="radio" 
            name="pere" 
            className="pere" 
            value={i.toString()} 
            id={`pere${i}`} 
            checked={father === i.toString()}
            onChange={handleFatherChanged}
          />
          <div className="img">
            <img src={`src/assets/images/skinCreator/heritage/Face-${i}.jpg`} alt={`Face ${i}`} />
          </div>
        </label>
      );
    }
    return buttons;
  };

  return (
    <div className="input">
      <div className="label" onClick={() => setShowFatherTab(!showFatherTab)}>Father's face</div>
      {showFatherTab && (
        <div className="type-img">
          {createRadioButtons()}
        </div>
      )}
    </div>
  );
}
