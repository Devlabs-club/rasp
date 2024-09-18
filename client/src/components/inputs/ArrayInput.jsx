import React from 'react'
import { useState } from 'react';

const ArrayInput = ({label, name, items, setItems}) => {
    const [value, setValue] = useState("");
    
    const addItem = () => {
        if (!value.trim() || items.includes(value)) return setValue("");

        setItems([...items, value]);

        setValue("");
    }

    const onKeyDown = (e) => {
        if (e.key === "Enter") addItem();
    }


    console.log(items);

  return (
    <div className='flex flex-col gap-2'>
        <label htmlFor={name} className='text-white'>{label}</label>
        <div className="bg-neutral-800 px-5 py-3 text-neutral-200 flex flex-wrap gap-2 rounded-md">
            {items ? items.map((value, index) => <span className='text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700 cursor-pointer hover:bg-red-500 hover:line-through' key={index} onClick={() => {
                setItems(items.filter((_, i) => i !== index));
            }}>{value}</span>) : <></>}

            <input type="text" id={name} name={name} value={value} className='text-neutral-200 outline-none bg-neutral-800 flex-grow' onChange={(e) => setValue(e.target.value)} onKeyDown={onKeyDown} />
            
            <button onClick={addItem} className="text-xl place-self-end">+</button>
        </div>        
    </div>   
  )
}

export default ArrayInput;