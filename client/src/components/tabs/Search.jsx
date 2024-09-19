import axios from "axios";
import { useState } from "react";
import UserCard from "../user/UserCard";
import SelectedUser from "../user/SelectedUser";
import Heading from "../text/Heading";

const Search = () => {
  const [response, setResponse] = useState([]);
  const [query, setQuery] = useState("");

  const searchUser = async (e) => {
    e.preventDefault();

    const data = (await axios.post("http://localhost:5000/user/search", { query: query })).data
    setResponse(data);
  }

  return (
    <div className="flex flex-col gap-12">
      <Heading>Search for users!</Heading>
      <form onSubmit={searchUser} className="flex gap-4">
        <input type="text" name="search" id="search" onChange={(e) => setQuery(e.target.value)} className="bg-neutral-800 p-3 text-neutral-200 rounded-md w-96" autoComplete="off" />
        <button type="submit" className="px-4 py-2 bg-white text-neutral-800 rounded-md">Search</button>
      </form>

      <ul className="flex gap-4">
        { response.map((user, index) => <SelectedUser key={index} user={user} />)}
        {/* <SelectedUser user={user} /> */}
      </ul>
    </div>
  )
}

export default Search;