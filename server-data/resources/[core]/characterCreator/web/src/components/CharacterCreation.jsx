// src/components/CharacterCreation.js
import { useNuiRequest } from "fivem-nui-react-lib";
import React, { useState } from 'react';
import heritagesData from '../data/heritages.json'

const CharacterCreation = () => {
    const { send } = useNuiRequest();
    const [currentStep, setCurrentStep] = useState(1); // Ajout de l'état de l'étape
    const [selectedHeritageType, setSelectedHeritageType] = useState('dad');
    const [characterData, setCharacterData] = useState({
        firstName: '',
        lastName: '',
        height: '',
        birthDate: '',
        gender: '',
        hairStyle: 0,
        hairPrimaryColor: 0,
        hairSecondaryColor: 0,
        eyebrowStyle: 0,
        beardStyle: 0,
        noseWidth: 5,
        noseHeight: 5,
        noseLength: 5,
        eyebrowDepth: 5,
        lipFullness: 5,
        tshirtStyle: 0,
        torsoStyle: 0,
        legsStyle: 0,
        shoesStyle: 0,
        dad: null,
        mom: null
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
        setCharacterData({ ...characterData, [id]: value });
    };

    const handleGenderSelect = (gender) => {
        setCharacterData({ ...characterData, gender });
    };

    const handleHeritageSelect = (type, heritage) => {
        setCharacterData({ ...characterData, [type]: heritage });
    };

    const confirmCharacter = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1); // Passer à l'étape suivante
        } else {
            console.log("Character Data:", characterData);
            // Envoyer les données au serveur ici
        }
    };

    const applySkin = () => {
        console.log("Applying skin changes:", characterData);
        send("method-name", { characterData });
    };

    const handleSliderChange = (e) => {
        handleInputChange(e);
        applySkin();
    };

    const handleStepSelect = (step) => {
        setCurrentStep(step); // Aller à une étape spécifique
    };

    return (
        <div className="absolute left-10 top-1/4 max-w-ms space-y-6 text-white bg-gray-900 p-4 rounded-md">
            {/* Barre de navigation */}
            <div className="flex justify-center space-x-4 mb-4">
                {[1, 2, 3, 4].map(step => (
                    <button
                        key={step}
                        className={`px-3 py-1 ${currentStep === step ? 'bg-green-700' : 'bg-gray-700'} rounded`}
                        onClick={() => handleStepSelect(step)}
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
                            <span className="mt-2 text-white">Men</span>
                        </button>
                        <button
                            className={`flex flex-col items-center justify-center w-1/2 py-4 border-2 rounded-lg ${
                                characterData.gender === 'Female' ? 'border-green-500 bg-gray-800' : 'border-gray-600'
                            }`}
                            onClick={() => handleGenderSelect('Female')}
                        >
                            <span className="text-2xl">👩</span>
                            <span className="mt-2 text-white">Women</span>
                        </button>
                    </div>

                    <input
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        value={characterData.firstName}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />
                    <input
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        value={characterData.lastName}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />
                    <input
                        type="text"
                        id="height"
                        placeholder="Height"
                        value={characterData.height}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />
                    <input
                        type="date"
                        id="birthDate"
                        value={characterData.birthDate}
                        onChange={handleInputChange}
                        className="w-full py-2 px-3 bg-gray-800 border border-gray-700 focus:outline-none"
                    />

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

                        {/* Grille des personnages hérités */}
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            {heritagesData
                                .filter(h => h.type === selectedHeritageType)
                                .map((heritage, index) => (
                                    <button
                                        key={index}
                                        className={`border-2 p-2 rounded-lg ${characterData[selectedHeritageType] === heritage ? 'border-green-500' : 'border-gray-600'}`}
                                        onClick={() => handleHeritageSelect(selectedHeritageType, heritage)}
                                    >
                                        <img src={heritage.image} alt={heritage.name}
                                             className="w-full h-20 object-cover rounded-md"/>
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
                    <label className="block text-sm">Hair Style</label>
                    <input
                        type="range"
                        min="0"
                        max="80"
                        value={characterData.hairStyle}
                        onChange={handleSliderChange}
                        id="hairStyle"
                        className="w-full slider"
                    />
                    {/* Ajoutez d'autres sliders selon vos besoins */}
                </div>
            )}

            {/* Step 3: Facial Features */}
            {currentStep === 3 && (
                <div className="space-y-4">
                    <label className="block text-sm">Nose Width</label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={characterData.noseWidth}
                        onChange={handleSliderChange}
                        id="noseWidth"
                        className="w-full slider"
                    />
                </div>
            )}

            {/* Step 4: Clothing */}
            {currentStep === 4 && (
                <div className="space-y-4">
                    <label className="block text-sm">T-shirt Style</label>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        value={characterData.tshirtStyle}
                        onChange={handleSliderChange}
                        id="tshirtStyle"
                        className="w-full slider"
                    />
                </div>
            )}

            {/* Bouton de confirmation */}
            <div className="flex justify-center mt-4">
                <button
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded"
                    onClick={confirmCharacter}
                >
                    {currentStep < 4 ? "Next" : "Confirm"}
                </button>
            </div>
        </div>
    );
};

export default CharacterCreation;
