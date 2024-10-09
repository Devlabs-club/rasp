import { create } from 'zustand';
import axios from 'axios';

interface ChatMessage {
  _id: string;
  sender: string;
  chat: string; // This is now just the chat ID
  content: string;
  timestamp: Date;
}

interface LastMessage {
  messageId: string;
  content: string;
  timestamp: Date;
  senderName: string;
}

interface Chat {
  _id: string;
  users: string[];
  groupName?: string;
  isGroupChat: boolean;
  pendingApprovals: string[];
  lastMessage: LastMessage;
  otherUserName: string;
}

interface ChatState {
  chats: Chat[];
  messages: ChatMessage[];
  currentChatId: string;
  message: string;
  setMessage: (message: string) => void;
  setChats: (chats: Chat[]) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setCurrentChatId: (chatId: string) => void;
  getChats: (userId: string) => Promise<void>;
  getMessages: (chatId: string) => Promise<void>;
  saveMessage: (chatId: string, senderId: string, message: string) => Promise<void>;
  createChat: (users: string[], name?: string, isGroupChat?: boolean) => Promise<string>;
}

const useChatStore = create<ChatState>((set) => ({
  chats: [],
  messages: [],
  currentChatId: '',
  message: '',
  setMessage: (message) => set({ message }),
  setChats: (chats) => set({ chats }),
  setMessages: (messages) => set({ messages }),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  getChats: async (userId) => {
    try {
      const response = await axios.get<Chat[]>(`http://localhost:5000/chat/getall/${userId}`);
      set({ chats: response.data });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },
  getMessages: async (chatId) => {
    try {
      const response = await axios.get<ChatMessage[]>(`http://localhost:5000/chat/get/${chatId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },
  saveMessage: async (chatId, senderId, message) => {
    try {
      const response = await axios.post<ChatMessage>(`http://localhost:5000/chat/save/${chatId}`, { senderId, message });
      if (response.status === 201) {
        set({ message: '' }); 
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  },
  createChat: async (users, name, isGroupChat = false) => {
    try {
      const response = await axios.post<Chat>('http://localhost:5000/chat/create', { users, name, isGroupChat });
      if (response.status === 201) {
        return response.data._id;
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
    return '';
  },
}));

export type { ChatMessage, Chat, LastMessage };
export default useChatStore;