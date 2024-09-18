import axios from "axios";
import { useState } from "react";

import Input from "../inputs/Input";
import ArrayInput from "../inputs/ArrayInput";
import SelectInput from "../inputs/SelectInput";
import TextBox from "../inputs/TextBox";
import ProjectInput from "../inputs/ProjectInput";
import ExperienceInput from "../inputs/ExperienceInput";
import SubmitButton from "../inputs/SubmitButton";

const UserProfile = ({ user, setUser }) => {
    const [userData, setUserData] = useState({
        name: "",
        about: {
            dateOfBirth: null,
            gender: "",
            campus: "",
            standing: "",
            major: "",
            skills: [],
            projects: [],        
            experience: [],
            hobbies: [],
            socials: [],
            bio: ""
        },
        ...user
    });

    const saveUser = async (e) => {
        e.preventDefault();

        const data = await axios.post("http://localhost:5000/user/save", { user: {...user, ...userData} });
        console.log(data);

        if (data.status === 201) {
            setUser(user => {return {...user, ...userData}});
        }
    }

  return (
    <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-6 w-1/2">
        <Input label="your name" name="name" value={userData.name} setValue={(value) => {
            setUserData(userData => {
                return {...userData, name: value};
            });
        }} />
        <SelectInput label="your gender" name="gender" options={["male", "female", "other"]} value={userData.about.gender} setValue={(value) => {
            setUserData(userData => {return {...userData, about: {...userData.about, gender: value}}});
        }} />
        <SelectInput label="your asu campus" name="campus" options={["tempe", "downtown phoenix", "polytechnic", "online"]} value={userData.about.campus} setValue={(value) => {
            setUserData(userData => {return {...userData, about: {...userData.about, campus: value}}});
        }} />
        <SelectInput label="your standing" name="standing" options={["freshman", "sophomore", "junior", "senior", "masters", "phd"]} value={userData.about.standing} setValue={(value) => {
            setUserData(userData => {return {...userData, about: {...userData.about, standing: value}}});
        }} />
        <Input label="your major" name="major" value={userData.about.major} setValue={(value) => {
            setUserData(userData => {
                return {...userData, about: {...userData.about, major: value}};
            });
        }} />
        <ArrayInput label="your skills" name="skills" items={userData.about.skills} setItems={(items) => setUserData(userData => {
            return {...userData, about: {...userData.about, skills: items}};
        })} />
        <ArrayInput label="your hobbies" name="hobbies" items={userData.about.hobbies} setItems={(items) => setUserData(userData => {
            return {...userData, about: {...userData.about, hobbies: items}};
        })} />
        <ArrayInput label="your socials" name="socials" items={userData.about.socials} setItems={(items) => setUserData(userData => {
            return {...userData, about: {...userData.about, socials: items}};
        })} />
        <ProjectInput items={userData.about.projects} setItems={(items) => setUserData(userData => {
            return {...userData, about: {...userData.about, projects: items}};
        })} />
        <ExperienceInput items={userData.about.experience} setItems={(items) => setUserData(userData => {
            return {...userData, about: {...userData.about, experience: items}};
        })} />
        <TextBox label="anything else about you" name="bio" value={userData.about.bio} setValue={(value) => setUserData(
            {...userData, about: {...userData.about, bio: value}}
        )} />
        <SubmitButton onClick={saveUser} />
    </form>
  )
}

export default UserProfile