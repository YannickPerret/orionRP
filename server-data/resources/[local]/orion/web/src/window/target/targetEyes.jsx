import React from 'react'
import style from './targetEyes.module.css'
import openEyes from '../../assets/images/target/openEyes.svg'

export default function TargetEyes() {
    return (
        <div className={style.eye}><img src={openEyes} /></div>
    )
}
