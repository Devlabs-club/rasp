import { create } from 'zustand';
import axios from 'axios';

interface UserState {
  user: any;
  setUser: (user: any) => void;
  status: {
    content: string;
    duration: string;
  };
  setStatus: (status: { content: string; duration: string }) => void;
  fetchUserStatus: (userId: string) => Promise<void>;
  updateUserStatus: (userId: string, content: string, duration: string) => Promise<void>;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  status: {
    content: '',
    duration: '',
  },
  setStatus: (status) => set({ status }),
  fetchUserStatus: async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/user/status/${userId}`);
      set({ status: response.data });
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  },
  updateUserStatus: async (userId, content, duration) => {
    try {
      await axios.patch('http://localhost:5000/user/status', { status: content, duration, userId });
      set({ status: { content, duration } });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  },
}));

export default useUserStore;