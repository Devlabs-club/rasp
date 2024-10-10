import { create } from 'zustand';
import axios from 'axios';
import { LRUCache } from 'lru-cache';

interface ChatMessage {
  _id: string;
  sender: string;
  senderName: string;
  chat: string;
  content: string;
  timestamp: Date;
}

interface LastMessage {
  messageId: string;
  content: string;
  timestamp: Date;
  senderName: string;
  senderId: string;
}

interface Chat {
  _id: string;
  users: string[];
  groupName?: string;
  isGroupChat: boolean;
  pendingApprovals: string[];
  lastMessage: LastMessage | null;
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
  getMessages: (chatId: string, page: number, limit: number) => Promise<void>;
  saveMessage: (chatId: string, senderId: string, message: string) => Promise<void>;
  createChat: (users: string[], name?: string, isGroupChat?: boolean) => Promise<string>;
  messageCache: LRUCache<string, ChatMessage[]>;
  addMessageToCache: (chatId: string, message: ChatMessage) => void;
  updateChat: (updatedChat: Chat) => void;
}

const useChatStore = create<ChatState>((set, get) => ({
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
  getMessages: async (chatId, page = 1, limit = 50) => {
    try {
      const cachedMessages = get().messageCache.get(chatId);
      if (cachedMessages && page === 1) {
        set({ messages: cachedMessages });
        return;
      }

      const response = await axios.get<ChatMessage[]>(
        `http://localhost:5000/chat/get/${chatId}?page=${page}&limit=${limit}`
      );
      set(state => {
        const newMessages = [...(state.messageCache.get(chatId) || []), ...response.data];
        state.messageCache.set(chatId, newMessages);
        state.messages = page === 1 ? response.data : [...state.messages, ...response.data];
        return state;
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  },
  saveMessage: async (chatId, senderId, message) => {
    try {
      const response = await axios.post<ChatMessage>(`http://localhost:5000/chat/save/${chatId}`, { senderId, message });
      if (response.status === 201) {
        set({ message: '' });
        
        // Update the chat locally
        const { chats, updateChat } = get();
        const updatedChat = chats.find(chat => chat._id === chatId);
        if (updatedChat) {
          updatedChat.lastMessage = {
            messageId: response.data._id,
            content: response.data.content,
            timestamp: response.data.timestamp,
            senderName: 'You',
            senderId: senderId
          };
          updateChat(updatedChat);
        }
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  },
  createChat: async (users, name, isGroupChat = false) => {
    try {
      const response = await axios.post<Chat>('http://localhost:5000/chat/create', { users, name, isGroupChat });
      if (response.status === 201 || response.status === 200) {
        set(state => ({
          chats: [response.data, ...state.chats]
        }));
        return response.data._id;
      }
    } catch (error) {
      console.error('Error creating/getting chat:', error);
    }
    return '';
  },
  messageCache: new LRUCache<string, ChatMessage[]>({
    max: 100,
    ttl: 1000 * 60 * 60, // Cache for 1 hour
  }),
  addMessageToCache: (chatId, message) => {
    set(state => {
      const chatMessages = state.messageCache.get(chatId) || [];
      state.messageCache.set(chatId, [...chatMessages, message]);
      console.log(state);
      return state;
    });
  },
  updateChat: (updatedChat: Chat) => set((state) => {
    const updatedChats = state.chats.map(chat => 
      chat._id === updatedChat._id ? {
        ...chat,
        ...updatedChat,
        lastMessage: updatedChat.lastMessage ? {
          ...updatedChat.lastMessage
        } : null,
        otherUserName: chat.otherUserName // Preserve the existing otherUserName
      } : chat
    );

    // Sort the chats
    updatedChats.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    });

    return { 
      ...state,
      chats: updatedChats 
    };
  }),
}));

export type { ChatMessage, Chat, LastMessage };
export default useChatStore;