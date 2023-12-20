import React from 'react'
import './fuel.css'
import { useData } from '../../utils/dataContext';

export default function Fuel() {
  const { data } = useData();
  console.log(data)
  return (
    <div className="fuel-bar-container">
      <div className="fuel-bar" style={{ width: `${data.vehicle.fuel}%` }}></div>
    </div>
  )
}
