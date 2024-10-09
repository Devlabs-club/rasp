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
      const userStore = useUserStore.getState();
      chatStore.addMessageToCache(newMessage.chat, newMessage);
      if (newMessage.chat === chatStore.currentChatId) {
        chatStore.setMessages([...chatStore.messages, newMessage]);
      }

      // Update the chat in the chat list
      const updatedChat = chatStore.chats.find(chat => chat._id === newMessage.chat);
      if (updatedChat) {
        updatedChat.lastMessage = {
          messageId: newMessage._id,
          content: newMessage.content,
          timestamp: newMessage.timestamp,
          senderName: newMessage.sender === userStore.user._id ? userStore.user.name : updatedChat.otherUserName,
          senderId: newMessage.sender  // Add this line
        };
        chatStore.updateChat(updatedChat);
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