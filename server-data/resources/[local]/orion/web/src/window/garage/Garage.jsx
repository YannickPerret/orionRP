import React from 'react'
import { useData } from '../../providers/dataContext'
import style from './garage.module.scss'
import { sendNui } from '../../utils/fetchNui'
import { useVisibility } from '../../providers/visibilityProvider'

const GarageItem = ({ item }) => {
    return (
        <li className={style.garage__item}>
            <div>
                <div>
                    <h3>{item.id}</h3>
                    <h2>Prix : {item.priceToRetrieve}$</h2>
                </div>
                <div>
                    <button>Sortir</button>
                </div>
            </div>
        </li>
    )
}

export default function Garage() {
    const { data } = useData();
    const { closeAllMenus } = useVisibility();


    const handleVehicleStorage = () => {
        console.log('handleVehicleStorage');
        sendNui('storeVehicle', { garageId: data.garage.id });
        closeAllMenus(true);
    }

    const handleClose = () => {
        sendNui('closeGarage');
        closeAllMenus();
    }

    return (
        <div className={style.garage}>
            <div className={style.garage__container}>
                <header className={style.garage__header}>
                    <h1>{data.garage.name}</h1>
                </header>

                <div className={style.garage__content}>
                    <ul>
                        <li onClick={handleVehicleStorage} className={style.garage__item}>Ranger le véhicule</li>
                        {data.garage.vehicles.length >= 0 ? (
                            data.garage.vehicles.map((vehicle, index) => (
                                <GarageItem key={index} item={vehicle} />
                            ))
                        ) : (
                            <p>Vous n'avez pas de véhicule dans ce garage</p>
                        )}
                    </ul>

                    <div onClick={handleClose}>
                        <button>Fermer</button>
                    </div>

                    <div>
                        <h2>Infos</h2>
                        <p>Nombre de véhicule : {data.garage.vehicles.length}</p>
                        <p>Nombre de place : {data.garage.maxSlots}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
