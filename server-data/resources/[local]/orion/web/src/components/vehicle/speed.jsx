import React, { useEffect } from 'react'
import { useData } from '../../utils/dataContext';

export default function Speed() {
  const { data, setData } = useData();

  useEffect(() => {
    console.log(data.vehicle.speed);
  }
    , [data.vehicle.speed]);
  return (
    <div>{data.vehicle.speed} km/h</div>
  )
}
