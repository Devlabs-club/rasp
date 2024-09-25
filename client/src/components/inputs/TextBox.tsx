import React, { ChangeEvent } from 'react';

interface TextBoxProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
}

const TextBox: React.FC<TextBoxProps> = ({ label, name, placeholder, value, setValue }) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={name} className='text-white'>{label}</label>
      <textarea
        autoComplete="off"
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="bg-neutral-800 p-3 text-neutral-200 h-32 resize-none rounded-md"
      />
    </div>
  );
};

export default TextBox;