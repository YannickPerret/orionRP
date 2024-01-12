import React from 'react'
import style from './targetEyes.module.css'
import openEyes from '../../assets/images/target/openEyes.svg'
import { useData } from '../../providers/dataContext'

export default function TargetEyes() {
    const { data } = useData();
    return (
        <nav class="menu">
            <input checked="checked" class="menu-toggler" type="checkbox" /><img src={openEyes} />
            <label for="menu-toggler"></label>
            <ul>
                <li class="menu-item">
                    <a class="fas fa-cat" href=""></a>
                </li>
                <li class="menu-item">
                    <a class="fas fa-cookie-bite" href="#"></a>
                </li>
                <li class="menu-item">
                    <a class="fab fa-earlybirds" href="#"></a>
                </li>
                <li class="menu-item">
                    <a class="fab fa-fly" href="#"></a>
                </li>
                <li class="menu-item">
                    <a class="far fa-gem" href="#"></a>
                </li>
                <li class="menu-item">
                    <a class="fas fa-glass-cheers" href="#"></a>
                </li>
            </ul>
        </nav>
    )
}
