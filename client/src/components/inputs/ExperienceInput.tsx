import React, { useState } from 'react';

import ArrayInput from './ArrayInput';
import Input from './Input';
import TextBox from './TextBox';

interface Experience {
    role: string;
    company: string;
    description: string;
    skills: string[];
}

interface ExperienceInputProps {
    items: Experience[];
    setItems: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceInput: React.FC<ExperienceInputProps> = ({ items, setItems }) => {
    const defaultExperience: Experience = {
        role: "",
        company: "",
        description: "",
        skills: []
    };

    const [experience, setExperience] = useState<Experience>(defaultExperience);

    const addItem = () => {
        if (!experience.role || items.find(item => item.role === experience.role)) return setExperience(defaultExperience);

        setItems([...items, experience]);

        setExperience(defaultExperience);
    };

    return (
        <div className='flex flex-col gap-2'>
            <label className='text-white'>Your experience</label>
            <div className="text-neutral-200 flex flex-col gap-2 rounded-md">
                {items.map((value, index) => (
                    <span
                        className='text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700 cursor-pointer hover:bg-red-500 hover:line-through'
                        key={index}
                        onClick={() => {
                            setItems(items => items.filter((_, i) => i !== index));
                        }}
                    >
                        {value.role}
                    </span>
                ))}

                <Input
                    label="your role"
                    name="role"
                    placeholder=""
                    value={experience.role}
                    setValue={(value) => setExperience(experience => ({ ...experience, role: value }))}
                />
                <Input
                    label="company name"
                    name="company"
                    placeholder=""
                    value={experience.company}
                    setValue={(value) => setExperience(experience => ({ ...experience, company: value }))}
                />
                <TextBox
                    label="tell us more!"
                    name="projectDescription"
                    placeholder=""
                    value={experience.description}
                    setValue={(value) => setExperience(experience => ({ ...experience, description: value }))}
                />
                <ArrayInput
                    label="skills"
                    name="skills"
                    placeholder=""
                    items={experience.skills}
                    setItems={(items) => setExperience(experience => ({ ...experience, skills: items }))}
                />

                <button onClick={addItem} className="text-xl justify-self-end">+</button>
            </div>
        </div>
    );
};

export default ExperienceInput;