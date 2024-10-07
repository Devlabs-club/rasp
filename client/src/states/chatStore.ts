import { create } from 'zustand';
import axios from 'axios';

interface ChatMessage {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

interface ChatState {
  chats: any[];
  messages: ChatMessage[];
  currentReceiver: string;
  setChats: (chats: any[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setCurrentReceiver: (receiver: string) => void;
  getChats: (userId: string) => Promise<void>;
  getMessages: (userId: string, receiverId: string) => Promise<void>;
  saveMessage: (sender: string, receiver: string, message: string) => Promise<void>;
}

const useChatStore = create<ChatState>((set) => ({
  chats: [],
  messages: [],
  currentReceiver: '',
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setCurrentReceiver: (receiver) => set({ currentReceiver: receiver }),
  getChats: async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/chat/getall/${userId}`);
      set({ chats: response.data });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },
  getMessages: async (userId, receiverId) => {
    try {
      const response = await axios.get<ChatMessage[]>(`http://localhost:5000/chat/get/${userId}/${receiverId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },
  saveMessage: async (sender, receiver, message) => {
    try {
      const response = await axios.post<ChatMessage>(`http://localhost:5000/chat/save/${sender}/${receiver}`, { message });
      if (response.status === 201) {
        set((state) => ({ messages: [...state.messages, response.data] }));
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  },
}));

export type { ChatMessage };
export default useChatStore;