import React, {useState} from 'react'

export default function amount({children, confirm, cancel}) {
    const [text, setText] = useState('');

    const handleConfirmAmount = () => {
        if (amount <= 0 || typeof amount !== 'number') return
        confirm(amount);
    }

    const handleCancelAmount = () => {
        cancel();
    }
  return (
    <div className='text'>
        <div className='text__header'>
            <p>{children}</p>
        </div>

        <div className='text__body'>
            <textarea type='text' className='amount__body--input' placeholder='Text' value={text} onChange={(e) => setText(e.target.value)} />
        </div>

        <div className='text__action'>
            <button className='amount__action--button' onClick={handleConfirmAmount}>Confirm</button>
            <button className='amount__action--button' onClick={handleCancelAmount}>Cancel</button>
        </div>
    </div>
  )
}
