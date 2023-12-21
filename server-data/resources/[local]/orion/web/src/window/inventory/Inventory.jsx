import React, { useEffect } from 'react'
import { useData } from '../../providers/dataContext';

export default function Inventory() {
    const { data } = useData();

    useEffect(() => {
        console.log(data);
    }, [data])

    return (
        <div>Inventory</div>
    )
}
