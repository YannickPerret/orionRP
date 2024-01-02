import React, { useEffect, useState } from 'react'
import './SkinCreator.css'
import Father from './Components/Morphology/Father';
import Mother from './Components/Morphology/Mother';
import SkinTone from './Components/Morphology/SkinTone';
import Hair from './Components/Morphology/Hair';
import Eyes from './Components/Morphology/Eyes';
import Beard from './Components/Morphology/Beard';
import { sendNui } from '../../utils/fetchNui';
import { useData } from '../../providers/dataContext';

export default function SkinCreator() {

    const { data, setData } = useData();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [skin, setSkin] = useState(data.player.skin.skin);
    const [face, setFace] = useState(data.player.skin.face);
    const [hair, setHair] = useState(data.player.skin.hair);
    const [beard, setBeard] = useState(data.player.skin.beard);
    const [makeup, setMakeup] = useState(data.player.skin.makeup);

    const [debug, setDebug] = useState(true);

    const handleFatherChange = (father) => {
        setSkin(prevSkin => ({
            ...prevSkin,
            father: father
        }));
    };

    const handleMotherChange = (mother) => {
        setSkin(prevSkin => ({
            ...prevSkin,
            mother: mother
        }));
    };

    const handleSubmit = async () => {
        console.log(beard)
        await sendNui('updateSkin', {
            skin: skin,
            face: face,
            hair: hair,
            beard: beard,
            makeup: makeup
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
        setSkin(data.player.skin.skin);
        setFace(data.player.skin.face);
        setHair(data.player.skin.hair);
        setBeard(data.player.skin.Beard);
        setMakeup(data.player.skin.Makeup);
        await sendNui('resetSkin');
    }

    const handleValidate = async () => {
        await sendNui('validateSkin', {
            firstname: firstname,
            lastname: lastname,
            skin: skin,
            face: face,
            hair: hair,
            beard: beard,
            makeup: makeup
        });
    }

    useEffect(() => {
        handleSubmit();
    }, [skin, face, hair, beard, makeup]);

    return (
        <div className="skinCreator">
            {debug &&
                <div className="skinCreator__debug">
                    {JSON.stringify(skin)}
                    <br />
                    {JSON.stringify(face)}
                    <br />
                    {JSON.stringify(hair)}
                    <br />
                    {JSON.stringify(beard)}
                    <br />
                    {JSON.stringify(makeup)}
                </div>}

            <div className="skinCreator__sideLeft">

                <div className="input">
                    <header>
                        <h3>Ped</h3>
                    </header>
                    <div>
                        <div className="label">Sex</div>
                        <div className="label-value" data-legend=""></div>
                        <div className="type-range">
                            <a href="#" className="arrow arrow-left">&nbsp;</a>
                            <input value={skin.sex} type="range" className="gent" min="0" max="1" onChange={(e) => setSkin(prevData => ({ ...prevData, sex: Number(e.target.value) }))} />
                            <a href="#" className="arrow arrow-right">&nbsp;</a>
                        </div>
                    </div>
                </div>


                <Father handleFatherChange={handleFatherChange} />
                <Mother handleMotherChange={handleMotherChange} />


                <div className="input">
                    <header>
                        <h3>Héritage</h3>
                    </header>
                    <div className="label">Parent Genetic rate</div>
                    <div className="label-value" data-legend=""></div>
                    <div className="type-range">
                        <a href="#" className="arrow arrow-left">&nbsp;</a>
                        <input value={skin.shapeMix} type="range" className="morphologie" max="1.0" min="0.0" step="0.1" onChange={(e) => setSkin(prevData => ({ ...prevData, shapeMix: e.target.value }))} />
                        <a href="#" className="arrow arrow-right" >&nbsp;</a>
                    </div>
                </div>


                <SkinTone _acne={face.acne} _freckle={face.freckle} _skinColor={skin.skinColor} _wrinkle={face.wrinkle} _wrinkleOpcity={face.wrinkleOpacity} _ageing={face.ageingType} _sunDamage={face.sunDamageType} handleSkinToneChange={(skinToneData) => {
                    setSkin(prevData => ({ ...prevData, skinColor: skinToneData.skinColor }));
                    setFace(prevData => ({ ...prevData, acne: skinToneData.acne, freckle: skinToneData.freckle, wrinkle: skinToneData.wrinkle, wrinkleOpacity: skinToneData.wrinkleIntensity, ageingType: skinToneData.ageing, sunDamageType: skinToneData.sunDamage }));
                }} />

                <Hair _hair={hair.hair} _hairColor={hair.hairColor} _sex={skin.sex} handleHairChange={(hairData) => {
                    setHair(prevData => ({ ...prevData, hairColor: hairData.hairColor, hair: hairData.hair }));
                }} />

                <Eyes _eyeColor={face.eyeColor} _eyeBrowType={face.eyebrowType} _eyeBrowOpacity={face.eyebrowOpacity} _eyebrowColor={face.eyebrowColor} handleEyesChange={(eyes => {
                    setFace(prevData => ({ ...prevData, eyeColor: eyes.eyeColor, eyebrowType: eyes.eyeBrow, eyebrowOpacity: eyes.eyebrowThickness, eyebrowColor: eyes.eyeBrowColor }));
                })} />
                <Beard _beard={beard.beard} _beardColor={beard.beardColor} handleBeardChange={(beard) => {
                    setBeard(prevData => ({ ...prevData, beard: beard.beard, beardColor: beard.beardColor }));
                }} />
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
