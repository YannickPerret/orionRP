import React, { useEffect } from 'react'
import Sealtbelt from '../../assets/images/seatbelt.svg'
import './seatbelt.css'

export default function Seatbelt() {

  useEffect(() => {
    console.log('Seatbelt')
  }, [])

  return (
    <div className='seatbelt'>
      <img src={Sealtbelt} alt="Seatbelt" />
    </div>
  )
}
