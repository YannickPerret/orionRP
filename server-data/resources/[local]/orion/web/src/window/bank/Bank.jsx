import React from 'react'
import style from '../../styles/bank.module.css'

export default function Bank({ player }) {
    return (
        <div className={style.bank}>
            <div className={style.bank__container}>
                <header className={style.bank__header}>
                    <h1>Bank</h1>
                    <div>
                        <p>Bonjour {player.firstname} {player.lastname}</p>
                    </div>
                </header>
            </div>

            <div className={style.bank__content}>
                <div>
                    <h2>Compte courant</h2>
                    <p>Montant : {player.account.money} $</p>
                </div>

                <div>
                    <button className={style.bank__button}>Déposer</button>
                    <button className={style.bank__button}>Retirer</button>

                    <button className={style.bank__button}>Virement</button>

                    <button className={style.bank__button}>Historique</button>
                </div>
            </div>
        </div>
    )
}
