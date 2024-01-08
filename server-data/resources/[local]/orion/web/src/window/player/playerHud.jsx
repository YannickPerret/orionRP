import React from 'react'
import { useData } from '../../providers/dataContext';
import style from './playerHud.module.scss';
import CircleBar from '../../components/circle/purcentCircle';
import { Cookie, GlassWater } from 'lucide-react';


export default function PlayerHud() {
    const { data } = useData();
    return (
        <div className={style.playerHud}>
            <CircleBar percentage={data.player.hunger} color="#52B788" image={<Cookie size={40} color='#52B788' />} />
            <CircleBar percentage={data.player.thirst} color="#F06449" image={<GlassWater size={40} color='#F06449' />} />
        </div>
    )
}