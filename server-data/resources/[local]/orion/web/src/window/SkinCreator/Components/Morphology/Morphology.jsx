import React, { useState } from 'react'
import Father from './Father'
import Mother from './Mother'
import Hair from './Hair'
import Eyes from './Eyes'
import SkinTone from './SkinTone'

export default function Morphology() {

    const [dad, setDad] = useState('');
    const [mom, setMom] = useState('');
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
        <Father />
        <Mother />
        <div class="input">
        <div class="label">Parent Genetic rate</div>
        <div class="label-value" data-legend="" style="display:none;"></div>
        <div class="type-range">
            <a href="#" class="arrow arrow-left">&nbsp;</a>
            <input value="5" type="range" class="morphologie" min="0" max="10" />
            <a href="#" class="arrow arrow-right">&nbsp;</a>
        </div>
        </div>
        <SkinTone />
        <Hair />
        <Eyes />
    </div>
  )
}

