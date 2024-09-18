import React from 'react'
import { FaChevronDown } from "react-icons/fa";

const SelectInput = ({label, name, options, value, setValue}) => {
  return (
    <div className='flex flex-col gap-2'>
        <label htmlFor={name} className='text-white'>{label}</label>
        <select value={value} onChange={(e) => setValue(e.target.value)} type="text" id={name} name={name} className="bg-neutral-800 p-3 text-neutral-200 rounded-md appearance-none" >
            <option value="" className='bg-neutral-900'>Select an option</option>
            {options.map((option, index) => 
              <option key={index} value={option} className='bg-neutral-900'>{option}</option>
            )}
            <FaChevronDown />
        </select>
    </div>   
  )
}

export default SelectInput;