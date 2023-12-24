import React, { useEffect } from 'react'
import { useData } from '../../providers/dataContext';
import style from './inventory.module.scss';
import InventoryItem from './InventoryItem';
import { useVisibility } from '../../providers/visibilityProvider';

export default function Inventory() {
    const { data } = useData();
    const { closeAllMenus } = useVisibility();

    return (
        <div className={style.inventory}>
            <div className={style.inventory__close} onClick={closeAllMenus}>
                X
            </div>
            <div className={style.inventory__container}>
                <header>
                    <h1>Inventory</h1>
                    <search>search bar</search>
                </header>

                <div className={style.inventory__content}>
                    {data.inventory.items
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map((item, index) => {
                            return <InventoryItem key={index} item={item} />
                        })}
                </div>
            </div>
        </div>
    )
}
