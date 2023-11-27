import React, { useState } from 'react';

export default function Hair() {
  const [hairColor, setHairColor] = useState('0');
  const [hairSlider, setHairSlider] = useState(0);

  const hairColors = ['#1D1D1A', '#4B392D', '#7A3B1F', '#A35631', '#A96F49', '#BD8D5E', '#CBA66F', '#E8BE78', '#D09E6A', '#993524', '#9C1611', '#D1381E', '#C85831', '#947A67', '#D8C1AC', '#734F61', '#AD476A', '#FFAEBC', '#089A8D', '#309060', '#A3C015', '#EEC85C', '#FE8B10', '#D40B0E'];

  const handleHairColorChange = (e) => {
    setHairColor(e.target.value);
  };

  const handleHairSliderChange = (e) => {
    setHairSlider(e.target.value);
  };

  return (
    <div className="group">
      <div className="input">
        <div className="label">Hair</div>
        <div className="label-value" data-legend="/74"></div>
        <div className="type-range">
          <input type="range" className="hair" min="0" max="174" value={hairSlider} onChange={handleHairSliderChange} />
        </div>
      </div>

      <div className="input">
        <div className="label">Hair color</div>
        <div className="type-radio">
          {hairColors.map((color, index) => (
            <label htmlFor={`c${index + 1}`} key={index}>
              <input 
                type="radio" 
                name="haircolor" 
                className="haircolor" 
                value={index * 2} 
                id={`c${index + 1}`} 
                checked={hairColor === (index * 2).toString()} 
                onChange={handleHairColorChange} 
              />
              <span className="color" data-color={color} style={{ backgroundColor: color }}></span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
