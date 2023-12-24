import React, { useEffect } from 'react'
import style from './inventory.module.scss';
import { sendNui } from '../../utils/fetchNui';

export default function InventoryItemUsable({ item }) {

    const handleDropItem = (id) => {
        console.log('drop item')
        sendNui('dropItem', { id })
    }

    const handleUseItem = (id) => {
        console.log('use item')
        sendNui('useItem', { id })
    }

    const handleGiveItem = (id) => {
        console.log('give item')
        sendNui('giveItem', { id })
    }

    return (
        <div className={style.inventory__item}>
            <div onClick={() => handleUseItem(item.id)}>
                <div className={style.inventory__item__icon}>
                    <img src={`./images/items/${item.image}`} alt="item icon" />
                </div>
                <div className={style.inventory__item__info}>
                    <h3>{item.quantity} {item.label}</h3>
                </div>
            </div>
            <div className={style.inventory__item__actions}>
                {item.useable && <button onClick={() => handleGiveItem(item.id)}>Donner</button>}
                <button onClick={() => handleDropItem(item.id)}>Drop</button>
            </div>

            <div className={style.inventory__item__description}>
                {item.description}
            </div>
        </div>
    )
}
