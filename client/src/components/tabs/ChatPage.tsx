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
        saveMessage 
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
        });
    }, [messages, socket, setMessages, currentChatId]);

    useEffect(() => {
        socket?.on('chat', () => {
            getChats(user._id);
        });
    }, [user._id, socket, getChats]);

    const handleChatSelect = (chat: Chat) => {
        setCurrentChatId(chat._id);
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
                            <span className="font-medium">{chat.isGroupChat ? chat.groupName : chat.otherUserName}</span>
                            <span>
                                {chat.lastMessage?.content} - {formatDate(chat.lastMessage?.timestamp)}
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
                                    return (
                                        <Message key={index} content={message.content} timestamp={message.timestamp} isSender={isSender} />
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