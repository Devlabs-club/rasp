import React from 'react'

const Input = ({label, name, placeholder, value, setValue}) => {
  return (
    <div className='flex flex-col gap-2'>
        <label htmlFor={name} className='text-white'>{label}</label>
        <input type="text" autoComplete="off" id={name} name={name} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} className="bg-neutral-800 p-3 text-neutral-200 rounded-md"  />
    </div>   
  )
}

export default Input;