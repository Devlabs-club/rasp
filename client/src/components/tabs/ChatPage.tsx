import React, { useEffect, useRef, useCallback, useState} from "react";
import useSocketStore from '../../states/socketStore';
import useUserStore from '../../states/userStore';
import useChatStore, { ChatMessage, Chat } from '../../states/chatStore';
import Message from "../chat/Message";
import { formatDate } from "../../utils/formatDateTime";
import Input from "../inputs/Input";
import SubmitButton from "../inputs/SubmitButton";

const ChatPage: React.FC = () => {
    const { user } = useUserStore();
    const { 
        chats, 
        messages, 
        currentChatId, 
        message,
        messageCache,
        setMessage,
        setMessages, 
        setCurrentChatId, 
        getChats, 
        getMessages, 
        saveMessage,
        updateChat,
        markMessagesAsRead
    } = useChatStore();

    const { socket } = useSocketStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() => {
        setMessages([]);
        setMessage("");
        getChats(user._id);

        if (currentChatId) {
            setPage(1);
            if (messageCache.get(currentChatId)) {
                setMessages(messageCache.get(currentChatId) || []);
            } else {
                getMessages(currentChatId, 1, 50);
            }
        }
    }, [user, currentChatId, getChats, getMessages, setMessages, setMessage, messageCache]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket?.on('message', (newMessage: ChatMessage) => {
            console.log(newMessage);
            
            if(newMessage.chat === currentChatId) {
                setMessages([...messages, newMessage]);
            }        
            
            // Update the chat in the chat list
            const updatedChat = chats.find(chat => chat._id === newMessage.chat);
            if (updatedChat) {
                updatedChat.lastMessage = {
                    messageId: newMessage._id,
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                    senderName: newMessage.sender === user._id ? user.name : updatedChat.otherUserName,
                    senderId: newMessage.sender
                };
                updateChat(updatedChat);
            }
        });
    }, [socket, messages, setMessages, currentChatId, chats, updateChat, user._id, user.name]);

    useEffect(() => {
        socket?.on('chat', (updatedChat: Chat) => {
            updateChat(updatedChat);
        });
    }, [socket, updateChat]);

    const handleChatSelect = async (chat: Chat) => {
        setCurrentChatId(chat._id);
        await markMessagesAsRead(chat._id);
    };

    const handleSaveMessage = async () => {
        await saveMessage(currentChatId, user._id, message);
        setMessage("");
    };

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop === 0 && !isLoading) {
            setIsLoading(true);
            getMessages(currentChatId, page + 1, 50).then(() => {
                setPage(prevPage => prevPage + 1);
                setIsLoading(false);
            });
        }
    }, [currentChatId, getMessages, isLoading, page]);

    const getCurrentChat = useCallback(() => {
        const chat = chats.find(chat => chat._id === currentChatId);
        if (chat && !chat.isGroupChat) {
            // const otherUserId = chat.users.find(userId => userId !== user._id);
            chat.otherUserName = chats.find(c => c._id === chat._id)?.otherUserName || 'Unknown';
        }
        return chat;
    }, [chats, currentChatId]);

    return (
        <div className="flex h-full">
            <div className="h-full w-64 text-white p-4" style={{ backgroundColor: '#262626' }}>
                <h2 className="text-lg font-bold mb-4">chats</h2>
                <ul className="space-y-2">
                    {chats.map((chat, index) => (
                        <li
                            key={index}
                            onClick={() => handleChatSelect(chat)}
                            className={`flex flex-col p-2 rounded-md cursor-pointer transition-all ${chat._id === currentChatId ? "bg-gray-600" : "bg-neutral-900"}`}
                        >
                            <span className="font-medium flex justify-between">
                                {chat.isGroupChat ? chat.groupName : chat.otherUserName}
                                {chat.unreadCount > 0 && (
                                    <span className="bg-orange-500 text-white rounded-full px-2 py-1 text-xs">
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </span>
                            <span>
                                {chat.lastMessage?.senderId === user._id ? "You" : chat.lastMessage?.senderName}: {chat.lastMessage?.content} - {formatDate(chat.lastMessage?.timestamp)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Main Chat Panel */}
            <div className="flex-1 p-6 bg-black">
                <div className="h-full flex flex-col">
                    {currentChatId ? (
                        <div className="overflow-y-scroll flex flex-col-reverse gap-4 h-full" onScroll={handleScroll}>
                            <div ref={messagesEndRef} />
                            <div className='flex gap-4'>
                                <Input name="message" placeholder="Hey, I think you're super cool!" value={message} setValue={setMessage} />
                                <SubmitButton onClick={handleSaveMessage} />
                            </div>

                            <div className="mt-auto flex flex-col gap-2">
                                {messages.map((message, index) => {
                                    const isSender = message.sender === user?._id;
                                    const senderName = isSender ? "You" : getCurrentChat()?.otherUserName || 'Unknown';
                                    return (
                                        <Message 
                                            key={index} 
                                            content={message.content} 
                                            timestamp={message.timestamp} 
                                            isSender={isSender}
                                            senderName={senderName}
                                        />
                                    );
                                })}
                            </div>
                            {isLoading && <div>Loading more messages...</div>}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">Select a chat to start messaging!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ChatPage;