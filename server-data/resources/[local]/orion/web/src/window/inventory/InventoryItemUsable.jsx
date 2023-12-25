import React from 'react'
import style from './inventory.module.scss';

export const InventoryItemUsable = ({ item }) => {

    const giveItem = () => {
        console.log('give item')
        //sendToNui('giveItem', { id: id })
    }

    const dropItem = (id) => {
        console.log('drop item')
        sendToNui('dropItem', { id: id })
    }

    const sendToNui = (action, data) => {
        sendNui(action, data)
    }
    return (
        <div className={style.inventory__item}>
            <div>
                <div className={style.inventory__item__icon}>
                    <img src={`./images/items/${item.image}`} alt="item icon" />
                </div>
                <div className={style.inventory__item__info}>
                    <h3>{item.quantity} {item.label}</h3>
                </div>
            </div>
            <div className={style.inventory__item__actions}>
                {item.useable && <button onClick={giveItem}>Donner</button>}
                <button onClick={() => dropItem(item.id)}>Drop</button>
            </div>

            <div className={style.inventory__item__description}>
                {item.description}
            </div>
        </div>
    )
}
export default InventoryItemUsable;