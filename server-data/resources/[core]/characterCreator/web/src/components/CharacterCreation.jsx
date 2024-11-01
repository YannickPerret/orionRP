// src/components/CharacterCreation.js
import { useNuiRequest } from "fivem-nui-react-lib";
import React, { useState } from 'react';
import heritagesData from '../data/heritages.json'

const CharacterCreation = () => {
    const { send } = useNuiRequest({ resource: 'characterCreator'})
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedHeritageType, setSelectedHeritageType] = useState('dad');
    const [activeTab, setActiveTab] = useState('Hair');
    const [characterData, setCharacterData] = useState({
        firstName: '',
        lastName: '',
        height: '',
        birthDate: '',
        gender: '',
        hairStyle: 0,
        hairPrimaryColor: 0,
        hairSecondaryColor: 0,
        skinProblem: 0,
        opacity: 0,
        beardStyle: 0,
        eyebrowStyle: 0,
        makeupStyle: 0,
        noseWidth: 5,
        noseHeight: 5,
        noseLength: 5,
        eyebrowDepth: 5,
        lipFullness: 5,
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
        dad: 1,
        mom: 1
    });

    const getStepTitle = (step) => {
        switch (step) {
            case 1:
                return "DNA";
            case 2:
                return "Appearance & Hairiness";
            case 3:
                return "Facial Features";
            case 4:
                return "Clothing";
            default:
                return "";
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setCharacterData(prevData => {
            const updatedData = { ...prevData, [id]: value };

            if (!['firstName', 'lastName', 'height', 'birthDate'].includes(id)) {
                send("applySkin", {updatedData} )
            }
            return updatedData;
        });
    };

    const handleGenderSelect = (gender) => {
        setCharacterData((prevData) => {
            const newData = { ...prevData, gender };
            send("applySkin", { gender });
            return newData;
        });
    };

    const handleHeritageSelect = (type, heritage) => {
        setCharacterData((prevData) => {
            const newData = { ...prevData, [type]: heritage };
            send("applySkin", { [type]: heritage });
            return newData;
        });
    };

    const confirmCharacter = () => {
        if (window.confirm("Êtes-vous sûr ? Il ne sera plus possible de modifier l'apparence du personnage en jeu.")) {
            send("register-character", { characterData });
            console.log("Character Data:", characterData);
        }
    };

    return (
        <div className="absolute left-10 top-1/4 max-w-ms space-y-6 text-white bg-gray-900 p-4 rounded-md">
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
                    <div className="text-lg font-bold">Gender</div>
                    <div className="text-sm text-gray-400 mb-4">
                        Fill in the details related to your DNA, <span className="text-green-500">attention</span> no
                        returns will be possible.
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button
                            className={`flex flex-col items-center justify-center w-1/2 py-4 border-2 rounded-lg ${
                                characterData.gender === 'Male' ? 'border-green-500 bg-gray-800' : 'border-gray-600'
                            }`}
                            onClick={() => handleGenderSelect('Male')}
                        >
                            <span className="text-2xl">👨</span>
                            <span className="mt-2 text-white">Homme</span>
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center w-1/2 py-4 border-2 rounded-lg ${
                                characterData.gender === 'Female' ? 'border-green-500 bg-gray-800' : 'border-gray-600'
                            }`}
                            onClick={() => handleGenderSelect('Female')}
                        >
                            <span className="text-2xl">👩</span>
                            <span className="mt-2 text-white">Femme</span>
                        </button>
                    </div>

                    <label className="block text-sm mt-4">Prénom</label>
                    <input
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        value={characterData.firstName}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />

                    <label className="block text-sm mt-4">Nom de famille</label>
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        value={characterData.lastName}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />

                    <label className="block text-sm mt-4">Taille</label>
                    <input
                        type="text"
                        id="height"
                        placeholder="Height (cm)"
                        value={characterData.height}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />

                    <label className="block text-sm mt-4">Date de naissance</label>
                    <input
                        type="date"
                        id="birthDate"
                        placeholder="dd.mm.yyyy"
                        value={characterData.birthDate}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />

                    <label className="block text-md mt-4">Apparence de vos parents</label>
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

                        {/* Grille des personnages hérités avec overflow */}
                        <div className="grid grid-cols-3 gap-4 mt-4 max-h-96 overflow-y-auto">
                            {heritagesData
                                .filter(h => h.type === selectedHeritageType)
                                .map((heritage, index) => (
                                    <button
                                        key={index}
                                        className={`border-2 p-2 rounded-lg ${characterData[selectedHeritageType] === heritage ? 'border-green-500' : 'border-gray-600'}`}
                                        onClick={() => handleHeritageSelect(selectedHeritageType, heritage)}>
                                        <img src={heritage.image} alt={heritage.name}
                                             className="w-full h-38 object-cover rounded-md"/>
                                        <span className="block mt-2 text-center text-white">{heritage.name}</span>
                                    </button>
                                ))}
                        </div>
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
                        {['Hair', 'Beard', 'Eyebrow', 'Torso', 'Makeup'].map(tab => (
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
                                    value={characterData.hairStyle}
                                    onChange={handleInputChange}
                                    id="hairStyle"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Primary
                                    colors: {characterData.hairPrimaryColor}/63</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.hairPrimaryColor}
                                    onChange={handleInputChange}
                                    id="hairPrimaryColor"
                                    className="w-full slider"
                                />
                                <label className="block text-md">Secondary
                                    colors: {characterData.hairSecondaryColor}/63</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="63"
                                    value={characterData.hairSecondaryColor}
                                    onChange={handleInputChange}
                                    id="hairSecondaryColor"
                                    className="w-full slider"
                                />
                            </>
                        )}
                        {activeTab === 'Beard' && (
                            <>
                                <label className="block text-md">Beard Style: {characterData.beardStyle}/20</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.beardStyle}
                                    onChange={handleInputChange}
                                    id="beardStyle"
                                    className="w-full slider"
                                />
                            </>
                        )}
                        {activeTab === 'Eyebrow' && (
                            <>
                                <label className="block text-md">Eyebrow Style: {characterData.eyebrowStyle}/10</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    value={characterData.eyebrowStyle}
                                    onChange={handleInputChange}
                                    id="eyebrowStyle"
                                    className="w-full slider"
                                />
                            </>
                        )}
                        {activeTab === 'Torso' && (
                            <>
                                <label className="block text-md">Torso Style: {characterData.torsoStyle}/15</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    value={characterData.torsoStyle}
                                    onChange={handleInputChange}
                                    id="torsoStyle"
                                    className="w-full slider"
                                />
                            </>
                        )}
                        {activeTab === 'Makeup' && (
                            <>
                                <label className="block text-md">Makeup Style: {characterData.makeupStyle}/20</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={characterData.makeupStyle}
                                    onChange={handleInputChange}
                                    id="makeupStyle"
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
                        value={characterData.noseWidth}
                        onChange={handleInputChange}
                        id="noseWidth"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Height</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.noseHeight}
                        onChange={handleInputChange}
                        id="noseHeight"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Length</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.noseLength}
                        onChange={handleInputChange}
                        id="noseLength"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Lowering</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.noseLowering}
                        onChange={handleInputChange}
                        id="noseLowering"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Peak Lowering</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.nosePeakLowering}
                        onChange={handleInputChange}
                        id="nosePeakLowering"
                        className="w-full slider"
                    />

                    <label className="block text-md">Nose Twist</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.noseTwist}
                        onChange={handleInputChange}
                        id="noseTwist"
                        className="w-full slider"
                    />

                    <label className="block text-md">Eyebrow Height</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.eyebrowHeight}
                        onChange={handleInputChange}
                        id="eyebrowHeight"
                        className="w-full slider"
                    />

                    <label className="block text-md">Eyebrow Depth</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.eyebrowDepth}
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

                    {/* T-shirt */}
                    <label className="block text-md">T-shirt: {characterData.tshirtStyle}/198</label>
                    <input
                        type="range"
                        min="0"
                        max="198"
                        value={characterData.tshirtStyle}
                        onChange={handleInputChange}
                        id="tshirtStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.tshirtColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.tshirtColor}
                        onChange={handleInputChange}
                        id="tshirtColor"
                        className="w-full slider"
                    />

                    {/* Torso */}
                    <label className="block text-md">Torso: {characterData.torsoStyle}/494</label>
                    <input
                        type="range"
                        min="0"
                        max="494"
                        value={characterData.torsoStyle}
                        onChange={handleInputChange}
                        id="torsoStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.torsoColor}/3</label>
                    <input
                        type="range"
                        min="0"
                        max="3"
                        value={characterData.torsoColor}
                        onChange={handleInputChange}
                        id="torsoColor"
                        className="w-full slider"
                    />

                    {/* Arms */}
                    <label className="block text-md">Arms: {characterData.armsStyle}/210</label>
                    <input
                        type="range"
                        min="0"
                        max="210"
                        value={characterData.armsStyle}
                        onChange={handleInputChange}
                        id="armsStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.armsColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.armsColor}
                        onChange={handleInputChange}
                        id="armsColor"
                        className="w-full slider"
                    />

                    {/* Pants */}
                    <label className="block text-md">Pants: {characterData.pantsStyle}/176</label>
                    <input
                        type="range"
                        min="0"
                        max="176"
                        value={characterData.pantsStyle}
                        onChange={handleInputChange}
                        id="pantsStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.pantsColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.pantsColor}
                        onChange={handleInputChange}
                        id="pantsColor"
                        className="w-full slider"
                    />

                    {/* Shoes */}
                    <label className="block text-md">Shoes: {characterData.shoesStyle}/137</label>
                    <input
                        type="range"
                        min="0"
                        max="137"
                        value={characterData.shoesStyle}
                        onChange={handleInputChange}
                        id="shoesStyle"
                        className="w-full slider"
                    />
                    <label className="block text-md">Colors: {characterData.shoesColor}/10</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.shoesColor}
                        onChange={handleInputChange}
                        id="shoesColor"
                        className="w-full slider"
                    />

                    {/* Glasses */}
                    <label className="block text-md">Glasses: {characterData.glassesStyle}/58</label>
                    <input
                        type="range"
                        min="0"
                        max="58"
                        value={characterData.glassesStyle}
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
