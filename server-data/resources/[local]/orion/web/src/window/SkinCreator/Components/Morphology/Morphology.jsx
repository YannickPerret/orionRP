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
    const [genre, setGenre] = useState();

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
    <div class="group">
        <h2>Morphology</h2>
        <div class="input">
            <div class="label">Sex</div>
            <div class="label-value" data-legend="" style="display:none;"></div>
            <div class="type-range">
                <a href="#" class="arrow arrow-left">&nbsp;</a>
                <input value="0" type="range" class="gent" min="0" max="1" />
                <a href="#" class="arrow arrow-right">&nbsp;</a>
            </div>
        </div>
        <Father handleFather={setDad} />
        <Mother handleMother={setMom}/>
        <div class="input">
            <div class="label">Parent Genetic rate</div>
            <div class="label-value" data-legend="" style="display:none;"></div>
            <div class="type-range">
                <a href="#" class="arrow arrow-left">&nbsp;</a>
                <input value={heritage} type="range" class="morphologie" min="0" max="10" onChange={setHeritage} />
                <a href="#" class="arrow arrow-right">&nbsp;</a>
            </div>
        </div>
        <SkinTone />
        <Hair />
        <Eyes />
    </div>
  )
}

