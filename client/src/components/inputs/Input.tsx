import React, { FC, ChangeEvent } from 'react';

interface InputProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

const Input: FC<InputProps> = ({ label, name, placeholder, value, setValue }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={name} className='text-white'>{label}</label>
      <input
        type="text"
        autoComplete="off"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="bg-neutral-800 p-3 text-neutral-200 rounded-md"
      />
    </div>
  );
};

export default Input;