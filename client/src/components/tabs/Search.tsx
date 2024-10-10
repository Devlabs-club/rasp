import axios from "axios";
import { useState, FormEvent, ChangeEvent, useContext } from "react";
import UserCard from "../user/UserCard";
import SelectedUserCard from "../user/SelectedUserCard";
import Heading from "../text/Heading";
import Input from "../inputs/Input";
import SelectInput from "../inputs/SelectInput";
import SubmitButton from "../inputs/SubmitButton";
import { UserContext } from "../../pages/Dashboard";

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
  setChatReceiver: (receiver: UserCardInfo | null) => void; // New prop for setting chat receiver
}

const Search: React.FC<SearchProps> = ({ setCurrentTab, setChatReceiver }) => {
  const user = useContext(UserContext);
  const [response, setResponse] = useState<UserCardInfo[]>([]);
  const [query, setQuery] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<UserCardInfo | null>(null);
  const [status, setStatus] = useState<Status>({
    content: user?.about?.status?.content || "",
    duration: ""
  });

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

  const openChat = (receiver: UserCardInfo) => {
    setChatReceiver(receiver); // Set the chat receiver here
    setCurrentTab("chat"); // Change the active tab to "chat"
  };

  const selectUser = (user: UserCardInfo) => {
    setSelectedUser(user);
  };

  const setUserStatus = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await axios.patch("http://localhost:5000/user/status", {
        status: status.content,
        duration: status.duration,
        userId: user?._id,
      });
      console.log(data);
    } catch (error) {
      console.error("Error setting status:", error);
    }
  };

  // Function to calculate the remaining time in days or hours
  const calculateRemainingTime = (expirationDate: string) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const timeDiff = expiration.getTime() - now.getTime();
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day(s)`;
    } else if (hours > 0) {
      return `${hours} hour(s)`;
    } else {
      return "Expired";
    }
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

        {/* Status Input and Duration Dropdown Side-by-Side */}
        <form className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="w-72"> {/* Apply width here */}
              <Input 
                label="Status" 
                name="content" 
                placeholder="What's on your mind?" 
                value={status.content} 
                setValue={(value) => {
                  setStatus(prevStatus => ({ ...prevStatus, content: value }));
                }} 
              />
            </div>
            <div className="w-30"> {/* Apply width here */}
              <SelectInput 
                label="Duration" 
                name="duration" 
                options={["24h", "48h", "1w"]} 
                value={status.duration} 
                setValue={(value) => {
                  setStatus(prevStatus => ({ ...prevStatus, duration: value }));
                }} 
              />
            </div>
          </div>
          <div className="mt-9">
            <SubmitButton onClick={setUserStatus} />
          </div>

        </form>
        
        {user?.about?.status?.content && user?.about?.status?.expirationDate ? (
          <div>
            <p>
              Status expires in {calculateRemainingTime(user.about.status.expirationDate)}
            </p>
          </div>
        ) : null}

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
