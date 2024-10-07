import axios from "axios";
import { useState, FormEvent, ChangeEvent, useContext, useEffect } from "react";
import UserCard from "../user/UserCard";
import SelectedUserCard from "../user/SelectedUserCard";
import Heading from "../text/Heading";
import Input from "../inputs/Input";
import SelectInput from "../inputs/SelectInput";
import SubmitButton from "../inputs/SubmitButton";
import { UserContext, SocketContext } from "../../pages/Dashboard";

import * as toxicity from '@tensorflow-models/toxicity';

interface UserCardInfo {
  name: string;
  email: string;
  photo: any;
  relevantInfo: string;
}

interface Status {
  content: string;
  duration: string;
}

interface SearchProps {
  setCurrentTab: (tab: string) => void; // Added prop for tab management
  setChatReceiver: (receiver: string) => void; // New prop for setting chat receiver
}

const Search: React.FC<SearchProps> = ({ setCurrentTab, setChatReceiver }) => {
  const user = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [response, setResponse] = useState<UserCardInfo[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserCardInfo | null>(null);
  const [status, setStatus] = useState<Status>({
    content: "",
    duration: ""
  });

  useEffect(() => {
    const getStatus = async () => {
      const userStatus = await axios.get(`http://localhost:5000/user/status/${user?._id}`);
      if (userStatus?.data) {
        setStatus(userStatus.data);
      }
    }
    getStatus();

    socket.current?.on('status-delete', async (updatedStatus: any) => {
      setStatus(updatedStatus);    
    });
  }, [user._id, socket]);

  const searchUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = (await axios.post("http://localhost:5000/user/search", { query, user })).data;
      setResponse(data);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openChat = (receiver: string) => {
    setChatReceiver(receiver); // Set the chat receiver here
    setCurrentTab("chat"); // Change the active tab to "chat"
  };

  const selectUser = (user: UserCardInfo) => {
    setSelectedUser(user);
  };

  const setUserStatus = async (e: FormEvent) => {
    e.preventDefault();

    // const model = await toxicity.load(0.85, ['toxicity', 'severe_toxicity', 'identity_attack', 'insult', 'threat', 'sexual_explicit', 'obscene']);
    // const predictions = await model.classify([status.content]);

    // if (predictions[0].results.some(result => result.match)) {
    //     alert("Inappropriate content. Please remove it before saving.");
    //     return;
    // }

    const data = await axios.patch("http://localhost:5000/user/status", { status: status.content, duration: status.duration, userId: user?._id });

    if (data.status === 201) {
      console.log("status updated successfully");
    }
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
        {selectedUser && <SelectedUserCard selectedUser={selectedUser} openChat={openChat} />}
      </div>
    </div>
  );
};

export default Search;
