import React, { useEffect } from 'react'
import './fuel.css'
import { useData } from '../../providers/dataContext';

export default function Fuel() {
  const { data, setData } = useData();

  return (
    <div className="fuel-bar-container">
      <div className="fuel-bar" style={{ width: `${data.vehicle.fuel}%` }}></div>
    </div>
  )
}
