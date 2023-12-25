import React, { useEffect } from 'react'
import style from './inventory.module.scss';

export default function InventoryItemUsable({ item, useItem, giveItem, dropItem }) {

    return (

        <div className={style.inventory__item}>
            <div onClick={() => { console.log(`Item clicked: ${item.id}`); useItem(item.id); }}>
                <div className={style.inventory__item__icon}>
                    <img src={`./images/items/${item.image}`} alt="item icon" />
                </div>
                <div className={style.inventory__item__info}>
                    <h3>{item.quantity} {item.label}</h3>
                </div>
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
