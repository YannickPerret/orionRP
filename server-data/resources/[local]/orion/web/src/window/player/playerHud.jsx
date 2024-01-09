import React from 'react'
import { useData } from '../../providers/dataContext';
import style from './playerHud.module.scss';
import CircleBar from '../../components/circle/purcentCircle';
import { Cookie, GlassWater } from 'lucide-react';


export default function PlayerHud() {
    const { data } = useData();
    return (
        <div className={style.playerHud}>
            {data.player.hunger > 0 &&
                <CircleBar percentage={data.player.hunger} color="#52B788" image={<Cookie size={40} color='#52B788' />} />}
            {data.player.thirst > 0 &&
                <CircleBar percentage={data.player.thirst} color="#F06449" image={<GlassWater size={40} color='#F06449' />} />}
            {data.player.drunk > 0 &&
                <CircleBar percentage={data.player.drunk} color="#D69F7E" image={<GlassWater size={40} color='#D69F7E' />} />}
            {data.player.drogue > 0 &&
                <CircleBar percentage={data.player.drogue} color="#FFBC42" image={<GlassWater size={40} color='#FFBC42' />} />}
        </div>
    )
}