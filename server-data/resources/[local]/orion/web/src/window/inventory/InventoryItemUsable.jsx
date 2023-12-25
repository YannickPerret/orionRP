import React, { useEffect } from 'react'
import style from './inventory.module.scss';

export default function InventoryItemUsable({ item, useItem, giveItem, dropItem }) {

    const handleUseItem = (id) => {
        console.log('use item')
        useItem(id);
    }

    const handleGiveItem = (id) => {
        console.log('give item')
        giveItem(id);
    }

    const handleDropItem = (id) => {
        console.log('drop item')
        dropItem(id);
    }

    const clickOnUse = () => handleUseItem(item.id);
    const clickOnGive = () => handleGiveItem(item.id);
    const clickOnDrop = () => handleDropItem(item.id);
    return (

        <div className={style.inventory__item}>
            <div onClick={clickOnUse}>
                <div className={style.inventory__item__icon}>
                    <img src={`./images/items/${item.image}`} alt="item icon" />
                </div>
                <div className={style.inventory__item__info}>
                    <h3>{item.quantity} {item.label}</h3>
                </div>
            </div>
            <div className={style.inventory__item__actions}>
                {item.useable && <button onClick={clickOnGive}>Donner</button>}
                <button onClick={clickOnDrop}>Drop</button>
            </div>

            <div className={style.inventory__item__description}>
                {item.description}
            </div>
        </div >
    )
}
