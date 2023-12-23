import React, { useEffect } from 'react'
import { useData } from '../../providers/dataContext';
import style from './inventory.module.scss';
import InventoryItem from './InventoryItem';

export default function Inventory() {
    const { data } = useData();

    return (
        <div className={style.inventory}>
            <div className={style.inventory__close}>
                X
            </div>
            <div className={style.inventory__container}>
                <header>
                    <h1>Inventory</h1>
                    <search>search bar</search>
                </header>

                <div className={style.inventory__content}>
                    {data.inventory.items.map((item, index) => {
                        return <InventoryItem key={index} item={item} />
                    })}
                </div>
            </div>
        </div>
    )
}
