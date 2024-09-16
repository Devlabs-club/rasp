import axios from "axios";
import { useState } from "react";

const UserProfile = ({ user, setUser }) => {
    const [about, setAbout] = useState({});

    const saveUser = async (e) => {
        e.preventDefault();

        const data = await axios.post("http://localhost:5000/user/save", { user: {...user, about} });
        console.log(data);

        if (data.status === 201) {
            setUser(user => {return {...user, about}});
        }
    }

  return (
    <form onSubmit={saveUser} className="flex flex-col gap-4">
        <div>
            <label htmlFor="">Age</label>
            <input className="bg-gray-700 outline-none border-none" type="number" name="age" id="age" onChange={(e) => setAbout(about => {return {...about, age: parseInt(e.target.value)}})} />
        </div>
        <div>
            <label htmlFor="">Gender</label>
            <input className="bg-gray-700 outline-none border-none" type="text" name="gender" onChange={(e) => setAbout(about => {return {...about, gender: e.target.value}})} />
        </div>
        <div>
            <label htmlFor="">Location</label>
            <input className="bg-gray-700 outline-none border-none" type="text" name="location" onChange={(e) => setAbout(about => {return {...about, location: e.target.value}})} />
        </div>
        <div>
            <label htmlFor="">Bio</label>
            <input className="bg-gray-700 outline-none border-none" type="text" name="bio" onChange={(e) => setAbout(about => {return {...about, bio: e.target.value}})} />
        </div>
        
        <button type="submit" className="bg-white px-4 py-2 text-black">Submit</button>
    </form>
  )
}

export default UserProfile