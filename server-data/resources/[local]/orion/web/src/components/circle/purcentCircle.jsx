import React from 'react';
import style from './purcentBar.module.scss';

export default function CircleBar({ percentage, color, image }) {
    return (
        <div className={style.circle__container}>
            <div className={style.circle__bar} style={{ width: `${percentage}%`, background: `${color}` }}></div>
        </div>
    );
}
