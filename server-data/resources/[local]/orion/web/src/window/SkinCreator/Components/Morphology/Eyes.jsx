import React, { useEffect, useState } from 'react';

export default function Eyes({handleEyesChange}) {
  const [eyeBrow, setEyeBrow] = useState(0);
  const [eyebrowThickness, setEyebrowThickness] = useState(10);
  const [eyeColor, setEyeColor] = useState(0);

  const handleEyebrowTypeChange = (e) => {
    setEyeBrow(e.target.value);
  };

  const handleEyebrowThicknessChange = (e) => {
    setEyebrowThickness(e.target.value);
  };

  const handleEyeColorChange = (e) => {
    setEyeColor(e.target.value);
  };

  useEffect(() => {
    handleEyesChange({eyeBrow, eyebrowThickness, eyeColor});
  }, [eyeBrow, eyebrowThickness, eyeColor]);
  
  const eyesColor = [
    { value: 1, color: '#525e37', title: 'Green' },
    { value: 2, color: '#263419', title: 'Light green' },
    { value: 3, color: '#83b7d5', title: 'Blue' },
    { value: 4, color: '#3e66a3', title: 'Light blue' },
    { value: 5, color: '#8d6833', title: 'Brown' },
    { value: 6, color: '#523711', title: 'Light brown' },
    { value: 7, color: '#d08418', title: 'Hazel' },
    { value: 8, color: '#bebebe', title: 'Grey' },
    { value: 9, color: '#0d0d0c', title: 'Dark grey' },
    { value: 10, color: '#ffff00', title: 'Yellow' },
    { value: 11, color: '#800080', title: 'Purple' },
    { value: 12, color: '#000000', title: 'Blackout' },
    { value: 13, color: '#808080', title: 'Shades of Gray' },
    { value: 14, color: '#ff0000', title: 'Tequila Sunrise' },
    { value: 15, color: '#ff00ff', title: 'Atomic' },
    { value: 16, color: '#0000ff', title: 'Warp' },
    { value: 17, color: '#00ffff', title: 'ECola' },
    { value: 18, color: '#008000', title: 'Space Ranger' },
    { value: 19, color: '#ffff00', title: 'Ying Yang' },
    { value: 20, color: '#800080', title: 'Bullseye' },
    { value: 21, color: '#808000', title: 'Lizard' },
    { value: 22, color: '#008080', title: 'Dragon' },
    { value: 23, color: '#ff00ff', title: 'Extra Terrestrial' },
    { value: 24, color: '#800000', title: 'Goat'},
    { value: 25, color: '#ff0000', title: 'Smiley' },
    { value: 26, color: '#800080', title: 'Possessed' },
    { value: 27, color: '#0000ff', title: 'Demon' },
    { value: 28, color: '#008000', title: 'Infected' },
    { value: 29, color: '#008080', title: 'Alien' },
    { value: 30, color: '#808000', title: 'Undead' },
    { value: 31, color: '#800000', title: 'Zombie'}    
  ];


  return (
    <div className="group">
      <div className="input">
        <div className="label">Eyebrow type</div>
        <div className="type-range">
          <input type="range" className="sourcils" min="0" max="34" value={eyeBrow} onChange={handleEyebrowTypeChange} />
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
          {eyesColor.map((color, index) => (
            <label htmlFor={`eye${color.value}`} key={index}>
              <input 
                type="radio" 
                name="eyecolor" 
                className="eyecolor" 
                value={color.value.toString()} 
                id={`eye${color.value + 1}`} 
                checked={eyeColor === index.toString()} 
                onChange={handleEyeColorChange} 
              />
              <span className="color" data-color={color.color} style={{ backgroundColor: color.color }}></span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
