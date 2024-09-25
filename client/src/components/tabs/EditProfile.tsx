import axios from "axios";
import { useState, FormEvent } from "react";

import Input from "../inputs/Input";
import ArrayInput from "../inputs/ArrayInput";
import SelectInput from "../inputs/SelectInput";
import TextBox from "../inputs/TextBox";
// import ProjectInput from "../inputs/ProjectInput";
// import ExperienceInput from "../inputs/ExperienceInput";
import SubmitButton from "../inputs/SubmitButton";
import Heading from "../text/Heading";
import EditUserCard from "../user/EditUserCard";

interface User {
    name: string;
    email: string;
    about: {
        dateOfBirth: Date | null;
        gender: string;
        campus: string;
        standing: string;
        major: string;
        skills: string[];
        projects: any[];
        experience: any[];
        hobbies: string[];
        socials: string[];
        bio: string;
    };
}

interface UserProfileProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
}

const defaultUser: User = {
    name: "",
    email: "",
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
}

const UserProfile: React.FC<UserProfileProps> = ({ user, setUser }) => {
    const [userData, setUserData] = useState<User>({
        ...defaultUser,
        ...user
    });

    const saveUser = async (e: FormEvent) => {
        e.preventDefault();

        const response = await axios.post("http://localhost:5000/user/save", { user: { ...user, ...userData } });
        console.log(response);

        if (response.status === 201) {
            setUser(user => ({ ...user, ...userData }));
        }
    };

    return (
        <div className="grid grid-cols-2 gap-20">
            <div className="flex flex-col gap-12">
                <Heading>Enter your information</Heading>

                <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-6 col-span-1">
                    <Input
                        label="your name"
                        name="name"
                        placeholder="e.g. forrest gump"
                        value={userData.name}
                        setValue={(value: string) => {
                            setUserData(userData => ({ ...userData, name: value }));
                        }}
                    />
                    <SelectInput
                        label="your gender"
                        name="gender"
                        options={["male", "female", "other"]}
                        value={userData.about.gender}
                        setValue={(value: string) => {
                            setUserData(userData => ({ ...userData, about: { ...userData.about, gender: value } }));
                        }}
                    />
                    <SelectInput
                        label="your asu campus"
                        name="campus"
                        options={["tempe", "downtown phoenix", "polytechnic", "online"]}
                        value={userData.about.campus}
                        setValue={(value: string) => {
                            setUserData(userData => ({ ...userData, about: { ...userData.about, campus: value } }));
                        }}
                    />
                    <SelectInput
                        label="your standing"
                        name="standing"
                        options={["freshman", "sophomore", "junior", "senior", "masters", "phd"]}
                        value={userData.about.standing}
                        setValue={(value: string) => {
                            setUserData(userData => ({ ...userData, about: { ...userData.about, standing: value } }));
                        }}
                    />
                    <Input
                        label="your major"
                        name="major"
                        placeholder="e.g. economics"
                        value={userData.about.major}
                        setValue={(value: string) => {
                            setUserData(userData => ({ ...userData, about: { ...userData.about, major: value } }));
                        }}
                    />
                    <ArrayInput
                        label="your skills"
                        name="skills"
                        placeholder="e.g. running, business, etc."
                        items={userData.about.skills}
                        setItems={(items: string[]) => setUserData(userData => ({ ...userData, about: { ...userData.about, skills: items } }))}
                    />
                    <ArrayInput
                        label="your hobbies"
                        name="hobbies"
                        placeholder="e.g. ping-pong, shrimping, etc."
                        items={userData.about.hobbies}
                        setItems={(items: string[]) => setUserData(userData => ({ ...userData, about: { ...userData.about, hobbies: items } }))}
                    />
                    <ArrayInput
                        label="your socials"
                        name="socials"
                        placeholder="e.g. instagram, github, etc."
                        items={userData.about.socials}
                        setItems={(items: string[]) => setUserData(userData => ({ ...userData, about: { ...userData.about, socials: items } }))}
                    />
                    {/* <ProjectInput items={userData.about.projects} setItems={(items) => setUserData(userData => {
                                        return {...userData, about: {...userData.about, projects: items}};
                                })} />
                                <ExperienceInput items={userData.about.experience} setItems={(items) => setUserData(userData => {
                                        return {...userData, about: {...userData.about, experience: items}};
                                })} /> */}
                    <TextBox
                        label="anything else about you"
                        name="bio"
                        placeholder="i lived a simple life, experienced so much, and then..."
                        value={userData.about.bio}
                        setValue={(value: string) => setUserData({ ...userData, about: { ...userData.about, bio: value } })}
                    />
                    <SubmitButton onClick={saveUser} />
                </form>
            </div>

            <div className="col-span-1">
                <EditUserCard user={{ ...user, ...userData }} />
            </div>
        </div>
    );
};

export default UserProfile;