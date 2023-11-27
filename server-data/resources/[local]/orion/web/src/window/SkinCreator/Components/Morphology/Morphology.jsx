import React, { useEffect, useState } from 'react'
import Father from './Father'
import Mother from './Mother'
import Hair from './Hair'
import Eyes from './Eyes'
import SkinTone from './SkinTone'
import { sendNui } from '../../../../utils/fetchNui'
import Beard from './Beard'

export default function Morphology() {

    const [dad, setDad] = useState('');
    const [mom, setMom] = useState('');
    const [sex, setSex] = useState(0);

    const [heritage, setHeritage] = useState(5);
    const [skinColor, setSkinColor] = useState('');
    const [acne, setAcne] = useState(0);
    const [skinProblem, setSkinProblem] = useState(0);
    const [freckle, setFreckle] = useState(0);
    const [wrinkle, setWrinkle] = useState(0);
    const [wrinkleIntensity, setWrinkleIntensity] = useState(10);
    const [hairColor, setHairColor] = useState('');
    const [hair, setHair] = useState('');
    const [eyebrow, setEyebrow] = useState('');
    const [eyeColor, setEyeColor] = useState('');
    const [eyebrowThickness, setEyebrowThickness] = useState('');
    const [beard, setBeard] = useState('');
    const [beardColor, setBeardColor] = useState('');

    const handleSubmit = async () => {
        await sendNui('updateSkin', {
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
            eyebrow: eyebrow,
            eyebrowThickness: eyebrowThickness,
            beard: beard,
            beardColor: beardColor
        });

    }

    useEffect(() => {
        handleSubmit();
    }, [dad, mom, sex, heritage, skinColor, eyeColor, eyebrowThickness, hairColor, hair, eyebrow, beard, beardColor, acne, skinProblem, freckle, wrinkle, wrinkleIntensity]);

  return (
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
                    <input value={heritage} type="range" className="morphologie" min="0" max="10" onChange={(e) => setHeritage(e.target.value)} />
                <a href="#" className="arrow arrow-right" >&nbsp;</a>
            </div>
        </div>
        <SkinTone handleSkinToneChange={{setSkinColor, setAcne, setSkinProblem, setFreckle, setWrinkle, setWrinkleIntensity}}/>
        <Hair handleHairChange={{setHairColor, setHair}}/>
        <Eyes handleEyesChange={{setEyebrow, setEyebrowThickness, setEyeColor}}/>
        <Beard handleBeardChange={{setBeard, setBeardColor}}/>
    </div>
  )
}

