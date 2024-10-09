import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import useChatStore, { ChatMessage } from './chatStore';
import useUserStore from './userStore';

interface SocketState {
  socket: Socket | null;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connectSocket: (userId: string) => {
    const newSocket = io("http://localhost:5000", {
      query: { userId }
    });
    set({ socket: newSocket });

    newSocket.on('message', (newMessage: ChatMessage) => {
      const chatStore = useChatStore.getState();
      chatStore.addMessageToCache(newMessage.chat, newMessage);
      
      // Check if the current chat is the one receiving the message
      if (newMessage.chat === chatStore.currentChatId) {
        chatStore.setMessages([...chatStore.messages, newMessage]);
        chatStore.markMessagesAsRead(newMessage.chat);
      } else {
        // Increment unread count for the chat
        const chat = chatStore.chats.find(chat => chat._id === newMessage.chat);
        if (chat) {
          chatStore.updateChat({
            ...chat,
            unreadCount: (chat.unreadCount || 0) + 1
          });
        }
      }
    });
  },
  disconnectSocket: () => {
    set((state) => {
      state.socket?.disconnect();
      return { socket: null };
    });
  },
}));

export default useSocketStore;