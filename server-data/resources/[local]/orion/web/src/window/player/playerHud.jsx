import React from 'react'
import { useData } from '../../providers/dataContext';
import style from './playerHud.module.scss';
import CircleBar from '../../components/circle/purcentCircle';


export default function PlayerHud() {
    const { data } = useData();
    return (
        <div className={style.playerHud}>
            <CircleBar percentage={data.player.hunger} color="#FF0000" image="https://i.imgur.com/0QZaY5b.png" />
            <CircleBar percentage={data.player.thirst} color="#0000FF" image="https://i.imgur.com/0QZaY5b.png" />
        </div>
    )
}