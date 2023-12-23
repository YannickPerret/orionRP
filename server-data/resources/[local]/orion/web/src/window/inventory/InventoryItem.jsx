import React, { useEffect } from 'react'
import style from './inventory.module.scss';

export default function InventoryItem({ item }) {
    return (
        <div className={style.inventory__item}>
            <div className={style.inventory__item__icon}>
                <img src={`./images/items/${item.image}`} alt="item icon" />
            </div>
            <div className={style.inventory__item__info}>
                <h3>{item.quantity} {item.label}</h3>
            </div>
            <div className={style.inventory__item__actions}>
                {item.useable && <button>Use</button>}
                <button>Drop</button>
            </div>
            <div className={style.inventory__item__description}>
                {item.description}
            </div>
        </div>
    )
}
