import React from 'react'
import { useData } from '../../providers/dataContext'
import style from './garage.module.scss'
import { sendNui } from '../../utils/fetchNui'
import { useVisibility } from '../../providers/visibilityProvider'

const GarageItem = ({ item }) => {
    const { data } = useData();
    const { closeAllMenus } = useVisibility();

    return (
        <li>
            <div>
                <div>
                    <h3>{item.name}</h3>
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

    const handleVehicleStorage = () => {
        console.log('handleVehicleStorage');
        sendNui('storeVehicle', { garageId: data.garage.id });
        closeAllMenus(true);
    }

    return (
        <div className={style.garage}>
            <div className={style.garage__container}>
                <header className={style.garage__header}>
                    <h1>{data.garage.name}</h1>
                </header>

                <div className={style.garage__content}>
                    <ul>
                        <li onClick={handleVehicleStorage}>Ranger le véhicule</li>
                        {data.garage.vehicles.length == 0 ? (
                            data.garage.vehicles.map((vehicle, index) => (
                                <GarageItem key={index} item={vehicle} />
                            ))
                        ) : (
                            <p>Vous n'avez pas de véhicule dans ce garage</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
