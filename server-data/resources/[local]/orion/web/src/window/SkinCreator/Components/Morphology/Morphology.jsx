import React, { useEffect, useState } from 'react'
import Father from './Father'
import Mother from './Mother'
import Hair from './Hair'
import Eyes from './Eyes'
import SkinTone from './SkinTone'
import { sendNui } from '../../../../utils/fetchNui'
import Beard from './Beard'

export default function Morphology() {

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
            eyebrow: eyebrow,
            eyebrowThickness: eyebrowThickness,
            beard: beard,
            beardColor: beardColor,
            beardThickness: beardThickness
        });

    }
 const handleRotatePlayer = async (e) => {
    console.log(e.key)
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

    useEffect(() => {
        handleSubmit();
    }, [dad, mom, sex, heritage, skinColor, eyeColor, eyebrowThickness, hairColor, hair, eyebrow, beard, beardColor, acne, skinProblem, freckle, wrinkle, wrinkleIntensity]);

    useEffect(() => {
        document.addEventListener('keydown', handleRotatePlayer);

        return () => {
            document.removeEventListener('keydown', handleRotatePlayer);
        }
    }, []);
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
  )
}

