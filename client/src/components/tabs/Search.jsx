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

      <ul className="flex flex-col gap-4">
        { response.map((user, index) => {
          return (
            <li key={index}>
              <p>{user.name}</p>
              {
                Object.keys(user.about).map((key) => {
                  return (
                    <p>{key}: {JSON.stringify(user.about[key])}</p>
                  )
                })
              }
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Search;