import React, { useState } from 'react';
import { sendNui } from '../../utils/fetchNui';
import { useData } from '../../providers/dataContext';
import style from './dialogBox.module.scss';
import { useVisibility } from '../../providers/visibilityProvider';

const DialogBox = () => {
    const [currentPageId, setCurrentPageId] = useState("1");
    const { data } = useData();
    const { closeAllMenus } = useVisibility();

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
        console.log(option)
        closeAllMenus(true);
        sendNui('dialogChoice', {
            choice: option,
        });
    };

    const { text, options, title } = data.dialogData[currentPageId];

    return (
        <div className={style.dialogBox}>
            <h2>
                {title}
            </h2>
            <p className={style.dialogBox__content}>{text}</p>
            <ul className={style.dialogBox__choices}>
                {options.map((option, index) => (
                    <li key={index} onClick={() => handleSelectOption(option)} className={style.dialogBox__item}>
                        {option.text}
                    </li>
                ))}

                <li onClick={() => sendChoiceToServer({ action: 'orion:bank:c:showNoAccountInterface' })} className={style.dialogBox__item}>
                    Annuler
                </li>
            </ul>
        </div>
    );
};

export default DialogBox;
