import axios from "axios";
import { useState, FormEvent, ChangeEvent } from "react";
import UserCard from "../user/UserCard";
import SelectedUserCard from "../user/SelectedUserCard";
import Heading from "../text/Heading";
import Chat from "./Chat";

interface User {
  id: string;
  name: string;
  email: string;
  relevantInfo: string;
}

interface ChatProps {
  sender: any;
  receiver: any;
}

const Search: React.FC<any> = ({ user }) => {
  const [response, setResponse] = useState<User[]>([]);
  const [query, setQuery] = useState<string>("");

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [openedChat, setOpenedChat] = useState<ChatProps | null>(null);

  const searchUser = async (e: FormEvent) => {
    e.preventDefault();

    const data = (await axios.post("http://localhost:5000/user/search", { query, user })).data;
    setSelectedUser(null);
    setResponse(data);
  };

  return (
    <div className="grid grid-cols-2 gap-20">
      <div className="flex flex-col gap-12">
        <Heading>Search for people!</Heading>
        <form onSubmit={searchUser} className="flex gap-4">
          <input
            type="text"
            name="search"
            id="search"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="bg-neutral-800 p-3 text-neutral-200 rounded-md w-96"
            autoComplete="off"
          />
          <button type="submit" className="px-4 py-2 bg-white text-neutral-800 rounded-md">
            Search
          </button>
        </form>

        <ul className="flex gap-4">
          {response.map((user, index) => (
            <UserCard key={index} user={user} setSelectedUser={setSelectedUser} />
          ))}
        </ul>
      </div>

      <div className="col-span-1">
        {openedChat ? <Chat sender={openedChat.sender} receiver={openedChat.receiver} /> : <></>}
        {selectedUser ? <SelectedUserCard user={user} selectedUser={selectedUser} setOpenedChat={setOpenedChat} /> : <></>}
      </div>
    </div>
  );
};

export default Search;