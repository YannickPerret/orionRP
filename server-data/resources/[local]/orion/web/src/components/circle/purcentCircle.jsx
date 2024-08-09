import React from 'react';
import style from './purcentBar.module.scss';

export default function CircleBar({ percentage, color, image }) {
    const strokeDasharray = Math.PI * 100; // Circonférence du cercle
    const strokeDashoffset = ((100 - percentage) / 100) * strokeDasharray; // Calcul du décalage

    return (
        <div className={style.progress__circle}>
            <svg className={style.progress__svg}>
                <circle
                    stroke="lightgrey"
                    strokeWidth="20"
                    fill="none"
                />
                <circle
                    stroke={color}
                    strokeWidth="20"
                    fill="none"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={-strokeDashoffset}
                />
            </svg>
            <div className={style.icon__container}>
                {image}
            </div>
        </div>
    );
}
