import React, { useEffect } from 'react'
import { useData } from '../../providers/dataContext';
import './speed.css'

export default function Speed() {
  const { data, setData } = useData();

  return (
    <div className='VehicleSpeedometer'>{data.vehicle.speed} km/h</div>
  )
}
