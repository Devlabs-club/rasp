import axios from "axios";
import { useState, FormEvent, ChangeEvent } from "react";
import UserCard from "../user/UserCard";
import SelectedUserCard from "../user/SelectedUserCard";
import Heading from "../text/Heading";
import Chat from "../chat/Chat";
import Input from "../inputs/Input";
import SelectInput from "../inputs/SelectInput";
import SubmitButton from "../inputs/SubmitButton";

interface UserCardInfo {
  id: string;
  name: string;
  email: string;
  relevantInfo: string;
}

interface User {
  email: string;
  name: string;
  about: {
    gender?: string;
    campus?: string;
    major?: string;
    standing?: string;
    bio?: string;
    skills: string[];
    hobbies: string[];
    socials: string[];
  };
}

interface Status {
  content: string;
  duration: string;
}

interface ChatProps {
  sender: any;
  receiver: any;
}

const Search: React.FC<any> = ({ user }) => {
  const [response, setResponse] = useState<UserCardInfo[]>([]);
  const [query, setQuery] = useState<string>("");

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [openedChat, setOpenedChat] = useState<ChatProps | null>(null);

  const [status, setStatus] = useState<Status>({
    content: user?.about?.status?.content || "",
    duration: ""
  })

  const searchUser = async (e: FormEvent) => {
    e.preventDefault();

    const data = (await axios.post("http://localhost:5000/user/search", { query, user })).data;
    setSelectedUser(null);
    setResponse(data);
  };

  const openChat = (sender: User, receiver: User) => {
    setOpenedChat({ sender, receiver });
    setSelectedUser(null);
  };

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setOpenedChat(null);
  }

  const setUserStatus = async (e: FormEvent) => {
    e.preventDefault();
    const data = await axios.patch("http://localhost:5000/user/status", { status: status.content, duration: status.duration, userId: user._id });
    console.log(data);
  }

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

        <form>
          <Input label="Status" name="content" placeholder="What's on your mind?" value={status.content} setValue={(value) => {
            setStatus(prevStatus => ({ ...prevStatus, content: value }));
          }} />
          { user.about?.status?.content ? 
          <div>
            <p>Status expires at: {new Date(user.about.status.expirationDate).toLocaleString()}</p>
          </div>
          : 
          <></> }
          <SelectInput label="Status Duration" name="duration" options={["24h", "48h", "1w"]} value={status.duration} setValue={(value) => {
            setStatus(prevStatus => ({ ...prevStatus, duration: value }));
          }} />
          <SubmitButton onClick={setUserStatus} />
        </form>

        <ul className="flex gap-4">
          {response.map((user, index) => (
            <UserCard key={index} user={user} selectUser={selectUser} />
          ))}
        </ul>
      </div>

      <div className="col-span-1">
        {openedChat ? <Chat sender={openedChat.sender} receiver={openedChat.receiver} /> : <></>}
        {selectedUser ? <SelectedUserCard user={user} selectedUser={selectedUser} openChat={openChat} /> : <></>}
      </div>
    </div>
  );
};

export default Search;