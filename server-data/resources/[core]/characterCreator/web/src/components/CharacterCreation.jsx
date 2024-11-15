// src/components/CharacterCreation.js
import { useNuiRequest } from "fivem-nui-react-lib";
import React, { useState } from 'react';
import heritagesData from '../data/heritages.json'
import { FaSync } from 'react-icons/fa';

const CharacterCreation = () => {
    const { send } = useNuiRequest({ resource: 'characterCreator'})
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedHeritageType, setSelectedHeritageType] = useState('dad');
    const [activeTab, setActiveTab] = useState('Hair');
    const [isFaceZoomed, setIsFaceZoomed] = useState(false);
    const [characterData, setCharacterData] = useState({
        firstName: '',
        lastName: '',
        height: '',
        birthDate: '',
        gender: 'male',
        appearance: {
            hairStyle: 0,
            hairPrimaryColor: 0,
            hairSecondaryColor: 0,
            skinProblem: 0,
            opacity: 0,
            beardStyle: 0,
            beardColor: 0,
            eyebrowStyle: 0,
            makeupStyle: 0,
            makeupColor: 0,
            noseWidth: 5,
            noseHeight: 5,
            noseLength: 5,
            eyebrowDepth: 5,
            eyebrowColor: 0,
            lipFullness: 5,
            blemishes: 0,
            sunDamage:0,
            freckles: 0,
            chestHair:0,
            chestHairColor:0,
            blush:0,
            blushColor:0,
            moles:0
        },
        clothes: {
            tshirtStyle: 0,
            tshirtColor: 0,
            torsoStyle: 0,
            torsoColor: 0,
            armsStyle: 0,
            armsColor: 0,
            pantsStyle: 0,
            pantsColor: 0,
            shoesStyle: 0,
            shoesColor: 0,
            glassesStyle: 0,
        },
        heritage: {
            dad: 0,
            mom: 0,
            shapeMix: 0.0,
            skinMix: 0.0,
        },
    });

    const getStepTitle = (step) => {
        switch (step) {
            case 1: return "DNA";
            case 2: return "Appearance & Hairiness";
            case 3: return "Facial Features";
            case 4: return "Clothing";
            default: return "";
        }
    };

    const toggleFaceZoom = () => {
        setIsFaceZoomed(!isFaceZoomed);
        send("toggleFaceZoom", { zoom: !isFaceZoomed });
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        setCharacterData((prevData) => {
            let updatedData = { ...prevData };

            // Check if the changed field is part of 'appearance'
            if (prevData.appearance.hasOwnProperty(id)) {
                updatedData.appearance = {
                    ...prevData.appearance,
                    [id]: value,
                };
                send("applySkin", { appearance: { [id]: value } });

                // Check if the changed field is part of 'clothes'
            } else if (prevData.clothes.hasOwnProperty(id)) {
                updatedData.clothes = {
                    ...prevData.clothes,
                    [id]: value,
                };
                send("applySkin", { clothes: { [id]: value } });

                // Check if the changed field is part of 'heritage'
            } else if (prevData.heritage.hasOwnProperty(id)) {
                updatedData.heritage = {
                    ...prevData.heritage,
                    [id]: parseFloat(value),  // Ensure numerical values for heritage data
                };
                // Send the entire 'heritage' object whenever a 'heritage' field changes
                send("applySkin", { heritage: updatedData.heritage });

                // Handle other direct fields (e.g., firstName, lastName)
            } else {
                updatedData = { ...prevData, [id]: value };
                if (!['firstName', 'lastName', 'height', 'birthDate'].includes(id)) {
                    send("applySkin", { [id]: value });
                }
            }

            return updatedData;
        });
    };

    const handleGenderSelect = (gender) => {
        setCharacterData((prevData) => ({
            ...prevData,
            gender,
        }));
        send("applySkin", { gender });
    };

    const handleHeritageSelect = (type, heritageId) => {
        setCharacterData((prevData) => ({
            ...prevData,
            heritage: {
                ...prevData.heritage,
                [type]: heritageId,
            },
        }));
        send("applySkin", { [type]: heritageId });
    };

    const confirmCharacter = () => {
        const { firstName, lastName, gender, appearance, clothes, birthDate, height } = characterData;
        const characterPayload = {
            firstName,
            lastName,
            gender,
            birthDate,
            height,
            appearance,
            clothes,
        };
        send("register-character", characterPayload);
    };

    return (
        <div className="absolute left-10 top-8 max-w-screen-sm space-y-6 text-white bg-gray-900 p-6 rounded-md overflow-y-auto">
            <div className="absolute top-2 right-2">
                <button onClick={toggleFaceZoom} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full">
                    <FaSync size={20} className="text-white"/>
                </button>
            </div>
            <div className="flex justify-center space-x-4 mb-4">
                {[1, 2, 3, 4].map(step => (
                    <button
                        key={step}
                        className={`px-3 py-1 ${currentStep === step ? 'bg-green-700' : 'bg-gray-700'} rounded`}
                        onClick={() => setCurrentStep(step)}
                    >
                        {getStepTitle(step)}
                    </button>
                ))}
            </div>

            <div className="text-center text-2xl font-semibold">
                Step {currentStep}: {getStepTitle(currentStep)}
            </div>

            {/* Step 1: DNA */}
            {currentStep === 1 && (
                <div className="space-y-4">
                    <div className="flex justify-between space-x-4">
                        <button
                            className={`flex flex-col items-center justify-center w-1/2 py-4 border-2 rounded-lg ${characterData.gender === 'male' ? 'border-green-500 bg-gray-800' : 'border-gray-600'}`}
                            onClick={() => handleGenderSelect('male')}
                        >
                            <span className="text-2xl">👨</span>
                            <span className="mt-2 text-white">Homme</span>
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center w-1/2 py-4 border-2 rounded-lg ${characterData.gender === 'female' ? 'border-green-500 bg-gray-800' : 'border-gray-600'}`}
                            onClick={() => handleGenderSelect('female')}
                        >
                            <span className="text-2xl">👩</span>
                            <span className="mt-2 text-white">Femme</span>
                        </button>
                    </div>

                    <label className="block text-sm mt-4">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        value={characterData.firstName}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                        required={true}
                    />

                    <label className="block text-sm mt-4">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        value={characterData.lastName}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                        required={true}
                    />

                    <label className="block text-sm mt-4">Height</label>
                    <input
                        type="number"
                        id="height"
                        placeholder="Height (cm)"
                        max={"220"}
                        min={"50"}
                        value={characterData.height}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                        required={true}
                    />

                    <label className="block text-sm mt-4">Birth Date</label>
                    <input
                        type="date"
                        id="birthDate"
                        placeholder="dd.mm.yyyy"
                        value={characterData.birthDate}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                        required={true}
                    />


                    <label className="block text-md mt-4">Parental Heritage</label>
                    <div className="mt-6">
                        <div className="flex space-x-4">
                            <button
                                className={`flex-1 py-2 text-center border-2 rounded-lg ${selectedHeritageType === 'dad' ? 'border-green-500' : 'border-gray-600'}`}
                                onClick={() => setSelectedHeritageType('dad')}
                            >
                                Dad
                            </button>
                            <button
                                className={`flex-1 py-2 text-center border-2 rounded-lg ${selectedHeritageType === 'mom' ? 'border-green-500' : 'border-gray-600'}`}
                                onClick={() => setSelectedHeritageType('mom')}
                            >
                                Mom
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4 max-h-96 overflow-y-auto">
                            {heritagesData
                                .filter(h => h.type === selectedHeritageType) // Filter items based on the selected heritage type (dad or mom)
                                .map((heritage, index) => (
                                    <button
                                        key={index}
                                        className={`border-2 p-2 rounded-lg ${
                                            characterData.heritage[selectedHeritageType] === heritage.id
                                                ? 'border-green-500'
                                                : 'border-gray-600'
                                        }`}
                                        onClick={() => handleHeritageSelect(selectedHeritageType, heritage.id)}
                                    >
                                        <img
                                            src={heritage.image}
                                            alt={heritage.name}
                                            className="w-full h-38 object-cover rounded-md"
                                        />
                                        <span className="block mt-2 text-center text-white">{heritage.name}</span>
                                    </button>
                                ))}
                        </div>
                        <label className="block text-md mt-4">Ressemblance</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={characterData.heritage.shapeMix}
                            onChange={handleInputChange}
                            id="shapeMix"
                            className="w-full slider"
                        />

                        <label className="block text-md mt-4">Skin Mix</label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={characterData.heritage.skinMix}
                            onChange={handleInputChange}
                            id="skinMix"
                            className="w-full slider"
                        />


                    </div>
                </div>
            )}

            {/* Step 2: Appearance & Hairiness */}
            {currentStep === 2 && (
                <div className="space-y-4">
                    <div className="text-lg font-bold">Define the characteristics of your appearance and
                        hairiness, <span className="text-green-500">attention</span> your appearance cannot be modified
                        in the future.
                    </div>

                    {/* Onglets pour les sections */}
                    <div className="flex space-x-4 mt-4">
                        {['Hair', 'Beard', 'Eyebrow', 'Makeup', 'Skin'].map(tab => (
                            <button
                                key={tab}
                                className={`flex-1 py-2 text-center border-2 rounded-lg ${activeTab === tab ? 'border-green-500 bg-gray-800' : 'border-gray-600'}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Contenu de l'onglet actif */}
                    <div className="mt-4 space-y-4">
                        {activeTab === 'Hair' && (
                            <>
                                <label className="block text-md">Hair: {characterData.hairStyle}/80</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="80"
                                    value={characterData.appearance.hairStyle}
                                    onChange={handleInputChange}
                                    id="hairStyle"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Primary
                                    colors: {characterData.appearance.hairPrimaryColor}/63</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.appearance.hairPrimaryColor}
                                    onChange={handleInputChange}
                                    id="hairPrimaryColor"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Secondary
                                    colors: {characterData.appearance.hairSecondaryColor}/63</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.appearance.hairSecondaryColor}
                                    onChange={handleInputChange}
                                    id="hairSecondaryColor"
                                    className="w-full slider"
                                />
                            </>
                        )}
                        {activeTab === 'Beard' && (
                            <>
                                <label className="block text-md">Beard Style</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.appearance.beardStyle}
                                    onChange={handleInputChange}
                                    id="beardStyle"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Beard Color</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.appearance.beardColor}
                                    onChange={handleInputChange}
                                    id="beardColor"
                                    className="w-full slider"
                                />
                            </>
                        )}
                        {activeTab === 'Eyebrow' && (
                            <>
                                <label className="block text-md">Eyebrow Style</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={characterData.appearance.eyebrowStyle}
                                    onChange={handleInputChange}
                                    id="eyebrowStyle"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Eyebrow Color</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.appearance.eyebrowColor}
                                    onChange={handleInputChange}
                                    id="eyebrowColor"
                                    className="w-full slider"
                                />
                            </>
                        )}

                        {activeTab === 'Makeup' && (
                            <>
                                <label className="block text-md">Makeup Style</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.appearance.makeupStyle}
                                    onChange={handleInputChange}
                                    id="makeupStyle"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Makeup Color</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.appearance.makeupColor}
                                    onChange={handleInputChange}
                                    id="makeupColor"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Lip Fullness</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={characterData.appearance.lipFullness}
                                    onChange={handleInputChange}
                                    id="lipFullness"
                                    className="w-full slider"
                                />
                            </>

                        )}
                        {activeTab === 'Skin' && (
                            <>
                                <label className="block text-md">Skin Problem</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={characterData.appearance.skinProblem}
                                    onChange={handleInputChange}
                                    id="skinProblem"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Opacity</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={characterData.appearance.opacity}
                                    onChange={handleInputChange}
                                    id="opacity"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Blemishes</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.appearance.blemishes}
                                    onChange={handleInputChange}
                                    id="blemishes"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Sun Damage</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.appearance.sunDamage}
                                    onChange={handleInputChange}
                                    id="sunDamage"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Freckles</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.appearance.freckles}
                                    onChange={handleInputChange}
                                    id="freckles"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Chest Hair</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.appearance.chestHair}
                                    onChange={handleInputChange}
                                    id="chestHair"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Chest Hair Color</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.appearance.chestHairColor}
                                    onChange={handleInputChange}
                                    id="chestHairColor"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Blush</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={characterData.appearance.blush}
                                    onChange={handleInputChange}
                                    id="blush"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Blush Color</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.appearance.blushColor}
                                    onChange={handleInputChange}
                                    id="blushColor"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Moles</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={characterData.appearance.moles}
                                    onChange={handleInputChange}
                                    id="moles"
                                    className="w-full slider"
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Step 3: Facial Features */}
            {currentStep === 3 && (
                <div className="space-y-4">
                    <div className="text-lg font-bold">Determine the specificities of your facial features. These
                        characteristics will be <span className="text-green-500">permanent</span> and not modifiable
                        later.
                    </div>

                    {/* Sliders for facial features */}
                    <label className="block text-md">Nose Width</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.noseWidth}
                        onChange={handleInputChange}
                        id="noseWidth"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Height</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.noseHeight}
                        onChange={handleInputChange}
                        id="noseHeight"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Length</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.noseLength}
                        onChange={handleInputChange}
                        id="noseLength"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Lowering</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.noseLowering}
                        onChange={handleInputChange}
                        id="noseLowering"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Peak Lowering</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.nosePeakLowering}
                        onChange={handleInputChange}
                        id="nosePeakLowering"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Twist</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.noseTwist}
                        onChange={handleInputChange}
                        id="noseTwist"
                        className="w-full slider"
                    />

                    <label className="block text-md">Eyebrow Height</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.eyebrowHeight}
                        onChange={handleInputChange}
                        id="eyebrowHeight"
                        className="w-full slider"
                    />

                    <label className="block text-md">Eyebrow Depth</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.appearance.eyebrowDepth}
                        onChange={handleInputChange}
                        id="eyebrowDepth"
                        className="w-full slider"
                    />
                </div>
            )}

            {/* Step 4: Clothing */}
            {currentStep === 4 && (
                <div className="space-y-4">
                    <div className="text-lg font-bold">Select and define your clothing preferences.</div>

                    <label className="block text-md">Torso Style: {characterData.clothes.torsoStyle}/15</label>
                    <input
                        type="range"
                        min="0"
                        max="15"
                        value={characterData.clothes.torsoStyle}
                        onChange={handleInputChange}
                        id="torsoStyle"
                        className="w-full slider"
                    />

                    {/* T-shirt */}
                    <label className="block text-md">T-shirt: {characterData.clothes.tshirtStyle}/198</label>
                    <input
                        type="range"
                        min="0"
                        max="198"
                        value={characterData.clothes.tshirtStyle}
                        onChange={handleInputChange}
                        id="tshirtStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.clothes.tshirtColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.clothes.tshirtColor}
                        onChange={handleInputChange}
                        id="tshirtColor"
                        className="w-full slider"
                    />

                    {/* Torso */}
                    <label className="block text-md">Torso: {characterData.clothes.torsoStyle}/494</label>
                    <input
                        type="range"
                        min="0"
                        max="494"
                        value={characterData.clothes.torsoStyle}
                        onChange={handleInputChange}
                        id="torsoStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.clothes.torsoColor}/3</label>
                    <input
                        type="range"
                        min="0"
                        max="3"
                        value={characterData.clothes.torsoColor}
                        onChange={handleInputChange}
                        id="torsoColor"
                        className="w-full slider"
                    />

                    {/* Arms */}
                    <label className="block text-md">Arms: {characterData.clothes.armsStyle}/210</label>
                    <input
                        type="range"
                        min="0"
                        max="210"
                        value={characterData.clothes.armsStyle}
                        onChange={handleInputChange}
                        id="armsStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.clothes.armsColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.clothes.armsColor}
                        onChange={handleInputChange}
                        id="armsColor"
                        className="w-full slider"
                    />

                    {/* Pants */}
                    <label className="block text-md">Pants: {characterData.clothes.pantsStyle}/176</label>
                    <input
                        type="range"
                        min="0"
                        max="176"
                        value={characterData.clothes.pantsStyle}
                        onChange={handleInputChange}
                        id="pantsStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.clothes.pantsColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.clothes.pantsColor}
                        onChange={handleInputChange}
                        id="pantsColor"
                        className="w-full slider"
                    />

                    {/* Shoes */}
                    <label className="block text-md">Shoes: {characterData.clothes.shoesStyle}/137</label>
                    <input
                        type="range"
                        min="0"
                        max="137"
                        value={characterData.clothes.shoesStyle}
                        onChange={handleInputChange}
                        id="shoesStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.clothes.shoesColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.clothes.shoesColor}
                        onChange={handleInputChange}
                        id="shoesColor"
                        className="w-full slider"
                    />

                    {/* Glasses */}
                    <label className="block text-md">Glasses: {characterData.clothes.glassesStyle}/58</label>
                    <input
                        type="range"
                        min="0"
                        max="58"
                        value={characterData.clothes.glassesStyle}
                        onChange={handleInputChange}
                        id="glassesStyle"
                        className="w-full slider"
                    />
                </div>
            )}

            {/* Bouton de confirmation */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded"
                    onClick={confirmCharacter}>
                    Créer mon personnage
                </button>
            </div>
        </div>
    );
};

export default CharacterCreation;
