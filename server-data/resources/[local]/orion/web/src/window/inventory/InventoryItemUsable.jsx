import React from 'react'
import style from './inventory.module.scss';

export const InventoryItemUsable = ({ item, useItem, giveItem, dropItem }) => {
    console.log(item);
    return (
        <div className={style.inventory__item}>
            <div onClick={() => useItem(item.id, item.shouldClose)}>
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
                {item.useable && <p>Utilisable</p>}
                {item.weight && <p>Poids: {item.weight}</p>}
            </div>
        </div>
    )
}
export default InventoryItemUsable;