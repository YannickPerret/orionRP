import React, {useState} from 'react'
import './amount.css'

export default function Amount({children, confirm, cancel}) {
    const [amount, setAmount] = useState(0);

    const handleConfirmAmount = () => {
        if (amount <= 0 || typeof amount !== 'number') return
        confirm(amount);
    }

    const handleCancelAmount = () => {
        cancel();
    }
  return (
    <div className='amount'>
        <div className='amount__header'>
            <p>{children}</p>
        </div>

        <div className='amount__body'>
            <input type='number' className='amount__body--input' placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className='amount__action'>
            <button className='amount__action--button' onClick={handleConfirmAmount}>Confirm</button>
            <button className='amount__action--button' onClick={handleCancelAmount}>Cancel</button>
        </div>
    </div>
  )
}
