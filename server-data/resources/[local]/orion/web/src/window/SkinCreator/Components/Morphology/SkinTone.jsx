import React, { useEffect, useState } from 'react';

export default function SkinTone({ _acne, _skinColor, _freckle, _wrinkle, _wrinkleOpacity, _ageing, _sunDamage, handleSkinToneChange }) {
  const [skinColor, setSkinColor] = useState(_skinColor);
  const [acne, setAcne] = useState(_acne);
  const [freckle, setFreckle] = useState(_freckle);
  const [wrinkle, setWrinkle] = useState(_wrinkle);
  const [wrinkleIntensity, setWrinkleIntensity] = useState(_wrinkleOpacity);
  const [ageing, setAgeing] = useState(_ageing);
  const [sunDamage, setSunDamage] = useState(_sunDamage);

  const skinColorOptions = [
    { value: '12', color: '#ecc8ae' },
    { value: '25', color: '#ce9874' },
    { value: '19', color: '#925a41' },
    { value: '14', color: '#4e3a26' }
  ];

  useEffect(() => {
    handleSkinToneChange({ skinColor, acne, freckle, wrinkle, wrinkleIntensity, ageing, sunDamage });
  }, [skinColor, acne, freckle, wrinkle, wrinkleIntensity, ageing, sunDamage]);

  return (
    <div className="group">
      <div className="input">
        <div className="label">Couleur de peau</div>
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
        <div className="label">Vieillissement</div>
        <div className="label-value" data-legend="/14"></div>
        <div className="type-range">
          <input type="range" className="Ageing" min="0" max="14" value={ageing} onInput={(e) => setAgeing(e.target.value)} />
        </div>
      </div>


      <div className="input">
        <div className="label">Acne</div>
        <div className="label-value" data-legend="/23"></div>
        <div className="type-range">
          <input type="range" className="acne" min="0" max="23" value={acne} onInput={(e) => setAcne(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Insolation</div>
        <div className="label-value" data-legend="/10"></div>
        <div className="type-range">
          <input type="range" className="sunDamage" min="0" max="10" value={sunDamage} onInput={(e) => setSunDamage(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Taches de rousseur</div>
        <div className="label-value" data-legend="/17"></div>
        <div className="type-range">
          <input type="range" className="tachesrousseur" min="0" max="17" value={freckle} onInput={(e) => setFreckle(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Les rides</div>
        <div className="label-value" data-legend="/14"></div>
        <div className="type-range">
          <input type="range" className="rides" min="0" max="14" value={wrinkle} onInput={(e) => setWrinkle(e.target.value)} />
        </div>
      </div>

      <div className="input">
        <div className="label">Intensité des rides</div>
        <div className="label-value" data-legend="/10"></div>
        <div className="type-range">
          <input type="range" className="intensiterides" min="0.0" max="1.0" step="1.0" value={wrinkleIntensity} onInput={(e) => setWrinkleIntensity(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
