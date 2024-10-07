import React, { useEffect } from "react";
import UserCard from "../user/UserCard";
import SelectedUserCard from "../user/SelectedUserCard";
import Heading from "../text/Heading";
import Input from "../inputs/Input";
import SelectInput from "../inputs/SelectInput";
import SubmitButton from "../inputs/SubmitButton";
import useUserStore from "../../states/userStore";
import useSearchStore from "../../states/searchStore";
import isToxic from "../../utils/isToxic";

interface SearchProps {
  setCurrentTab: (tab: string) => void;
  setChatReceiver: (receiver: string) => void;
}

const Search: React.FC<SearchProps> = ({ setCurrentTab, setChatReceiver }) => {
  const { user, status, setStatus, fetchUserStatus, updateUserStatus } = useUserStore();
  const { 
    query, 
    searchResults, 
    selectedUser, 
    setQuery, 
    setSelectedUser, 
    searchUser 
  } = useSearchStore();

  useEffect(() => {
    fetchUserStatus(user?._id);
  }, [user?._id, fetchUserStatus]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchUser(query, user);
  };

  const openChat = (receiver: string) => {
    setChatReceiver(receiver);
    setCurrentTab("chat");
  };

  const setUserStatus = async (e: React.FormEvent) => {
    e.preventDefault();

    if (await isToxic(status.content)) {
      alert("Your status contains inappropriate content. Please remove it before saving.");
      return;
    }

    await updateUserStatus(user?._id, status.content, status.duration);
  }

  return (
    <div className="grid grid-cols-2 gap-20">
      <div className="flex flex-col gap-12">
        <Heading>Search for people!</Heading>
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            name="search"
            id="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            className="bg-neutral-800 p-3 text-neutral-200 rounded-md w-96"
            autoComplete="off"
          />
          <button type="submit" className="px-4 py-2 bg-white text-neutral-800 rounded-md">
            Search
          </button>
        </form>

        <form>
          <Input
            label="Status"
            name="content"
            placeholder="What's on your mind?"
            value={status.content}
            setValue={(value: string) => {
              setStatus({ ...status, content: value });
            }}
          />

          <SelectInput 
            label="Status Duration" 
            name="duration" 
            options={["24h", "48h", "1w"]} 
            value={status.duration} 
            setValue={(value: string) => {
              setStatus({ ...status, duration: value });
            }} 
          />
          <SubmitButton onClick={setUserStatus} />
        </form>

        <ul className="flex gap-4">
          {searchResults.map((user, index) => (
            <UserCard key={index} user={user} selectUser={setSelectedUser} />
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
