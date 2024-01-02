import React, { useEffect, useState } from 'react';

export default function Beard({ _beard, _beardColor, handleBeardChange }) {
  const [beard, setBeard] = useState(_beard);
  const [beardThickness, setBeardThickness] = useState(0);
  const [beardColor, setBeardColor] = useState(_beardColor);

  const handleBeardTypeChange = (e) => {
    setBeard(e.target.value);
  };

  const handleBeardThicknessChange = (e) => {
    setBeardThickness(e.target.value);
  };

  const handleBeardColorChange = (e) => {
    setBeardColor(e.target.value);
  };

  useEffect(() => {
    handleBeardChange({ beard, beardColor, beardThickness });
  }, [beard, beardThickness, beardColor]);

  return (
    <div className="group">
      <div className="input">
        <div className="label">Beard type</div>
        <div className="type-range">
          <input type="range" className="barbe" min="0" max="28" value={beard} onChange={handleBeardTypeChange} />
        </div>
      </div>

      <div className="input">
        <div className="label">Beard thickness</div>
        <div className="type-range">
          <input type="range" className="epaisseurbarbe" min="0" max="10" value={beardThickness} onChange={handleBeardThicknessChange} />
        </div>
      </div>

      <div className="input">
        <div className="label">Beard Color</div>
        <div className="type-radio">
          {/* Generate radio buttons for beard colors */}
          {['#1D1D1A', '#4B392D', '#7A3B1F', '#A35631', '#A96F49', '#BD8D5E', '#CBA66F', '#E8BE78', '#D09E6A', '#C85831', '#947A67', '#D8C1AC'].map((color, index) => (
            <label htmlFor={`bc${index + 1}`} key={index}>
              <input
                type="radio"
                name="barbecolor"
                className="barbecolor"
                value={(index * 2).toString()}
                id={`bc${index + 1}`}
                checked={beardColor === (index * 2).toString()}
                onChange={handleBeardColorChange}
              />
              <span className="color" data-color={color} style={{ backgroundColor: color }}></span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
