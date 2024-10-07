import { create } from 'zustand';
import axios from 'axios';

interface UserCardInfo {
  name: string;
  email: string;
  photo: any;
  relevantInfo: string;
}

interface SearchState {
  query: string;
  searchResults: UserCardInfo[];
  selectedUser: UserCardInfo | null;
  setQuery: (query: string) => void;
  setSearchResults: (results: UserCardInfo[]) => void;
  setSelectedUser: (user: UserCardInfo | null) => void;
  searchUser: (query: string, currentUser: any) => Promise<void>;
}

const useSearchStore = create<SearchState>((set) => ({
  query: '',
  searchResults: [],
  selectedUser: null,
  setQuery: (query) => set({ query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSelectedUser: (user) => set({ selectedUser: user }),
  searchUser: async (query, currentUser) => {
    try {
      const response = await axios.post("http://localhost:5000/user/search", { query, user: currentUser });
      set({ searchResults: response.data });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },
}));

export default useSearchStore;