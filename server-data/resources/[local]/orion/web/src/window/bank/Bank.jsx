import React from 'react'
import style from './bank.module.scss'
import { useData } from '../../providers/dataContext'
import { useVisibility } from '../../providers/visibilityProvider'

export default function Bank() {
    const { data } = useData()
    const { closeAllMenus } = useVisibility()

    const handleCancel = () => {
        sendNui('cancelBank')
        closeAllMenus(false);
    }

    return (
        <div className={style.bank}>
            <div className={style.bank__container}>
                <header className={style.bank__header}>
                    <h1>Bank</h1>
                    <div>
                        <p>Bonjour {data.player.firstname} {data.player.lastname}</p>
                    </div>
                </header>
            </div>

            <div className={style.bank__content}>
                <div>
                    <h2>Compte courant</h2>
                    <p>Montant : {data.player.account.balance} $</p>
                </div>

                <div className={style.bank__content__actions}>
                    <button className={style.bank__button}>Déposer</button>
                    <button className={style.bank__button}>Retirer</button>

                    <button className={style.bank__button}>Virement</button>

                    <button className={style.bank__button}>Historique</button>

                    <button className={style.bank__button} onClick={() => handleCancel}>Annuler</button>
                </div>
            </div>
        </div>
    )
}
