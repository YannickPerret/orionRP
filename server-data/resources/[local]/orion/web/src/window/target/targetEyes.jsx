import React from 'react'
import style from './targetEyes.module.scss'
import openEyes from '../../assets/images/target/openEyes.svg'
import { useData } from '../../providers/dataContext'
import { Cat, Cookie, Bird, CircleUserRound } from 'lucide-react'

const icons = {
    Cat, Cookie, Bird, CircleUserRound
};


// Composant pour afficher une option
function OptionItem({ name, iconName }) {
    const IconComponent = icons[iconName];

    if (!IconComponent) return null; // Si l'icône n'existe pas, ne rien rendre

    // Calculer l'angle de rotation pour chaque élément
    const rotationAngle = 360 / totalOptions;
    const rotation = rotationAngle * index;

    // Définir les styles pour la rotation et la translation
    const itemStyle = {
        transform: `rotate(${rotation}deg) translateX(-110px)`,
    };


    return (
        <li className={style.menu__item} style={itemStyle}>
            <a title={name}>
                <IconComponent size={30} />
            </a>
        </li>
    );
}


export default function TargetEyes() {

    const { data } = useData();
    const [checked, setChecked] = React.useState(true);
    const totalOptions = data.targetOptions.length;


    return (
        <nav className={style.menu}>
            <input type="checkbox" checked={checked} className={style.menu__toggler} onChange={(e) => setChecked(e.target.checked)} />
            <img src={openEyes} alt="Open Eyes" />
            <label for="menu-toggler"></label>
            {data.targetOptions.map((option, index) => (
                <OptionItem
                    key={index}
                    name={option.label}
                    iconName={option.icon}
                    index={index}
                    totalOptions={totalOptions} />
            ))}
        </nav >
    )
}
