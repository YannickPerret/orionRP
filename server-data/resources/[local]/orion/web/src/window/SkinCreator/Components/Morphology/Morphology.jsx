import React, { useEffect, useState } from 'react'
import Father from './Father'
import Mother from './Mother'
import Hair from './Hair'
import Eyes from './Eyes'
import SkinTone from './SkinTone'
import { sendNui } from '../../../../utils/fetchNui'

export default function Morphology() {

    const [dad, setDad] = useState('');
    const [mom, setMom] = useState('');
    const [sex, setSex] = useState(0);

    const [heritage, setHeritage] = useState(5);
    const [skin, setSkin] = useState('');
    const [skinColor, setSkinColor] = useState('');
    const [eyeColor, setEyeColor] = useState('');
    const [hairColor, setHairColor] = useState('');
    const [hair, setHair] = useState('');
    const [hairHighlight, setHairHighlight] = useState('');
    const [eyebrow, setEyebrow] = useState('');
    const [eyebrowColor, setEyebrowColor] = useState('');
    const [beard, setBeard] = useState('');
    const [beardColor, setBeardColor] = useState('');

    const handleSubmit = async () => {
        sendNui('updateSkin', {
            dad: dad,
            mom: mom,
            heritage: heritage,
            skin: skin,
            skinColor: skinColor,
            eyeColor: eyeColor,
            hairColor: hairColor,
            hair: hair,
            hairHighlight: hairHighlight,
            eyebrow: eyebrow,
            eyebrowColor: eyebrowColor,
            beard: beard,
            beardColor: beardColor
        });

    }

    useEffect(() => {

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
        <Father handleFather={setDad} />
        <Mother handleMother={setMom}/>
        <div className="input">
            <div className="label">Parent Genetic rate</div>
            <div className="label-value" data-legend=""></div>
            <div className="type-range">
                <a href="#" className="arrow arrow-left">&nbsp;</a>
                    <input value={heritage} type="range" className="morphologie" min="0" max="10" onChange={(e) => setHeritage(e.target.value)} />
                <a href="#" className="arrow arrow-right" >&nbsp;</a>
            </div>
        </div>
        <SkinTone />
        <Hair />
        <Eyes />
    </div>
  )
}

