import React, { useState } from 'react';
import { sendNui } from '../../utils/fetchNui';
import { useData } from '../../providers/dataContext';

const DialogBox = () => {
    const [currentPageId, setCurrentPageId] = useState("1");
    const { data: dialogData } = useData();

    const handleSelectOption = (option) => {
        if (option.nextPageId) {
            // Si nextPageId est présent, aller à la page suivante
            setCurrentPageId(option.nextPageId);
        } else {
            // Si nextPageId n'est pas présent, envoyer le choix au serveur FiveM
            sendChoiceToServer(option);
        }
    };

    const sendChoiceToServer = (option) => {
        sendNui('dialogChoice', {
            choice: option.value,
        });
    };

    const { text, options } = dialogData[currentPageId];

    return (
        <div className="dialogue-box">
            <p>{text}</p>
            <ul>
                {options.map((option, index) => (
                    <li key={index} onClick={() => handleSelectOption(option)}>
                        {option.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DialogBox;
