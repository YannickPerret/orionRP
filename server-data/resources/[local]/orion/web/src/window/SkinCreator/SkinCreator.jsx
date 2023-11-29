import React, { useEffect, useState } from 'react'
import './SkinCreator.css'
import Father from './Components/Morphology/Father';
import Mother from './Components/Morphology/Mother';
import SkinTone from './Components/Morphology/SkinTone';
import Hair from './Components/Morphology/Hair';
import Eyes from './Components/Morphology/Eyes';
import Beard from './Components/Morphology/Beard';
import { sendNui } from '../../utils/fetchNui';

export default function SkinCreator() {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [dad, setDad] = useState(0);
  const [mom, setMom] = useState(0);
  const [sex, setSex] = useState(0);

  const [heritage, setHeritage] = useState(5);
  const [skinColor, setSkinColor] = useState(0);
  const [acne, setAcne] = useState(0);
  const [skinProblem, setSkinProblem] = useState(0);
  const [freckle, setFreckle] = useState(0);
  const [wrinkle, setWrinkle] = useState(0);
  const [wrinkleIntensity, setWrinkleIntensity] = useState(10);
  const [hairColor, setHairColor] = useState(0);
  const [hair, setHair] = useState(0);
  const [eyebrow, setEyebrow] = useState(0);
  const [eyeColor, setEyeColor] = useState(0);
  const [eyebrowThickness, setEyebrowThickness] = useState(0);
  const [beard, setBeard] = useState(0);
  const [beardColor, setBeardColor] = useState(0);
  const [beardThickness, setBeardThickness] = useState(0);

  const handleSubmit = async () => {
    console.log('submit');
        await sendNui('updateSkin', {
            sex: sex,
            dad: dad,
            mom: mom,
            heritage: heritage,
            skin: skinColor,
            acne: acne,
            skinProblem: skinProblem,
            freckle: freckle,
            wrinkle: wrinkle,
            wrinkleIntensity: wrinkleIntensity,
            eyeColor: eyeColor,
            hairColor: hairColor,
            hair: hair,
            highlight: 0,
            eyebrow: eyebrow,
            eyebrowThickness: eyebrowThickness,
            beard: beard,
            beardColor: beardColor,
            beardThickness: beardThickness
        });
  };

  const handleRotatePlayer = async (e) => {
    if (e.key === 'a') {
        await sendNui('rotateHeading', {
            value: 10
        });
    }
    if (e.key === 'd') {
        await sendNui('rotateHeading', {
            value: -10
        });
    }
  }

  const handleReset = async () => {
    setFirstname('');
    setLastname('');
    setDad(0);
    setMom(0);
    setSex(0);
    setHeritage(5);
    setSkinColor(0);
    setAcne(0);
    setSkinProblem(0);
    setFreckle(0);
    setWrinkle(0);
    setWrinkleIntensity(10);
    setHairColor(0);
    setHair(0);
    setEyebrow(0);
    setEyeColor(0);
    setEyebrowThickness(0);
    setBeard(0);
    setBeardColor(0);
    setBeardThickness(0);
    await sendNui('resetSkin');
   }

    const handleValidate = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir valider votre personnage ?')) {
            await sendNui('validateSkin', {
                firstname: firstname,
                lastname: lastname,
                dad: dad,
                mom: mom,
                sex: sex,
                heritage: heritage,
                skin: skinColor,
                acne: acne,
                skinProblem: skinProblem,
                freckle: freckle,
                wrinkle: wrinkle,
                wrinkleIntensity: wrinkleIntensity,
                eyeColor: eyeColor,
                hairColor: hairColor,
                hair: hair,
                highlight: 0,
                eyebrow: eyebrow,
                eyebrowThickness: eyebrowThickness,
                beard: beard,
                beardColor: beardColor,
                beardThickness: beardThickness
            });
        }
    }

  useEffect(() => {
    handleSubmit();
  }, [dad, mom, sex, heritage, skinColor, eyeColor, eyebrowThickness, hairColor, hair, eyebrow, beard, beardColor, acne, skinProblem, freckle, wrinkle, wrinkleIntensity]);

  return (
    <div className="skinCreator">
     <div className="sideLeft">
        <h2>Morphology</h2>
        <div className="input">
            <div className="label">Sex</div>
            <div className="label-value" data-legend=""></div>
            <div className="type-range">
                <a href="#" className="arrow arrow-left">&nbsp;</a>
                <input value={sex} type="range" className="gent" min="0" max="1" onChange={(e) => setSex(e.target.value)} />
                <a href="#" className="arrow arrow-right">&nbsp;</a>
            </div>
        </div>
        <Father handleFatherChange={setDad} />
        <Mother handleMotherChange={setMom} />
        <div className="input">
            <div className="label">Parent Genetic rate</div>
            <div className="label-value" data-legend=""></div>
            <div className="type-range">
                <a href="#" className="arrow arrow-left">&nbsp;</a>
                    <input value={heritage} type="range" className="morphologie" min="0" max="100" onChange={(e) => setHeritage(e.target.value)} />
                <a href="#" className="arrow arrow-right" >&nbsp;</a>
            </div>
        </div>
        <SkinTone handleSkinToneChange={(skinToneData) => {
            setSkinColor(skinToneData.skinColor);
            setAcne(skinToneData.acne);
            setSkinProblem(skinToneData.skinProblem);
            setFreckle(skinToneData.freckle);
            setWrinkle(skinToneData.wrinkle);
            setWrinkleIntensity(skinToneData.wrinkleIntensity);
        }} />

        <Hair handleHairChange={(hairData) => {
            setHairColor(hairData.hairColor);
            setHair(hairData.hair);
        }} />

        <Eyes handleEyesChange={(eyes => {
            setEyeColor(eyes.eyeColor);
            setEyebrow(eyes.eyebrow);
            setEyebrowThickness(eyes.eyebrowThickness);
        })}/>
        <Beard handleBeardChange={(beard) => {
            setBeard(beard.beard);
            setBeardColor(beard.beardColor);
            setBeardThickness(beard.beardThickness);
        }}/>
    </div>

     <div className='skinCreator__bottom'>
      <input value={firstname} onChange={(e) => setFirstname(e.target.value)} type="text" placeholder="Firstname" />
      <input value={lastname} onChange={(e) => setLastname(e.target.value)} type="text" placeholder="Lastname" />
     </div>

      <div className='skinCreator__valid'>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleValidate}>Valider</button>
      </div>
    </div>
  );
}
