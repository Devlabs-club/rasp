import axios from "axios";
import { useState } from "react";

const Search = () => {
  const [response, setResponse] = useState([]);
  const [query, setQuery] = useState("");

  const searchUser = async (e) => {
    e.preventDefault();

    const data = (await axios.post("http://localhost:5000/user/search", { query: query })).data;
    setResponse(data);
  }

  console.log(response);

  return (
    <div>
      <form onSubmit={searchUser}>
        <input className="bg-gray-700 outline-none border-none" type="text" name="search" id="search" onChange={(e) => setQuery(e.target.value)} />
        <button type="submit text-white">Search</button>
      </form>

      <ul>
        { response.map((user, index) => {
          return (
            <li key={index}>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.about.age} year old {user.about.gender} from {user.about.location}.</p>
              <p>{user.about.bio}</p>
              <p>{user.about.projects}</p>
              <p>{user.about.skills}</p>
              <p>{user.about.experience}</p>
              <p>{user.about.hobbies}</p>
              <p>{user.about.socials}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Search;