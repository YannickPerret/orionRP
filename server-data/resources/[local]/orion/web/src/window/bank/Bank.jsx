import React from 'react'
import style from './bank.module.scss'
import { useData } from '../../providers/dataContext'
import { useVisibility } from '../../providers/visibilityProvider'

export default function Bank() {
    const { data } = useData()
    const { closeAllMenus } = useVisibility()
    const [depositVisible, setDepositVisible] = useState(false)
    const [withdrawVisible, setWithdrawVisible] = useState(false)
    const [transferVisible, setTransferVisible] = useState(false)
    const [historyVisible, setHistoryVisible] = useState(false)


    const handleCancel = () => {
        closeAllMenus(false);
        sendNui('cancelBank')
    }
    const handleSendToNui = (action, payload) => {
        sendNui(action, payload)
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
                {depositVisible || withdrawVisible || transferVisible || historyVisible && (
                    <div>
                        <h2>Compte courant</h2>
                        <p>Montant : {data.player.account.balance} $</p>
                    </div>
                )}

                {depositVisible && <Deposit accountBalance={data.player.account.balance} playerMoney={data.player.money} handleSendToNui={handleSendToNui} handleCancel={handleCancel} />}
                {withdrawVisible && <Withdraw accountBalance={data.player.account.balance} handleSendToNui={handleSendToNui} handleCancel={handleCancel} />}
                {transferVisible && <Transfer accountBalance={data.player.account.balance} handleSendToNui={handleSendToNui} handleCancel={handleCancel} />}
                {historyVisible && <History handleCancel={handleCancel} />}

                <div className={style.bank__content__actions}>
                    <button className={style.bank__button} onClick={() => setDepositVisible(true)}>Déposer</button>
                    <button className={style.bank__button} onClick={() => setWithdrawVisible(true)} >Retirer</button>

                    <button className={style.bank__button} onClick={() => setTransferVisible(true)}>Virement</button>

                    <button className={style.bank__button} onClick={() => setHistoryVisible(true)}>Historique</button>

                    <button className={style.bank__button} onClick={() => handleCancel}>Annuler</button>
                </div>
            </div>
        </div>
    )
}

function Deposit({ accountBalance, playerMoney, handleSendToNui, handleCancel }) {
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState('')

    const handleDeposit = () => {
        if (amount > playerMoney) {
            setError('Vous n\'avez pas assez d\'argent')
            return
        }
        handleSendToNui('deposit', {
            amount: amount
        })
    }

    return (
        <div className={style.bank__content}>
            <div>
                <h2>Retirer</h2>
                <p>Montant : {accountBalance} $</p>
            </div>

            <Error message={error} />
            <div className={style.bank__content__actions}>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <button className={style.bank__button} onClick={() => handleDeposit()}>Valider</button>
                <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
            </div>
        </div>
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
        <div className={style.bank__content}>
            <div>
                <h2>Retirer</h2>
                <p>Montant : {accountBalance} $</p>
            </div>

            <Error message={error} />

            <div className={style.bank__content__actions}>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <button className={style.bank__button} onClick={() => handleWithdraw()}>Valider</button>
                <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
            </div>
        </div>
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
        <div className={style.bank__content}>
            <div>
                <h2>Virement</h2>
                <p>Montant : {accountBalance} $</p>
            </div>

            <Error message={error} />

            <div className={style.bank__content__actions}>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} />
                <button className={style.bank__button} onClick={() => handleTransfer()}>Valider</button>
                <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
            </div>
        </div>
    )
}

function History(handleCancel) {
    const { data } = useData()
    const [history, setHistory] = useState([])
    const [error, setError] = useState('')


    useEffect(() => {
        setHistory(data.player.account.history)
    }, [data.player.account.history])

    return (
        <div className={style.bank__content}>
            <Error message={error} />
            <div>
                <h2>Historique</h2>
                <p>Montant : {data.player.account.balance} $</p>
            </div>

            <div className={style.bank__content__actions}>
                <ul>
                    {history.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>

            <button className={style.bank__button} onClick={() => handleCancel()}>Annuler</button>
        </div>
    )
}

function Error({ message }) {

    return (
        <div className={style.bank__content__error}>
            <p>{message}</p>
        </div>
    )
}
