import React from 'react';
import style from './purcentBar.module.scss';

function CircleBar({ percentage, color, image }) {
    return (
        <div className={style.circle__container}>
            <div className={ytyle.circle__bar} style={{ width: `${percentage}%`, background: `${color}` }}></div>
        </div>
    );
}
