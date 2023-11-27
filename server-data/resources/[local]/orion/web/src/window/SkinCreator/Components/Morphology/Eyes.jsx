import React, { useState } from 'react';

export default function Eyes() {
  const [eyebrowType, setEyebrowType] = useState(0);
  const [eyebrowThickness, setEyebrowThickness] = useState(10);
  const [eyeColor, setEyeColor] = useState('0');

  const handleEyebrowTypeChange = (e) => {
    setEyebrowType(e.target.value);
  };

  const handleEyebrowThicknessChange = (e) => {
    setEyebrowThickness(e.target.value);
  };

  const handleEyeColorChange = (e) => {
    setEyeColor(e.target.value);
  };

  return (
    <div className="group">
      <div className="input">
        <div className="label">Eyebrow type</div>
        <div className="type-range">
          <input type="range" className="sourcils" min="0" max="34" value={eyebrowType} onChange={handleEyebrowTypeChange} />
        </div>
      </div>

      <div className="input">
        <div className="label">Eyebrows thickness</div>
        <div className="type-range">
          <input type="range" className="epaisseursourcils" min="0" max="10" value={eyebrowThickness} onChange={handleEyebrowThicknessChange} />
        </div>
      </div>

      <div className="input">
        <div className="label">Eye color</div>
        <div className="type-radio">
          {/* Generate radio buttons for eye colors */}
          {['#525e37', '#263419', '#83b7d5', '#3e66a3', '#8d6833', '#523711', '#d08418', '#bebebe', '#0d0d0c'].map((color, index) => (
            <label htmlFor={`eye${index + 1}`} key={index}>
              <input 
                type="radio" 
                name="eyecolor" 
                className="eyecolor" 
                value={index.toString()} 
                id={`eye${index + 1}`} 
                checked={eyeColor === index.toString()} 
                onChange={handleEyeColorChange} 
              />
              <span className="color" data-color={color} style={{ backgroundColor: color }}></span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
