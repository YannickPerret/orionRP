import React from 'react'
import { useData } from '../../utils/dataContext';

export default function Speed() {
  const { data } = useData();
  return (
    <div>{data.vehicle.speed} km/h</div>
  )
}
