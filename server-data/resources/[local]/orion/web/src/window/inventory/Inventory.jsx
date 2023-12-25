import React, { useEffect, useState } from 'react'
import { useData } from '../../providers/dataContext';
import style from './inventory.module.scss';
import InventoryItem from './InventoryItem';
import { useVisibility } from '../../providers/visibilityProvider';
import InventoryItemUsable from './InventoryItemUsable';
import { sendNui } from '../../utils/fetchNui';

export default function Inventory() {
    const { data } = useData();
    const { closeAllMenus } = useVisibility();
    const [quantity, setQuantity] = useState(0);
    const [openQuantityModal, setOpenQuantityModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleOpenQuantityModal = async (id) => {
        setOpenQuantityModal(true);
        setSelectedItem(id);
    }

    const handleGiveItem = async (id) => {
        await handleOpenQuantityModal(id).then(() => {
            console.log('give item')
            sendToNui('giveItem', { id: id, quantity: quantity })
        })
    }

    const handleDropItem = async (id) => {
        await handleOpenQuantityModal(id).then(() => {

            console.log('drop item')
            sendToNui('dropItem', { id: id, quantity: quantity })
        })
    }

    const handleUseItem = (id) => {
        console.log('use item')
        sendToNui('useItem', { id })
    }

    const sendToNui = (action, data) => {
        sendNui(action, data)
    }

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
                            if (item.useable) {
                                return <InventoryItemUsable key={index} item={item} handleGiveItem={handleGiveItem} handleUseItem={handleUseItem} handleDropItem={handleDropItem} />
                            }
                            else {
                                return <InventoryItem key={index} item={item} handleGiveItem={handleGiveItem} handleDropItem={handleDropItem} />
                            }
                        })}
                </div>
            </div>

            {openQuantityModal && (
                <div className={style.inventory__modalQuantity}>
                    <button onClick={setOpenQuantityModal(false)}>Fermer</button>

                    <header>
                        <h3>Veuillez indiquer la quantité</h3>
                    </header>
                    <input type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
            )}
        </div>
    )
}
