import React, { useEffect } from 'react'
import style from './inventory.module.scss';
import { sendNui } from '../../utils/fetchNui';

export default function InventoryItem({ item, giveItem, dropItem }) {

    return (
        <div className={style.inventory__item}>
            <div className={style.inventory__item__icon}>
                <img src={`./images/items/${item.image}`} alt="item icon" />
            </div>
            <div className={style.inventory__item__info}>
                <h3>{item.quantity} {item.label}</h3>
            </div>
            <div className={style.inventory__item__actions}>
                {item.useable && <button onClick={() => giveItem(item.id)}>Donner</button>}
                <button onClick={() => dropItem(item.id)}>Drop</button>
            </div>

            <div className={style.inventory__item__description}>
                {item.description}
            </div>
        </div>
    )
}
