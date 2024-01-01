import React, { useEffect, useState } from 'react'
import style from './bank.module.scss'
import { useData } from '../../providers/dataContext'
import { useVisibility } from '../../providers/visibilityProvider'
import { sendNui } from '../../utils/fetchNui'

export default function Bank() {
    const { data } = useData()
    const { closeAllMenus } = useVisibility()
    const [activeWindow, setActiveWindow] = useState(null);

    const openDeposit = () => setActiveWindow('deposit');
    const openWithdraw = () => setActiveWindow('withdraw');
    const openTransfer = () => setActiveWindow('transfer');
    const openHistory = () => setActiveWindow('history');
    const accountBalance = data.player.account.balance

    const handleCancel = () => {
        setActiveWindow(null);
        closeAllMenus(false);
        sendNui('cancelBank')
    }
    const handleSendToNui = (action, payload) => {
        closeAllMenus(false);
        sendNui(action, payload)
    }

    useEffect(() => {
        console.log(data)
    }
        , [data])

    return (
        <div className={style.bank}>
            <div className={style.bank__container}>
                <header className={style.bank__header}>
                    <div className={style.bank__header__title}>
                        <img src='./images/bank/logoNationnal.png' alt="logo" width={125} height={75} />
                        <h1>Orion Bank Nationnal</h1>
                    </div>
                    <div>
                        <p>Bonjour {data.player.firstname} {data.player.lastname}</p>
                    </div>
                    <div className={style.bank__header__balance}>
                        <h2>Compte courant</h2>
                        <p>Montant : {accountBalance} $</p>
                    </div>
                </header>
            </div>

            <div className={style.bank__content}>
                {activeWindow === null && <Home accountBalance={accountBalance} />}
                {activeWindow === 'deposit' && <Deposit playerMoney={data.player.money} handleSendToNui={handleSendToNui} handleCancel={handleCancel} />}
                {activeWindow === 'withdraw' && <Withdraw accountBalance={accountBalance} handleSendToNui={handleSendToNui} handleCancel={handleCancel} />}
                {activeWindow === 'transfer' && <Transfer accountBalance={accountBalance} handleSendToNui={handleSendToNui} handleCancel={handleCancel} />}
                {activeWindow === 'history' && <History handleCancel={handleCancel} />}
            </div>
            <div className={style.bank__actions}>
                <button className={style.bank__actions__button} onClick={openDeposit}>Déposer</button>
                <button className={style.bank__actions__button} onClick={openWithdraw} >Retirer</button>

                <button className={style.bank__actions__button} onClick={openTransfer}>Virement</button>

                <button className={style.bank__actions__button} onClick={openHistory}>Historique</button>

                <button className={style.bank__actions__button} onClick={handleCancel}>Annuler</button>
            </div>
        </div>
    )
}

function Home({ accountBalance }) {

    return (
        <div className={style.bank__content}>
            <p>
                Bienvenue sur votre compte bancaire, vous avez actuellement {accountBalance} $ sur votre compte.
            </p>
        </div>
    )
}

function Deposit({ playerMoney, handleSendToNui, handleCancel }) {
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState('')

    const handleDeposit = () => {
        console.log(amount, playerMoney)
        if (amount >= playerMoney) {
            setError('Vous n\'avez pas assez d\'argent')
            return
        }
        handleSendToNui('deposit', {
            amount: amount
        })
    }

    return (
        <>
            <div>
                <h2>Déposer</h2>
            </div>

            <Error message={error} />
            <div className={style.bank__content__actions}>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <button className={style.bank__button} onClick={() => handleDeposit()}>Valider</button>
                <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
            </div>
        </>
    )
}

function Withdraw({ accountBalance, handleSendToNui, handleCancel }) {
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState('')


    const handleWithdraw = () => {
        if (amount > accountBalance) {
            setError('Vous n\'avez pas assez d\'argent dans votre compte')
            return
        }
        handleSendToNui('withdraw', {
            amount: amount
        })
    }

    return (
        <>
            <div>
                <h2>Retirer</h2>
            </div>

            <Error message={error} />

            <div className={style.bank__content__actions}>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <button className={style.bank__button} onClick={() => handleWithdraw()}>Valider</button>
                <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
            </div>
        </>
    )
}

function Transfer({ accountBalance, handleSendToNui, handleCancel }) {
    const [amount, setAmount] = useState(0)
    const [target, setTarget] = useState('')
    const [error, setError] = useState('')


    const handleTransfer = () => {
        if (amount > accountBalance) {
            setError('Vous n\'avez pas assez d\'argent dans votre compte')
            return
        }
        handleSendToNui('transfer', {
            amount: amount,
            target: target
        })
    }

    return (
        <>
            <div>
                <h2>Virement</h2>
            </div>

            <Error message={error} />

            <div className={style.bank__content__actions}>
                <label>Montant :</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <label>Nom et prénom :</label>
                <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} />
                <button className={style.bank__button} onClick={() => handleTransfer()}>Valider</button>
                <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
            </div>
        </>
    )
}

function History({ handleCancel }) {
    const { data } = useData()
    const [history, setHistory] = useState([])
    const [error, setError] = useState('')


    useEffect(() => {
        setHistory(data.player.account.history)
    }, [data.player.account.history])

    return (
        <>
            <Error message={error} />
            <div>
                <h2>Historique</h2>
            </div>

            <div className={style.bank__content__actions}>
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
        </ >
    )
}

function Error({ message }) {

    return (
        <div className={style.bank__content__error}>
            <p>{message}</p>
        </div>
    )
}
