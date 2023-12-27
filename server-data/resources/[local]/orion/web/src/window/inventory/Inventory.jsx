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
    const [actionType, setActionType] = useState(null);
    const [searchFilter, setSearchFilter] = useState('');

    const handleOpenQuantityModal = (id, action) => {
        setSelectedItem(id);
        setQuantity(0);
        setActionType(action);
        setOpenQuantityModal(true);
    };

    const handleConfirmQuantity = () => {
        sendToNui(actionType, { id: selectedItem, quantity: parseInt(quantity, 10) });
        setOpenQuantityModal(false);
        setActionType(null);
        setSelectedItem(null);
        closeAllMenus(true);
    };


    const handleGiveItem = async (id) => {
        handleOpenQuantityModal(id, 'giveItem');
    }

    const handleDropItem = async (id) => {
        handleOpenQuantityModal(id, 'dropItem');

    }

    const handleUseItem = (id, shouldClose) => {
        sendToNui('useItem', { id })
        if (shouldClose) {
            closeAllMenus(true);
        }
    }

    const handleResetQuantity = () => {
        setQuantity(0);
        setOpenQuantityModal(false);
        selectedItem(null);
        setActionType(null);
    }


    const sendToNui = (action, data) => {
        sendNui(action, data)
    }

    const handleSearchFilter = (value) => {
        if (value.length > 2) {
            setSearchFilter(value);
        }
        else {
            setSearchFilter(null);
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'i') {
                closeAllMenus();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [closeAllMenus])


    return (
        <div className={style.inventory}>
            <div className={style.inventory__close} onClick={closeAllMenus}>
                X
            </div>
            <div className={style.inventory__container}>
                <header>
                    <h1>Inventory</h1>
                    <h3>{data.inventory.weight} kg / {data.inventory.maxWeight} kg</h3>
                    <search>
                        <input type="text" placeholder="Search..." onChange={(e) => handleSearchFilter(e.target.value)} />
                    </search>
                </header>

                <div className={style.inventory__content}>
                    {data.inventory.items
                        .filter((item) => {
                            if (searchFilter) {
                                return item.label.toLowerCase().includes(searchFilter.toLowerCase());
                            }
                            else {
                                return true;
                            }
                        })
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map((item, index) => {
                            if (item.useable) {
                                return (<InventoryItemUsable key={index} item={item} giveItem={handleGiveItem} useItem={handleUseItem} dropItem={handleDropItem} />)
                            }
                            else {
                                return <InventoryItem key={index} item={item} giveItem={handleGiveItem} dropItem={handleDropItem} />
                            }
                        })}
                </div>
            </div>

            {openQuantityModal && (
                <div className={style.inventory__modalQuantity}>
                    <div className={style.inventory__modalQuantity__container} >
                        <header>
                            <h3>Veuillez indiquer la quantité</h3>
                        </header>
                        <input type='number' value={quantity} onChange={(e) => setQuantity(e.target.value)} min={0} autoFocus />
                        <button onClick={() => handleConfirmQuantity()}>Confirmer</button>
                        <button onClick={() => handleResetQuantity()}>Annuler</button>
                    </div>
                </div>
            )}
        </div>
    )
}
