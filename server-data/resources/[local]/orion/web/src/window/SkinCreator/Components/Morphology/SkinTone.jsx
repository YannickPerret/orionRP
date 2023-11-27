import React, { useEffect, useState } from 'react';

export default function SkinTone({handleSkinToneChange}) {
  const [skinColor, setSkinColor] = useState('12');
  const [acne, setAcne] = useState(0);
  const [skinProblem, setSkinProblem] = useState(0);
  const [freckle, setFreckle] = useState(0);
  const [wrinkle, setWrinkle] = useState(0);
  const [wrinkleIntensity, setWrinkleIntensity] = useState(10);

  const skinColorOptions = [
    { value: '12', color: '#ecc8ae' },
    { value: '25', color: '#ce9874' },
    { value: '19', color: '#925a41' },
    { value: '14', color: '#4e3a26' }
  ];


  const handleSkinToneChanged = (e) => {
    handleSkinToneChange({skinColor, acne, skinProblem, freckle, wrinkle, wrinkleIntensity});
  }

  useEffect(() => {
    handleSkinToneChanged();
  }, [skinColor, acne, skinProblem, freckle, wrinkle, wrinkleIntensity]);

  return (
    <div className="group">
      <div className="input">
        <div className="label">Skin tone</div>
        <div className="type-radio">
        {skinColorOptions.map((option, index) => (
            <label htmlFor={`peaucolor${option.value}`} key={index}>
              <input 
                type="radio" 
                name="peaucolor" 
                className="peaucolor" 
                value={option.value} 
                id={`peaucolor${option.value}`} 
                checked={skinColor === option.value} 
                onChange={() => setSkinColor(option.value)} />
              <span className="color" style={{ backgroundColor: option.color }}></span>
            </label>
          ))}
        </div>
      </div>

      <div className="input">
        <div className="label">Acne</div>
        <div className="label-value" data-legend="/23"></div>
        <div className="type-range">
          <input type="range" className="acne" min="0" max="23" value={acne} onChange={(e) => setAcne(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Skin problems</div>
        <div className="label-value" data-legend="/11"></div>
        <div className="type-range">
          <input type="range" className="pbpeau" min="0" max="11" value={skinProblem} onChange={(e) => setSkinProblem(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Freckles</div>
        <div className="label-value" data-legend="/17"></div>
        <div className="type-range">
          <input type="range" className="tachesrousseur" min="0" max="17" value={freckle} onChange={(e) => setFreckle(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Wrinkles</div>
        <div className="label-value" data-legend="/14"></div>
        <div className="type-range">
          <input type="range" className="rides" min="0" max="14" value={wrinkle} onChange={(e) => setWrinkle(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Wrinkles intensity</div>
        <div className="label-value" data-legend="/10"></div>
        <div className="type-range">
          <input type="range" className="intensiterides" min="0" max="10" value={wrinkleIntensity} onChange={(e) => setWrinkleIntensity(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
