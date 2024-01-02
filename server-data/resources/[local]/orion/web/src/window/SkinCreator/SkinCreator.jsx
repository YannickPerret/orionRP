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
    const [beard, setBeard] = useState(data.player.skin.Beard);
    const [makeup, setMakeup] = useState(data.player.skin.Makeup);

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
        console.log("sex", Number(sex))

        await sendNui('updateSkin', {
            sex: Number(sex),
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
            eyeBrow: eyeBrow,
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
        setEyeBrow(0);
        setEyeColor(0);
        setEyebrowThickness(0);
        setBeard(0);
        setBeardColor(0);
        setBeardThickness(0);
        await sendNui('resetSkin');
    }

    const handleValidate = async () => {
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
            eyeBrow: eyeBrow,
            eyebrowThickness: eyebrowThickness,
            beard: beard,
            beardColor: beardColor,
            beardThickness: beardThickness
        });
    }

    useEffect(() => {
        handleSubmit();
    }, [skin, face, hair, beard, makeup]);

    return (
        <div className="skinCreator">
            {debug &&
                <div className="skinCreator__debug">
                    {JSON.stringify(data.player.skin)}
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
                            <input value={skin.sex} type="range" className="gent" min="0" max="1" onChange={(e) => setSkin(prevData => ({ ...prevData, sex: e.target.value }))} />
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


                <SkinTone handleSkinToneChange={(skinToneData) => {
                    setSkin(prevData => ({ ...prevData, skinColor: skinToneData.skinColor }));
                    setFace(prevData => ({ ...prevData, acne: skinToneData.acne, skinProblem: skinToneData.skinProblem, freckle: skinToneData.freckle, wrinkle: skinToneData.wrinkle, wrinkleOpacity: skinToneData.wrinkleIntensity }));
                }} />

                <Hair handleHairChange={(hairData) => {
                    setHair(prevData => ({ ...prevData, hairColor: hairData.hairColor, hair: hairData.hair }));
                }} />

                <Eyes handleEyesChange={(eyes => {
                    setFace(prevData => ({ ...prevData, eyeColor: eyes.eyeColor, eyeBrow: eyes.eyeBrow, eyebrowOpacity: eyes.eyebrowThickness }));
                })} />
                <Beard handleBeardChange={(beard) => {
                    setBeard(prevData => ({ ...prevData, beard: beard.beard, beardColor: beard.beardColor, beardOpacity: beard.beardThickness }));
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
