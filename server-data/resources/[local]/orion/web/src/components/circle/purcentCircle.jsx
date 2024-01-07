import React from 'react';
import style from './purcentBar.module.scss';

export default function CircleBar({ percentage, color, image }) {
    return (
        <div className={style.circle__container}>
            sfdsfsdfs
            <div className={style.circle__bar} style={{ width: `${percentage}%`, background: `${color}` }}></div>
            {//<img src={image} alt="Icône" class="circle__icon" />
            }
        </div>
    );
}
