import React, { useEffect, useState } from 'react';

export default function Hair({handleHairChange}) {
  const [hairColor, setHairColor] = useState(0);
  const [hair, setHair] = useState(0);
  const [hairHighlight, setHairHighlight] = useState(0);

  const hairColors = ['#1D1D1A', '#4B392D', '#7A3B1F', '#A35631', '#A96F49', '#BD8D5E', '#CBA66F', '#E8BE78', '#D09E6A', '#993524', '#9C1611', '#D1381E', '#C85831', '#947A67', '#D8C1AC', '#734F61', '#AD476A', '#FFAEBC', '#089A8D', '#309060', '#A3C015', '#EEC85C', '#FE8B10', '#D40B0E'];

  const handleHairColorChange = (e) => {
    setHairColor(e.target.value);
  };


  useEffect(() => {
    handleHairChange({hairColor, hair});
  }, [hairColor, hair]);
  
  const femaleHair = [
    {value: 0, title: 'Close Shave'},
    {value: 37, title: 'Buzzcut'},
    {value: 38, title: 'Faux Hawk'},
    {value: 39, title: 'Hipster'},
    {value: 40, title: 'Side Parting'},
    {value: 41, title: 'Shorter Cut'},
    {value: 42, title: 'Biker'},
    {value: 43, title: 'Ponytail'},
    {value: 44, title: 'Cornrows'},
    {value: 45, title: 'Slicked'},
    {value: 46, title: 'Short Brushed'},
    {value: 47, title: 'Spikey'},
    {value: 48, title: 'Caesar'},
    {value: 49, title: 'Chopped'},
    {value: 50, title: 'Dreads'},
    {value: 51, title: 'Long Hair'},
    {value: 52, title: 'Shaggy Curls'},
    {value: 53, title: 'Surfer Dude'},
    {value: 54, title: 'Short Side Part'},
    {value: 55, title: 'High Slicked Sides'},
    {value: 56, title: 'Long Slicked'},
    {value: 57, title: 'Hipster Youth'},
    {value: 58, title: 'Mullet'},
    {value: 59, title: 'Classic Cornrows'},
    {value: 60, title: 'Palm Cornrows'},
    {value: 61, title: 'Lightning Cornrows'},
    {value: 62, title: 'Whipped Cornrows'},
    {value: 63, title: 'Zig Zag Cornrows'},
    {value: 64, title: 'Snail Cornrows'},
    {value: 65, title: 'Hightop'},
    {value: 66, title: 'Loose Swept Back'},
    {value: 67, title: 'Undercut Swept Back'},
    {value: 68, title: 'Undercut Swept Side'},
    {value: 69, title: 'Spiked Mohawk'},
    {value: 70, title: 'Mod'},
    {value: 71, title: 'Layered Mod'},
    {value: 72, title: 'Flattop'},
    {value: 73, title: 'Military Buzzcut'},
  ]

  const maleHair = [
    {value: 0, title: 'Close Shave'},
    {value: 1, title: 'Buzzcut'},
    {value: 2, title: 'Faux Hawk'},
    {value: 3, title: 'Hipster'},
    {value: 4, title: 'Side Parting'},
    {value: 5, title: 'Shorter Cut'},
    {value: 6, title: 'Biker'},
    {value: 7, title: 'Ponytail'},
    {value: 8, title: 'Cornrows'},
    {value: 9, title: 'Slicked'},
    {value: 10, title: 'Short Brushed'},
    {value: 11, title: 'Spikey'},
    {value: 12, title: 'Caesar'},
    {value: 13, title: 'Chopped'},
    {value: 14, title: 'Dreads'},
    {value: 15, title: 'Long Hair'},
    {value: 16, title: 'Shaggy Curls'},
    {value: 17, title: 'Surfer Dude'},
    {value: 18, title: 'Short Side Part'},
    {value: 19, title: 'High Slicked Sides'},
    {value: 20, title: 'Long Slicked'},
    {value: 21, title: 'Hipster Youth'},
    {value: 22, title: 'Mullet'},
    {value: 23, title: 'Classic Cornrows'},
    {value: 24, title: 'Palm Cornrows'},
    {value: 25, title: 'Lightning Cornrows'},
    {value: 26, title: 'Whipped Cornrows'},
    {value: 27, title: 'Zig Zag Cornrows'},
    {value: 28, title: 'Snail Cornrows'},
    {value: 29, title: 'Hightop'},
    {value: 30, title: 'Loose Swept Back'},
    {value: 31, title: 'Undercut Swept Back'},
    {value: 32, title: 'Undercut Swept Side'},
    {value: 33, title: 'Spiked Mohawk'},
    {value: 34, title: 'Mod'},
    {value: 35, title: 'Layered Mod'},
    {value: 36, title: 'Flattop'},
  ]


  return (
    <div className="group">
      <div className="input">
        <div className="label">Hair</div>
        <div className="label-value" data-legend="/74"></div>
        <div className="type-range">
          <input type="range" className="hair" min="0" max="73" value={hair} onChange={(e) => setHair(e.target.value)} />
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
