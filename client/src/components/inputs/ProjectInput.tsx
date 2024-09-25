// import React from 'react'
// import { useState } from 'react';

// import ArrayInput from './ArrayInput';
// import Input from './Input';
// import TextBox from './TextBox';

// const ProjectInput = ({items, setItems}) => {
//     const defaultProject = {
//         name: "",
//         description: "",
//         tools: [],
//         links: []
//     }

//     const [project, setProject] = useState(defaultProject);
    
//     const addItem = () => {
//         if (!project.name || items.find(item => item.name === project.name)) return setProject(defaultProject);

//         setItems([...items, project]);

//         setProject(defaultProject);
//     }

//   return (
//     <div className='flex flex-col gap-2'>
//         <label className='text-white'>Your projects</label>
//         <div className="text-neutral-200 flex flex-col gap-2 rounded-md">
//             {items.map((value, index) => <span className='text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700 cursor-pointer hover:bg-red-500 hover:line-through' key={index} onClick={() => {
//                 setItems(items => {
//                     return items.filter((_, i) => i !== index)
//                 });
//             }}>{value.name}</span>)}

//             <Input label="what's it called?" name="projectName" value={project.name} setValue={(value) => setProject(project => {
//                 return {...project, name: value};
//             })} />
//             <TextBox label="tell us more!" name="projectDescription" value={project.description} setValue={(value) => setProject(project => {
//                 return {...project, description: value};
//             })} />

//             <ArrayInput label="tools used" name="tools" items={project.tools} setItems={(items) => setProject(project => {
//                 return {...project, tools: items};
//             })} />

//             <ArrayInput label="links" name="links" items={project.links} setItems={(items) => setProject(project => {
//                 return {...project, links: items};
//             })} />
            
//             <button onClick={addItem} className="text-xl justify-self-end">+</button>
//         </div>        
//     </div>   
//   )
// }

// export default ProjectInput;