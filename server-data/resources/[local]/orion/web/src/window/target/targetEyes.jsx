import React from 'react'
import style from './targetEyes.module.scss'
import openEyes from '../../assets/images/target/openEyes.svg'
import { useData } from '../../providers/dataContext'
import { CircleUserRound, Trash2, Sandwich, CupSoda, Sofa } from 'lucide-react'
import { sendNui } from '../../utils/fetchNui'

const icons = {
    CircleUserRound, Trash2, Sandwich, CupSoda, Sofa
};


// Composant pour afficher une option
function OptionItem({ totalOptions, index, option, args }) {
    console.log("option", option, "args", args)
    const IconComponent = icons[option.icon];

    if (!IconComponent) return null; // Si l'icône n'existe pas, ne rien rendre

    // Calculer l'angle de rotation pour chaque élément
    const rotationAngle = 360 / totalOptions;
    const rotation = rotationAngle * index;
    // Rotation inverse pour l'icône
    const iconRotation = -rotation;

    // Définir les styles pour la rotation et la translation
    const itemStyle = {
        transform: `rotate(${rotation}deg) translateX(-110px)`,
    };

    // Styles pour la rotation de l'icône SVG
    const iconStyle = {
        transform: `rotate(${iconRotation}deg)`,
    };

    const handleClick = async () => {
        console.log("ffff")
        await sendNui('targetSelect', {
            action: option.action,
            args: args || null
        })
    }

    return (
        <li className={style.menu__item} style={itemStyle} onClick={handleClick}>
            <a title={option.label} alt={option.label}>
                <IconComponent size={30} color={option.color} style={iconStyle} />
            </a>
        </li>
    );
}


export default function TargetEyes() {

    const { data } = useData();
    const [checked, setChecked] = React.useState(true);

    return (
        <nav className={style.menu}>
            <input type="checkbox" checked={checked} className={style.menu__toggler} onChange={(e) => setChecked(e.target.checked)} />
            <img src={openEyes} alt="Open Eyes" />
            <label htmlFor="menu-toggler"></label>
            {data.targetOptions.actions?.map((option, index) => (
                <OptionItem
                    key={index}
                    option={option}
                    args={data.targetOptions.args}
                    index={index}
                    totalOptions={data.targetOptions.length} />
            ))}
        </nav >
    )
}
