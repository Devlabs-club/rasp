import { create } from 'zustand';
import io, { Socket } from 'socket.io-client';
import useChatStore, { ChatMessage } from './chatStore';

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
      if (newMessage.chat === chatStore.currentChatId) {
        chatStore.setMessages([...chatStore.messages, newMessage]);
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