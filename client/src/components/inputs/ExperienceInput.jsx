import React from 'react'
import { useState } from 'react';

import ArrayInput from './ArrayInput';
import Input from './Input';
import TextBox from './TextBox';

const ExperienceInput = ({items, setItems}) => {
    const defaultExperience = {
        role: "",
        company: "",
        description: "",
        skills: []
    }

    const [experience, setExperience] = useState(defaultExperience);
    
    const addItem = () => {
        if (!experience.name || items.find(item => item.name === experience.name)) return setExperience(defaultExperience);

        setItems([...items, experience]);

        setExperience(defaultExperience);
    }

  return (
    <div className='flex flex-col gap-2'>
        <label className='text-white'>Your experience</label>
        <div className="text-neutral-200 flex flex-col gap-2 rounded-md">
            {items.map((value, index) => <span className='text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700 cursor-pointer hover:bg-red-500 hover:line-through' key={index} onClick={() => {
                setItems(items => {
                    return items.filter((_, i) => i !== index)
                });
            }}>{value.role}</span>)}

            <Input label="your role" name="role" value={experience.role} setValue={(value) => setExperience(experience => {
                return {...experience, role: value};
            })} />
            <Input label="company name" name="company" value={experience.company} setValue={(value) => setExperience(experience => {
                return {...experience, company: value};
            })} />
            <TextBox label="tell us more!" name="projectDescription" value={experience.description} setValue={(value) => setExperience(experience => {
                return {...experience, description: value};
            })} />

            <ArrayInput label="skills" name="skills" items={experience.skills} setItems={(items) => setExperience(experience => {
                return {...experience, skills: items};
            })} />
            
            <button onClick={addItem} className="text-xl justify-self-end">+</button>
        </div>        
    </div>   
  )
}

export default ExperienceInput;